import React from 'react';
import { ArrowRight, Sparkles, Globe2, BookA, Mic } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: 'vocab' | 'chat' | 'quiz') => void;
  nativeLang: string;
  targetLang: string;
}

export function Home({ onNavigate, nativeLang, targetLang }: HomeProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 border border-slate-800 p-12">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-indigo-500/10">
          <Globe2 size={400} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-6 border border-indigo-500/30">
            <Sparkles size={14} />
            <span>Powered by Gemini 3.1 Pro & Voice AI</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{targetLang}</span> from {nativeLang}
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            A universal language platform designed for everyone. Whether you prefer reading or listening, our AI tutor adapts to your style with full voice support.
          </p>
          <button 
            onClick={() => onNavigate('vocab')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-900/50 hover:shadow-indigo-900/80"
          >
            Start Learning <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('vocab')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookA size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Vocabulary Builder</h3>
          <p className="text-slate-600 leading-relaxed">
            Learn essential words with audio pronunciation. Perfect for visual and auditory learners alike.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('chat')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Mic size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Voice AI Tutor</h3>
          <p className="text-slate-600 leading-relaxed">
            Can't read or write? No problem. Speak directly to your AI tutor and listen to its responses in real-time.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('quiz')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Globe2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Quizzes</h3>
          <p className="text-slate-600 leading-relaxed">
            Test your knowledge with dynamic quizzes featuring audio support for every question.
          </p>
        </div>
      </section>
    </div>
  );
}
