import React, { useState, useEffect } from 'react';
import { generateVocabulary } from '../lib/gemini';
import { Loader2, RefreshCw } from 'lucide-react';
import { AudioButton } from './AudioButton';

interface VocabItem {
  native_word: string;
  target_word: string;
  target_pronunciation: string;
  explanation: string;
}

const TOPICS = ['Greetings', 'Numbers', 'Family', 'Food', 'Common Verbs'];

export function Vocabulary({ nativeLang, targetLang }: { nativeLang: string, targetLang: string }) {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [items, setItems] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVocab = async (selectedTopic: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateVocabulary(selectedTopic, nativeLang, targetLang);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocab(topic);
  }, [topic, nativeLang, targetLang]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Vocabulary Builder</h2>
          <p className="text-slate-600 mt-2">Learn essential {targetLang} words and phrases.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {TOPICS.map(t => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                topic === t 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Generating {targetLang} vocabulary...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <AudioButton text={item.native_word} className="bg-slate-100" />
                  <h3 className="text-2xl font-bold text-slate-900">{item.native_word}</h3>
                </div>
                <p className="text-slate-600 text-sm ml-12">{item.explanation}</p>
              </div>

              <div className="flex-1 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Pronunciation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AudioButton text={item.target_pronunciation} className="bg-white shadow-sm" />
                    <p className="text-lg font-medium text-indigo-900">{item.target_pronunciation}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{targetLang} Script</span>
                  </div>
                  <p className="text-2xl text-indigo-900 ml-12">{item.target_word}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <button 
          onClick={() => fetchVocab(topic)}
          className="mt-8 flex items-center gap-2 mx-auto text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <RefreshCw size={18} />
          Generate More Words
        </button>
      )}
    </div>
  );
}
