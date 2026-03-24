import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../lib/gemini';
import Markdown from 'react-markdown';
import { Send, Bot, User, Loader2, Mic, Square } from 'lucide-react';
import { AudioButton } from './AudioButton';

interface Message {
  role: 'user' | 'model';
  text: string;
  isAudio?: boolean;
}

export function ChatTutor({ nativeLang, targetLang }: { nativeLang: string, targetLang: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hello! I am your AI tutor. I can help you learn ${targetLang} from ${nativeLang}. You can type or use the microphone to speak to me!` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    chatRef.current = createChatSession(nativeLang, targetLang);
    setMessages([
      { role: 'model', text: `Hello! I am your AI tutor. I can help you learn ${targetLang} from ${nativeLang}. You can type or use the microphone to speak to me!` }
    ]);
  }, [nativeLang, targetLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = (reader.result as string).split(',')[1];
          await handleSendAudio(base64data, 'audio/webm');
        };
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Please allow microphone access to use voice chat.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSendAudio = async (base64Audio: string, mimeType: string) => {
    setMessages(prev => [...prev, { role: 'user', text: '🎤 (Voice Message)', isAudio: true }]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({
        message: [
          { inlineData: { data: base64Audio, mimeType } },
          { text: `Please respond to this spoken audio. If I spoke in ${nativeLang}, teach me how to say it in ${targetLang}. If I spoke in ${targetLang}, correct my grammar and reply.` }
        ]
      });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (error) {
      console.error("Audio chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I could not process the audio.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Voice AI Tutor</h2>
          <p className="text-indigo-200 text-sm">Practice {targetLang} through text or voice</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 flex flex-col gap-2 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
            }`}>
              <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                <Markdown>{msg.text}</Markdown>
              </div>
              {msg.role === 'model' && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                  <AudioButton text={msg.text} className="bg-slate-50" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Bot size={20} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-slate-400" />
              <span className="text-slate-500 text-sm">Listening & Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSendText} className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type in ${nativeLang} or ${targetLang}...`}
            className="flex-1 px-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl outline-none transition-all"
            disabled={isLoading || isRecording}
          />
          
          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-colors flex items-center justify-center animate-pulse"
              title="Stop Recording"
            >
              <Square size={24} />
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              disabled={isLoading}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
              title="Hold to Speak"
            >
              <Mic size={24} />
            </button>
          )}

          <button
            type="submit"
            disabled={!input.trim() || isLoading || isRecording}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
