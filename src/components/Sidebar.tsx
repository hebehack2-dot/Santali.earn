import React from 'react';
import { BookOpen, MessageSquare, GraduationCap, Home, Languages } from 'lucide-react';
import { cn } from '../lib/utils';
import { LANGUAGES } from '../App';

export type ViewState = 'home' | 'vocab' | 'chat' | 'quiz';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  nativeLang: string;
  setNativeLang: (lang: string) => void;
  targetLang: string;
  setTargetLang: (lang: string) => void;
}

export function Sidebar({ currentView, onChangeView, nativeLang, setNativeLang, targetLang, setTargetLang }: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'vocab', label: 'Vocabulary', icon: BookOpen },
    { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
    { id: 'quiz', label: 'Practice Quiz', icon: GraduationCap },
  ] as const;

  return (
    <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="bg-indigo-500 text-white p-1.5 rounded-lg">
            <Languages size={20} />
          </span>
          Polyglot AI
        </h1>
        <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">Universal Language Tutor</p>
      </div>

      <div className="px-6 py-4 border-y border-slate-800 bg-slate-800/50 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">I speak</label>
          <select 
            value={nativeLang}
            onChange={(e) => setNativeLang(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">I want to learn</label>
          <select 
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon size={18} className={isActive ? "text-indigo-200" : "text-slate-400"} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
