import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  Trophy, 
  ArrowLeft,
  Info,
  User,
  X,
  Flame,
  Award,
  Trash2,
  RefreshCcw,
  Sparkles,
  Zap
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import MultiplicationTable from "./math/MultiplicationTable";
import confetti from "canvas-confetti";
import { playStarSound, playLevelUpSound, playWrongSound } from "@/src/lib/audio";

export default function Dashboard() {
  const [stars, setStars] = useState(0);
  const [level, setLevel] = useState(1);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [maxStreak, setMaxStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<any[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const savedStars = localStorage.getItem("math_stars");
    setStars(savedStars ? parseInt(savedStars) : 0);
    
    const savedLevel = localStorage.getItem("math_level");
    setLevel(savedLevel ? parseInt(savedLevel) : 1);
  }, [resetKey]);

  const loadProfileData = () => {
    const savedMaxStreak = localStorage.getItem("math_multiply_streak");
    setMaxStreak(savedMaxStreak ? parseInt(savedMaxStreak) : 0);

    const savedHighScore = localStorage.getItem("math_multiply_high");
    setHighScore(savedHighScore ? parseInt(savedHighScore) : 0);

    const defaultBadges = [
      { id: "first_win", title: "İlk Zafer", description: "İlk doğru cevabı ver!", emoji: "🌱", unlocked: false },
      { id: "streak_5", title: "Alev Alev", description: "Arka arkaya 5 doğru cevap ver!", emoji: "🔥", unlocked: false },
      { id: "streak_10", title: "Çarpım Şimşeği", description: "Arka arkaya 10 doğru cevap ver!", emoji: "⚡", unlocked: false },
      { id: "monster_slayer", title: "Canavar Avcısı", description: "Bir Çarpım Canavarını dize getir!", emoji: "⚔️", unlocked: false },
      { id: "speed_30", title: "Zaman Bükücü", description: "Hız Arenasında 30 puana ulaş!", emoji: "⏳", unlocked: false }
    ];

    const savedBadges = localStorage.getItem("math_multiply_badges");
    if (savedBadges) {
      try {
        const parsed = JSON.parse(savedBadges);
        setUnlockedBadges(parsed);
      } catch (e) {
        setUnlockedBadges(defaultBadges);
      }
    } else {
      setUnlockedBadges(defaultBadges);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [isProfileOpen, stars, resetKey]);

  const addStar = () => {
    const newStars = stars + 1;
    setStars(newStars);
    localStorage.setItem("math_stars", newStars.toString());
    
    // Play cool star sound effect
    playStarSound();

    if (newStars % 10 === 0) {
      const newLevel = level + 1;
      setLevel(newLevel);
      localStorage.setItem("math_level", newLevel.toString());
      
      // Play triumphant level up arpeggio
      playLevelUpSound();

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 text-slate-900 font-sans selection:bg-blue-100 pb-20">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-white border-b-8 border-slate-900 px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0px_4px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 border-4 border-slate-900 flex items-center justify-center text-white font-black text-2xl rotate-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <span className="font-mono">×</span>
          </div>
          <div>
            <span className="text-xs font-black uppercase text-indigo-600 tracking-widest block">Matematik Ustası</span>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Çarpmaktan korkma!</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* XP Progress Bar indicator */}
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Sonraki Seviye İlerlemesi</span>
            <div className="w-40 h-3 bg-slate-150 border-2 border-slate-900 rounded-none overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300" 
                style={{ width: `${(stars % 10) * 10}%` }}
              />
            </div>
          </div>
          {/* Stars Counter */}
          <div className="flex items-center gap-2 bg-indigo-600 border-4 border-slate-900 p-3 -rotate-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            <span className="font-black text-2xl text-white">{stars}</span>
          </div>
          {/* Level Tracker */}
          <div className="flex items-center gap-2 bg-red-500 border-4 border-slate-900 p-3 rotate-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <Trophy className="w-6 h-6 text-white animate-bounce" />
            <span className="font-black text-2xl text-white">LVL {level}</span>
          </div>
          {/* Profile Card Trigger */}
          <button 
            onClick={() => {
              setIsProfileOpen(true);
              playStarSound();
            }}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black px-4 py-3 border-4 border-slate-900 -rotate-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <User className="w-5 h-5" />
            Profilim 🧒
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Main Title Banner with Neo-Brutalist Layout */}
          <div className="bg-white border-8 border-slate-900 p-10 -rotate-1 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <span className="text-blue-600 font-black uppercase text-xl mb-2 tracking-widest italic block">8-12 Yaş Çarpım Arenası</span>
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              Sayıların <br/><span className="text-red-500 underline decoration-8 underline-offset-8">Sırrını</span> Çöz!
            </h2>
            <p className="text-xl font-bold text-slate-600 max-w-lg">
              Adrenalini hisset! Alıştırma kamplarına katıl, canavarları dize getir ya da hız arenasında kendi rekorlarını zorla.
            </p>
          </div>

          {/* Multiplication Table Main Application Frame */}
          <div className="relative">
            <MultiplicationTable key={resetKey} onReward={addStar} />
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white border-8 border-slate-900 w-full max-w-lg p-8 relative shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] text-slate-900"
            >
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  setConfirmReset(false);
                }}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-400 text-white p-2 border-4 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6 border-b-4 border-slate-900 pb-4">
                <div className="w-14 h-14 bg-indigo-600 border-4 border-slate-900 flex items-center justify-center text-white rotate-3">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-indigo-600 font-black uppercase text-xs tracking-widest italic block">Başarı Kartı</span>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">profilim</h3>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-yellow-105 bg-yellow-50 border-4 border-slate-900 p-4 text-center -rotate-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase block leading-tight">Mevcut Yıldız</span>
                  <div className="flex items-center justify-center gap-1 text-2xl font-black text-slate-900 mt-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    {stars}
                  </div>
                </div>
                <div className="bg-red-50 border-4 border-slate-900 p-4 text-center rotate-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase block leading-tight">Toplam Seviye</span>
                  <div className="flex items-center justify-center gap-1 text-2xl font-black text-slate-900 mt-1">
                    <Trophy className="w-5 h-5 text-red-500" />
                    {level}
                  </div>
                </div>
                <div className="bg-orange-50 border-4 border-slate-900 p-4 text-center -rotate-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase block leading-tight">Maksimum Seri</span>
                  <div className="flex items-center justify-center gap-1 text-2xl font-black text-slate-900 mt-1">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                    {maxStreak}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border-4 border-slate-900 p-4 mb-6 flex justify-between items-center rotate-1">
                <span className="text-xs font-black uppercase text-indigo-700 tracking-wider">Hız Arenası Rekoru:</span>
                <span className="text-2xl font-black text-indigo-900 italic">{highScore} Puan</span>
              </div>

              {/* Badge List (Scrollable) */}
              <div className="space-y-3 mb-8">
                <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Kazanılan Madalyalar ({unlockedBadges.filter(b => b.unlocked).length} / {unlockedBadges.length})
                </h4>
                
                <div className="max-h-[180px] overflow-y-auto border-4 border-slate-900 p-4 space-y-3 bg-slate-100 scrollbar-thin">
                  {unlockedBadges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className={cn(
                        "flex items-center gap-4 p-3 border-2 border-slate-900 transition-all",
                        badge.unlocked ? "bg-white shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)]" : "bg-slate-50 opacity-50 grayscale"
                      )}
                    >
                      <span className="text-3xl">{badge.emoji}</span>
                      <div className="flex-1">
                        <h6 className="font-black text-sm uppercase tracking-tight leading-tight">{badge.title}</h6>
                        <p className="text-[10px] font-bold text-slate-500 leading-none mt-0.5">{badge.description}</p>
                      </div>
                      {badge.unlocked ? (
                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 border-2 border-green-600 uppercase">Açık</span>
                      ) : (
                        <span className="text-[9px] font-black text-slate-400 bg-slate-200 px-2 py-0.5 border-2 border-slate-300 uppercase">Kilitli</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Section */}
              <div className="border-t-4 border-dashed border-slate-900 pt-6">
                {!confirmReset ? (
                  <button 
                    onClick={() => {
                      setConfirmReset(true);
                      playWrongSound();
                    }}
                    className="w-full bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest py-3 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <Trash2 className="w-5 h-5" />
                    Tüm İlerlemeyi Sıfırla 🔄
                  </button>
                ) : (
                  <div className="bg-red-50 border-4 border-red-500 p-4 text-center space-y-4">
                    <p className="text-red-700 font-black text-xs uppercase leading-tight">🚨 Tüm yıldızların, rekorların ve rozetlerin kalıcı olarak silinecek! Sıfırlamak istediğinden emin misin?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => {
                          localStorage.removeItem("math_stars");
                          localStorage.removeItem("math_level");
                          localStorage.removeItem("math_multiply_high");
                          localStorage.removeItem("math_multiply_streak");
                          localStorage.removeItem("math_multiply_badges");
                          setStars(0);
                          setLevel(1);
                          setMaxStreak(0);
                          setHighScore(0);
                          setResetKey(prev => prev + 1);
                          setConfirmReset(false);
                          setIsProfileOpen(false);
                          playWrongSound();
                        }}
                        className="bg-red-600 hover:bg-red-500 text-white font-black py-2.5 border-4 border-slate-900 uppercase text-[10px] tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                      >
                        Evet, Sıfırla! ✅
                      </button>
                      <button 
                        onClick={() => setConfirmReset(false)}
                        className="bg-white hover:bg-slate-50 text-slate-900 font-black py-2.5 border-4 border-slate-900 uppercase text-[10px] tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                      >
                        Vazgeç ❌
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
