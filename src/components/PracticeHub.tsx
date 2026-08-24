import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, Brain } from 'lucide-react';
import type { Flashcard, QuizQuestion } from '../types';

const sampleCards: Flashcard[] = [
  { id: '1', front: 'What is Time Complexity of QuickSort (Average)?', back: 'O(n log n)', subject: 'DSA' },
  { id: '2', front: 'What is the derivative of sin(x)?', back: 'cos(x)', subject: 'Calculus' },
  { id: '3', front: 'What is the functional unit of the kidney?', back: 'Nephron', subject: 'Biology' },
];

const sampleQuiz: QuizQuestion[] = [
  {
    id: '1',
    question: 'Which data structure follows the LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctAnswer: 1,
    explanation: 'A Stack processes elements in Last In, First Out order.',
  },
  {
    id: '2',
    question: 'What is the time complexity of searching an element in a balanced BST?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'Balanced BST height is log(n), making search operations O(log n).',
  },
];

export const PracticeHub: React.FC = () => {
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % sampleCards.length);
  };

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === sampleQuiz[quizIndex].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizIndex((prev) => (prev + 1) % sampleQuiz.length);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-slate-100">
      {/* Flashcards Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-indigo-400" />
            <h2 className="text-base font-bold">Active Recall Flashcards</h2>
          </div>
          <span className="text-xs text-slate-400">Card {cardIndex + 1} of {sampleCards.length}</span>
        </div>

        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="min-h-[180px] bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500/50 transition relative group"
        >
          <span className="absolute top-3 left-4 text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
            {sampleCards[cardIndex].subject}
          </span>
          <p className="text-sm font-medium text-slate-200">
            {isFlipped ? sampleCards[cardIndex].back : sampleCards[cardIndex].front}
          </p>
          <span className="text-[10px] text-slate-500 mt-4 group-hover:text-slate-400">
            Click to {isFlipped ? 'show question' : 'reveal answer'}
          </span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNextCard}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
          >
            Next Card <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Quiz Practice Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-indigo-400" />
            <h2 className="text-base font-bold">Self-Assessment Quiz</h2>
          </div>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Score: {score}
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-semibold text-slate-200">
            Q{quizIndex + 1}. {sampleQuiz[quizIndex].question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {sampleQuiz[quizIndex].options.map((option: string, idx: number) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === sampleQuiz[quizIndex].correctAnswer;
              let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

              if (isSubmitted) {
                if (isCorrect) style = 'bg-emerald-500/10 border-emerald-500 text-emerald-300';
                else if (isSelected) style = 'bg-rose-500/10 border-rose-500 text-rose-300';
              } else if (isSelected) {
                style = 'bg-indigo-600/20 border-indigo-500 text-indigo-200';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${style}`}
                >
                  <span>{option}</span>
                  {isSubmitted && isCorrect && <CheckCircle size={14} className="text-emerald-400" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle size={14} className="text-rose-400" />}
                </button>
              );
            })}
          </div>

          {isSubmitted && sampleQuiz[quizIndex].explanation && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
              <span className="font-bold">Explanation: </span>
              {sampleQuiz[quizIndex].explanation}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
            >
              Next Question <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
