'use client';

import { useState, useRef, useEffect } from 'react';
import { handleChat, handleTextToSpeech, handleSpeechToText } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, Volume2, StopCircle, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [isPending, setIsPending] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePlayAudio = async (text: string, messageId: number) => {
    if (audioPlaying === messageId) {
      audioRef.current?.pause();
      setAudioPlaying(null);
      return;
    }

    setAudioPlaying(messageId);
    try {
      const { media } = await handleTextToSpeech({ text });
      if (media) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = media;
        audioRef.current.play();
        audioRef.current.onended = () => {
          setAudioPlaying(null);
        };
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      setAudioPlaying(null);
    }
  };
  
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const { text } = await handleSpeechToText({ audioDataUri: base64Audio });
        setInput(text);
      };
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error during transcription',
            description: 'Could not transcribe the audio. Please try again.',
        });
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          transcribeAudio(audioBlob);
          stream.getTracks().forEach(track => track.stop()); // Stop the microphone access
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Microphone access denied',
            description: 'Please enable microphone permissions in your browser settings.',
        });
      }
    }
  };

  const submitQuery = async (query: string) => {
    if (!query.trim() || isPending) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: query,
      sender: 'user',
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsPending(true);

    try {
      const result = await handleChat({ userQuery: query, language });
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: result.response,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsPending(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitQuery(input);
  };

  return (
    <>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="h-[400px] flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 text-sm',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 relative group',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.text}
                   {message.sender === 'ai' && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handlePlayAudio(message.text, message.id)}
                    >
                      {audioPlaying === message.id ? (
                        <StopCircle className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && (
                <div className="flex gap-3 text-sm justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
            <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                    <SelectItem value="Telugu">Telugu</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                </SelectContent>
            </Select>
            <Input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isRecording ? 'Recording...' : 'Ask a question...'}
                className="flex-1"
                disabled={isPending || isRecording}
            />
             <Button type="button" size="icon" onClick={handleToggleRecording} variant={isRecording ? 'destructive' : 'outline'}>
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </Button>
            <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
        </form>
      </CardFooter>
    </>
  );
}
