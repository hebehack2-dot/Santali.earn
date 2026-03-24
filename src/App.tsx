import React, { useState } from 'react';
import { Sidebar, ViewState } from './components/Sidebar';
import { Home } from './components/Home';
import { Vocabulary } from './components/Vocabulary';
import { ChatTutor } from './components/ChatTutor';
import { Quiz } from './components/Quiz';

export const LANGUAGES = [
  'English', 'Santali', 'Hindi', 'Bengali', 'Odia', 'Spanish', 'French', 'Mandarin', 'Arabic'
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [nativeLang, setNativeLang] = useState('Santali');
  const [targetLang, setTargetLang] = useState('English');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} nativeLang={nativeLang} targetLang={targetLang} />;
      case 'vocab':
        return <Vocabulary nativeLang={nativeLang} targetLang={targetLang} />;
      case 'chat':
        return <ChatTutor nativeLang={nativeLang} targetLang={targetLang} />;
      case 'quiz':
        return <Quiz nativeLang={nativeLang} targetLang={targetLang} />;
      default:
        return <Home onNavigate={setCurrentView} nativeLang={nativeLang} targetLang={targetLang} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        nativeLang={nativeLang}
        setNativeLang={setNativeLang}
        targetLang={targetLang}
        setTargetLang={setTargetLang}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 md:p-12 h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
