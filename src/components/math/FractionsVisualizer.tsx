import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Props {
  onReward: () => void;
}

export default function FractionsVisualizer({ onReward }: Props) {
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizTarget, setQuizTarget] = useState({ n: 3, d: 8 });
  const [quizStatus, setQuizStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const startQuiz = () => {
    const d = [2, 3, 4, 6, 8, 10][Math.floor(Math.random() * 6)];
    const n = Math.floor(Math.random() * (d - 1)) + 1;
    setQuizTarget({ n, d });
    setNumerator(1);
    setDenominator(d);
    setShowQuiz(true);
    setQuizStatus("idle");
  };

  const checkAnswer = () => {
    if (numerator === quizTarget.n && denominator === quizTarget.d) {
      setQuizStatus("correct");
      onReward();
    } else {
      setQuizStatus("wrong");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Visual Workspace */}
      <div className="flex-1 bg-white p-10 neo-brutal-static">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-blue-600 font-black uppercase text-sm tracking-widest italic mb-1 block">Yemek Saati</span>
            <h2 className="text-4xl font-black uppercase tracking-tighter">Kesir Pizzası</h2>
          </div>
          <button 
            onClick={startQuiz}
            className="group bg-blue-600 text-white px-8 py-4 border-4 border-slate-900 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6" />
            Göreve Başla!
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around gap-16 py-8">
          {/* Pizza Visualization */}
          <div className="relative w-72 h-72 md:w-80 md:h-80">
            {/* Base */}
            <div className="absolute inset-0 rounded-full border-8 border-slate-900 bg-amber-50 shadow-inner" />
            
            {/* Slices */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              {Array.from({ length: denominator }).map((_, i) => {
                const angle = (360 / denominator);
                const startAngle = i * angle;
                const endAngle = (i + 1) * angle;
                
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                const path = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                return (
                  <motion.path
                    key={`${denominator}-${i}`}
                    d={path}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      fill: i < numerator ? "#2563EB" : "white", 
                      stroke: "#0F172A",
                      strokeWidth: "0.8"
                    }}
                    transition={{ delay: i * 0.05 }}
                    className="cursor-pointer hover:brightness-90 transition-all"
                  />
                );
              })}
            </svg>

            {/* Visual labels */}
            <div className="absolute -top-10 -left-10 bg-white border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-6 flex flex-col items-center min-w-[100px] -rotate-3">
              <span className="text-4xl font-black text-blue-600">{numerator}</span>
              <div className="w-full h-2 bg-slate-900 my-1" />
              <span className="text-4xl font-black text-slate-800">{denominator}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full md:w-72 space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="font-black text-slate-400 uppercase text-xs tracking-[0.2em]">Pay (Üst)</span>
                <span className="text-3xl font-black text-blue-600 italic -rotate-3">{numerator}</span>
              </div>
              <input 
                type="range"
                min="1"
                max={denominator}
                value={numerator}
                onChange={(e) => setNumerator(parseInt(e.target.value))}
                className="w-full h-4 bg-slate-100 border-2 border-slate-900 appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="font-black text-slate-400 uppercase text-xs tracking-[0.2em]">Payda (Alt)</span>
                <span className="text-3xl font-black text-slate-900 italic rotate-3">{denominator}</span>
              </div>
              <input 
                type="range"
                min="2"
                max="12"
                value={denominator}
                onChange={(e) => {
                  const newD = parseInt(e.target.value);
                  setDenominator(newD);
                  if (numerator > newD) setNumerator(newD);
                }}
                className="w-full h-4 bg-slate-100 border-2 border-slate-900 appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal/Panel */}
      {showQuiz && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full lg:w-[380px] bg-red-500 text-white p-10 neo-brutal-static relative overflow-hidden flex flex-col"
        >
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">Müşteri Geldi!</h3>
            <p className="text-xl font-bold mb-10 leading-tight">
              Aç bir matematikçi tam tamına <strong className="text-yellow-300 underline decoration-4 underline-offset-8 uppercase">{quizTarget.n} / {quizTarget.d}</strong> pizza istiyor!
            </p>
            
            <div className="p-8 bg-white border-4 border-slate-900 text-slate-900 mb-10 flex flex-col items-center rotate-2 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
              <span className="text-6xl font-black">{numerator}</span>
              <div className="w-20 h-2 bg-slate-900 my-2" />
              <span className="text-6xl font-black">{denominator}</span>
            </div>

            <div className="mt-auto space-y-4">
              <button 
                onClick={quizStatus === "correct" ? startQuiz : checkAnswer}
                className={cn(
                  "w-full py-5 border-4 border-slate-900 font-black uppercase tracking-widest text-xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all",
                  quizStatus === "correct" ? "bg-green-500 text-white" : "bg-white text-slate-900"
                )}
              >
                {quizStatus === "correct" ? "Sıradaki Gelsin" : "Servis Et! 🍕"}
              </button>

              {quizStatus === "wrong" && (
                <p className="text-sm font-black uppercase text-center bg-slate-900/20 py-2">Hatalı Dilim Sayısı!</p>
              )}

              <button 
                onClick={() => setShowQuiz(false)}
                className="w-full text-white/70 text-xs font-black uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <RotateCcw className="w-4 h-4" />
                Vazgeç
              </button>
            </div>
          </div>
          
          {/* BG Decoration */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16" />
        </motion.div>
      )}
    </div>
  );
}
