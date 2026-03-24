import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../lib/gemini';
import { Loader2, CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { AudioButton } from './AudioButton';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export function Quiz({ nativeLang, targetLang }: { nativeLang: string, targetLang: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuizComplete(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    try {
      const data = await generateQuiz(nativeLang, targetLang);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [nativeLang, targetLang]);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    if (option === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium text-lg">Generating your personalized {targetLang} quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
        <p className="mb-4">{error}</p>
        <button onClick={fetchQuiz} className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
        <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Quiz Complete!</h2>
        <p className="text-xl text-slate-600 mb-8">
          You scored <span className="font-bold text-indigo-600">{score}</span> out of {questions.length}
        </p>
        <button 
          onClick={fetchQuiz}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-900/20 flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={20} />
          Take Another Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Practice Quiz</h2>
          <p className="text-slate-500 mt-1">Test your {targetLang} knowledge</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4 mb-8">
          <AudioButton text={currentQ.question} className="bg-slate-100 mt-1 shrink-0" />
          <h3 className="text-2xl font-semibold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQ.correctAnswer;
            
            let btnClass = "w-full text-left p-5 rounded-xl border-2 transition-all font-medium text-lg flex items-center justify-between ";
            
            if (!isAnswered) {
              btnClass += "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700";
            } else if (isCorrect) {
              btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
            } else if (isSelected && !isCorrect) {
              btnClass += "border-red-500 bg-red-50 text-red-800";
            } else {
              btnClass += "border-slate-200 bg-slate-50 text-slate-400 opacity-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center gap-3">
                  <AudioButton text={option} className={isAnswered ? "bg-white/50" : "bg-white"} />
                  <span>{option}</span>
                </div>
                {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-500" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-4 ${selectedAnswer === currentQ.correctAnswer ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-700'}`}>
              <AudioButton text={currentQ.explanation} className="bg-white/50 shrink-0" />
              <div>
                <p className="font-semibold mb-1">Explanation:</p>
                <p>{currentQ.explanation}</p>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold transition-colors"
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
