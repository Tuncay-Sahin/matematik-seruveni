import React, { useState } from "react";
import { motion } from "motion/react";
import { Battery, Tag, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Props {
  onReward: () => void;
}

const EXAMPLES = [
  {
    id: "battery",
    title: "Pil Seviyesi",
    description: "Telefonunun kalan enerjisini anla.",
    icon: Battery,
    color: "bg-green-500",
    unit: "%",
    max: 100,
  },
  {
    id: "discount",
    title: "Mağaza İndirimi",
    description: "Fiyatların ne kadar düştüğünü gör.",
    icon: Tag,
    color: "bg-purple-500",
    unit: "% İndirim",
    max: 90,
  },
  {
    id: "progress",
    title: "Oyun İndirmesi",
    description: "Dosyanın ne kadarı yüklendi?",
    icon: TrendingUp,
    color: "bg-blue-500",
    unit: "% Yüklendi",
    max: 100,
  }
];

export default function PercentageExplorer({ onReward }: Props) {
  const [value, setValue] = useState(50);
  const [activeExample, setActiveExample] = useState(EXAMPLES[0]);

  const handleReward = () => {
    if (value === 100 || value === 50) {
      onReward();
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="bg-white p-10 neo-brutal-static flex flex-col md:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <div className={cn("w-20 h-20 border-4 border-slate-900 flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3", activeExample.color)}>
            <activeExample.icon className="w-10 h-10" />
          </div>
          <div>
            <span className="text-indigo-600 font-black uppercase text-sm tracking-widest italic mb-1 block">Yüzde Uzmanı</span>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Dünyayı Yüzdeyle Gör</h2>
            <p className="text-slate-600 font-bold leading-tight max-w-sm">
              Yüzde (%) demek, bir bütünü <span className="text-slate-900 underline decoration-4 decoration-yellow-400">100 parçaya</span> bölmektir.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setActiveExample(ex)}
                className={cn(
                  "px-6 py-4 border-4 border-slate-900 font-black uppercase tracking-widest transition-all",
                  activeExample.id === ex.id 
                    ? `bg-yellow-400 text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]` 
                    : "bg-white text-slate-400 hover:bg-slate-50"
                )}
              >
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Stage */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 border-4 border-slate-900 p-12 min-h-[450px] relative">
          <div className="relative w-full max-w-sm h-56 bg-white border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] p-10 flex flex-col justify-center gap-8 rotate-1">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{activeExample.title}</span>
              <span className="text-6xl font-black tabular-nums italic">{value}<span className="text-2xl text-slate-300 ml-1">%</span></span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-10 w-full bg-slate-100 border-4 border-slate-900 rounded-none overflow-hidden relative">
              <motion.div 
                initial={false}
                animate={{ width: `${value}%` }}
                className={cn("h-full", activeExample.color)}
              />
            </div>

            {/* Scale Markers */}
            <div className="flex justify-between px-1">
              {[0, 50, 100].map(m => (
                <div key={m} className="flex flex-col items-center gap-1">
                  <div className="w-1 h-3 bg-slate-900" />
                  <span className="text-[10px] font-black text-slate-900">{m}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Slider */}
          <div className="w-full max-w-sm mt-12 bg-white border-4 border-slate-900 p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-1">
            <input 
              type="range"
              min="0"
              max={activeExample.max}
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value))}
              className="w-full h-4 bg-slate-100 border-2 border-slate-900 appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between mt-3">
              <span className="text-[10px] font-black uppercase text-slate-400">Min</span>
              <span className="text-[10px] font-black uppercase text-slate-400">Max</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real World Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-orange-500 text-slate-900 p-12 neo-brutal-static rotate-1">
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">💡 Biliyor musun?</h3>
          <p className="text-2xl font-bold leading-tight mb-10 text-white">
            "%50" (Yüzde Elli) demek, aslında o şeyin tam <span className="underline decoration-slate-900 decoration-8 underline-offset-8 uppercase">Yarısı</span> demektir!
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white border-4 border-slate-900 p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="text-4xl font-black">50%</div>
              <div className="text-[10px] font-black uppercase opacity-40">Yüzde</div>
            </div>
            <div className="bg-white border-4 border-slate-900 p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3">
              <div className="text-4xl font-black">1/2</div>
              <div className="text-[10px] font-black uppercase opacity-40">Kesir</div>
            </div>
            <div className="bg-white border-4 border-slate-900 p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-2">
              <div className="text-xl font-black uppercase leading-none mt-2">Yarım</div>
              <div className="text-[10px] font-black uppercase opacity-40">Sözcük</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 text-white p-12 neo-brutal-static -rotate-1 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">🎯 Görev</h3>
            <p className="text-2xl font-bold mb-10 leading-tight">
              Eğitimi başarıyla tamamladın! Şimdi yıldızlarını topla ve bir sonraki seviyeye hazır ol.
            </p>
          </div>
          <button 
            onClick={() => {
              onReward();
            }}
            className="w-full bg-yellow-400 text-slate-900 py-6 border-4 border-slate-900 font-black uppercase tracking-widest hover:bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-4 text-xl"
          >
            <CheckCircle2 className="w-8 h-8" />
            Yıldızları Al ⚡
          </button>
        </div>
      </div>
    </div>
  );
}
