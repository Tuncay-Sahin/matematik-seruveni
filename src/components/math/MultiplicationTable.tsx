import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  RefreshCcw, 
  Timer, 
  Flame, 
  ShieldAlert, 
  Sword, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Crown, 
  Target, 
  Gauge, 
  Gamepad2,
  Lock,
  Award,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import confetti from "canvas-confetti";
import { 
  playCorrectSound, 
  playStarSound, 
  playLevelUpSound, 
  playWrongSound, 
  playStreakSound 
} from "@/src/lib/audio";

interface Props {
  onReward: () => void;
  key?: React.Key;
}

type Mode = "menu" | "training" | "monster" | "speed";

// Interactive badges
interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

export default function MultiplicationTable({ onReward }: Props) {
  const [mode, setMode] = useState<Mode>("menu");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(5);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Training Mode States
  const [selectedMultiplier, setSelectedMultiplier] = useState<number>(5);

  // Speed Mode States
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isSpeedRunning, setIsSpeedRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Monster Mode States
  const [monsterHp, setMonsterHp] = useState(100);
  const [monsterMaxHp, setMonsterMaxHp] = useState(100);
  const [monsterLevel, setMonsterLevel] = useState(1);
  const [monsterName, setMonsterName] = useState("Çarpım Canavarı Grog");
  const [monsterEmotion, setMonsterEmotion] = useState<"idle" | "hurt" | "happy" | "dead">("idle");

  // Badges state
  const [badges, setBadges] = useState<Badge[]>([
    { id: "first_win", title: "İlk Zafer", description: "İlk doğru cevabı ver!", emoji: "🌱", unlocked: false },
    { id: "streak_5", title: "Alev Alev", description: "Arka arkaya 5 doğru cevap ver!", emoji: "🔥", unlocked: false },
    { id: "streak_10", title: "Çarpım Şimşeği", description: "Arka arkaya 10 doğru cevap ver!", emoji: "⚡", unlocked: false },
    { id: "monster_slayer", title: "Canavar Avcısı", description: "Bir Çarpım Canavarını dize getir!", emoji: "⚔️", unlocked: false },
    { id: "speed_30", title: "Zaman Bükücü", description: "Hız Arenasında 30 puana ulaş!", emoji: "⏳", unlocked: false }
  ]);

  // Load high scores & custom badges
  useEffect(() => {
    const savedHighScore = localStorage.getItem("math_multiply_high");
    setHighScore(savedHighScore ? parseInt(savedHighScore) : 0);

    const savedMaxStreak = localStorage.getItem("math_multiply_streak");
    setMaxStreak(savedMaxStreak ? parseInt(savedMaxStreak) : 0);

    const savedBadges = localStorage.getItem("math_multiply_badges");
    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch (e) {
        // Fallback to default state on parse error
      }
    } else {
      setBadges([
        { id: "first_win", title: "İlk Zafer", description: "İlk doğru cevabı ver!", emoji: "🌱", unlocked: false },
        { id: "streak_5", title: "Alev Alev", description: "Arka arkaya 5 doğru cevap ver!", emoji: "🔥", unlocked: false },
        { id: "streak_10", title: "Çarpım Şimşeği", description: "Arka arkaya 10 doğru cevap ver!", emoji: "⚡", unlocked: false },
        { id: "monster_slayer", title: "Canavar Avcısı", description: "Bir Çarpım Canavarını dize getir!", emoji: "⚔️", unlocked: false },
        { id: "speed_30", title: "Zaman Bükücü", description: "Hız Arenasında 30 puana ulaş!", emoji: "⏳", unlocked: false }
      ]);
    }
  }, []);

  const triggerSound = (type: "correct" | "wrong" | "star" | "levelup" | "streak", combo: number = 0) => {
    if (!soundEnabled) return;
    if (type === "correct") playCorrectSound();
    if (type === "wrong") playWrongSound();
    if (type === "star") playStarSound();
    if (type === "levelup") playLevelUpSound();
    if (type === "streak") playStreakSound(combo);
  };

  const unlockBadge = (id: string) => {
    setBadges((prev) => {
      const updated = prev.map((badge) => {
        if (badge.id === id && !badge.unlocked) {
          triggerSound("levelup");
          confetti({
            particleCount: 80,
            spread: 50,
            colors: ["#FBBF24", "#3B82F6", "#EF4444"]
          });
          return { ...badge, unlocked: true };
        }
        return badge;
      });
      localStorage.setItem("math_multiply_badges", JSON.stringify(updated));
      return updated;
    });
  };

  // Generate new questions based on current mode constraints
  const generateQuestion = (forcedNum1?: number) => {
    setUserInput("");
    setStatus("idle");
    if (mode === "training" || forcedNum1) {
      const base = forcedNum1 || selectedMultiplier;
      setNum1(base);
      setNum2(Math.floor(Math.random() * 9) + 2); // Random 2 to 10
    } else if (mode === "monster") {
      // Monster scale difficulty based on level
      const limit = monsterLevel <= 2 ? 8 : 12;
      setNum1(Math.floor(Math.random() * (limit - 2)) + 2);
      setNum2(Math.floor(Math.random() * (limit - 2)) + 2);
    } else {
      // Speed Mode runs standard 2-10 difficulty
      setNum1(Math.floor(Math.random() * 9) + 2);
      setNum2(Math.floor(Math.random() * 9) + 2);
    }
  };

  // Timer logic for Speed Blitz Mode
  useEffect(() => {
    if (isSpeedRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isSpeedRunning) {
      // End speed run
      setIsSpeedRunning(false);
      triggerSound("levelup");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("math_multiply_high", score.toString());
      }
      if (score >= 30) {
        unlockBadge("speed_30");
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isSpeedRunning]);

  const startSpeedRun = () => {
    setScore(0);
    setTimeLeft(45);
    setIsSpeedRunning(true);
    setMode("speed");
    generateQuestion();
  };

  const startMonsterFight = (lvl: number) => {
    setMonsterLevel(lvl);
    setMonsterMaxHp(lvl * 50);
    setMonsterHp(lvl * 50);
    const names = ["Aritmetik Dev", "Çarpım Girdabı", "Mega Matrix", "Kuantum Kralı"];
    setMonsterName(names[(lvl - 1) % names.length] || "Sayı Canavarı");
    setMonsterEmotion("idle");
    setMode("monster");
    // Generate appropriate multiplier question
    setNum1(Math.floor(Math.random() * 7) + 2);
    setNum2(Math.floor(Math.random() * 7) + 2);
    setUserInput("");
    setStatus("idle");
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(userInput);
    const correctAns = num1 * num2;

    if (parsed === correctAns) {
      setStatus("correct");
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) {
        setMaxStreak(nextStreak);
        localStorage.setItem("math_multiply_streak", nextStreak.toString());
      }

      // Check level updates & awards
      onReward(); // Gives dynamic visual dashboard update and stars

      // Combo sounds & badge trigger
      if (nextStreak >= 10) {
        unlockBadge("streak_10");
        triggerSound("streak", 10);
      } else if (nextStreak >= 5) {
        unlockBadge("streak_5");
        triggerSound("streak", 5);
      } else {
        triggerSound("correct");
      }
      unlockBadge("first_win");

      if (mode === "speed") {
        setScore((prev) => prev + 5);
      }

      if (mode === "monster") {
        setMonsterEmotion("hurt");
        const damage = 25;
        const remainingHp = Math.max(0, monsterHp - damage);
        setMonsterHp(remainingHp);
        
        if (remainingHp <= 0) {
          setMonsterEmotion("dead");
          unlockBadge("monster_slayer");
          setTimeout(() => {
            triggerSound("levelup");
            confetti({
              particleCount: 150,
              spread: 60,
              origin: { y: 0.6 }
            });
          }, 300);
        }
      }
    } else {
      setStatus("wrong");
      setStreak(0);
      triggerSound("wrong");
      if (mode === "monster") {
        setMonsterEmotion("happy");
      }
    }
  };

  const getBadgesCount = () => badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-12">
      {/* Sound Controller Float */}
      <div className="flex justify-end -mt-6 gap-3">
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2 bg-white border-4 border-slate-900 px-4 py-2 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-green-600" />
              Ses Açık
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-red-500" />
              Sessiz
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "menu" && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            {/* Banner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Training Arena Card */}
              <div className="bg-white border-8 border-slate-900 p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] transition-transform">
                <div>
                  <div className="w-12 h-12 bg-orange-500 border-4 border-slate-900 flex items-center justify-center text-white mb-6">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">1. Alıştırma Kampı</h3>
                  <p className="font-bold text-slate-500 leading-tight mb-8">
                    Seçtiğin bir çarpan sayısına odaklan! Görsel kutular ve tekrarlarla temeli kusursuz hale getir.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setSelectedMultiplier(num);
                          setMode("training");
                          generateQuestion(num);
                        }}
                        className="w-10 h-10 bg-slate-100 hover:bg-orange-400 hover:text-white border-2 border-slate-900 font-black flex items-center justify-center transition-colors"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedMultiplier(5);
                      setMode("training");
                      generateQuestion(5);
                    }}
                    className="w-full bg-orange-500 text-white font-black uppercase tracking-widest py-4 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Kampa Başla 🏋️‍♂️
                  </button>
                </div>
              </div>

              {/* Boss Arena Card */}
              <div className="bg-red-500 text-white border-8 border-slate-900 p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] transition-transform relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white border-4 border-slate-900 flex items-center justify-center text-slate-900 mb-6">
                    <Sword className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">2. canavar düellosu</h3>
                  <p className="font-bold text-red-100 leading-tight mb-8">
                    Doğru cevaplarınla canavara hasar vur! Matematik bilgini test et ve canavarı alt et.
                  </p>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => startMonsterFight(1)}
                      className="bg-white text-slate-900 font-extrabold py-3 border-4 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm uppercase"
                    >
                      Kolay Cüce (Lvl 1)
                    </button>
                    <button 
                      onClick={() => startMonsterFight(3)}
                      className="bg-yellow-400 text-slate-900 font-extrabold py-3 border-4 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm uppercase"
                    >
                      Mega Matrix (Lvl 3)
                    </button>
                  </div>
                </div>
                {/* BG decorative monster ears */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600 border-l-8 border-b-8 border-slate-900 rotate-45 -mr-12 -mt-12 opacity-30" />
              </div>

              {/* Speed Blitz Card */}
              <div className="bg-indigo-600 text-white border-8 border-slate-900 p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-4px] transition-transform">
                <div>
                  <div className="w-12 h-12 bg-yellow-400 border-4 border-slate-900 flex items-center justify-center text-slate-900 mb-6Shared">
                    <Timer className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">3. hız arenası bilim</h3>
                  <p className="font-bold text-indigo-100 leading-tight mb-8">
                    45 Saniye! Ne kadar hızlı çarpabilirsin? Rekorunu kır, lider panosunda adını yazdır.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-indigo-800 p-4 border-4 border-slate-900 text-center flex justify-between items-center rotate-1">
                    <span className="font-black text-xs uppercase text-indigo-200">En Yüksek Skor</span>
                    <span className="text-2xl font-black text-yellow-300">{highScore} Puan</span>
                  </div>
                  <button 
                    onClick={startSpeedRun}
                    className="w-full bg-yellow-400 text-slate-900 font-black uppercase tracking-widest py-4 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Arenaya Gir ⚡
                  </button>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-white border-8 border-slate-900 p-10">
              <div className="flex justify-between items-center mb-8 border-b-4 border-slate-900 pb-6">
                <div>
                  <span className="text-blue-600 font-black uppercase text-xs tracking-widest italic block">Koleksiyon</span>
                  <h3 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Award className="w-8 h-8 text-yellow-500" />
                    Başarı Madalyaları
                  </h3>
                </div>
                <div className="bg-blue-600 text-white font-black px-6 py-3 border-4 border-slate-900 -rotate-2">
                  {getBadgesCount()} / {badges.length} TAMAM
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className={cn(
                      "p-6 border-4 border-slate-900 flex flex-col items-center text-center relative transition-all",
                      badge.unlocked 
                        ? "bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-1" 
                        : "bg-slate-50 opacity-40 grayscale"
                    )}
                  >
                    <span className="text-5xl mb-4 block transform hover:scale-125 transition-transform cursor-pointer">
                      {badge.emoji}
                    </span>
                    <h5 className="font-black text-lg uppercase tracking-tight mb-1">{badge.title}</h5>
                    <p className="text-xs font-bold text-slate-500 leading-tight">{badge.description}</p>
                    
                    {!badge.unlocked && (
                      <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-slate-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 1. TRAINING MODE */}
        {mode === "training" && (
          <motion.div 
            key="training"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left Column: Interactive Dot Matrix */}
            <div className="lg:col-span-7 bg-white p-10 border-8 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative">
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-orange-100 border-2 border-slate-900 px-4 py-1.5 font-black text-xs uppercase rotate-2">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                Seri: {streak}
              </div>

              <span className="text-orange-500 font-black uppercase text-xs tracking-widest italic block mb-2">Kamp Laboratuvarı</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Görsel Blok Modellemesi</h2>

              <div className="flex flex-wrap gap-2 mb-10 bg-slate-100 p-4 border-2 border-dashed border-slate-300">
                <span className="font-extrabold text-sm text-slate-500 uppercase flex items-center gap-1">Kolay Değiştir:</span>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedMultiplier(num);
                      generateQuestion(num);
                    }}
                    className={cn(
                      "px-3 py-1 font-black text-xs border-2 border-slate-900 transition-colors",
                      selectedMultiplier === num ? "bg-orange-500 text-white" : "bg-white text-slate-900"
                    )}
                  >
                    {num} Tablosu
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center justify-center min-h-[300px]">
                {/* Visual Grid rendering with custom animation layout */}
                <div 
                  className="grid gap-3 p-8 bg-amber-50 border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all"
                  style={{ 
                    gridTemplateColumns: `repeat(${num2}, minmax(0, 1fr))`,
                    width: 'fit-content',
                    maxWidth: "100%"
                  }}
                >
                  {Array.from({ length: num1 * num2 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: (i % num2) * 0.01 + Math.floor(i / num2) * 0.02 }}
                      className={cn(
                        "w-6 h-6 border-2 border-slate-900 font-black text-[9px] flex items-center justify-center",
                        Math.floor(i / num2) % 2 === 0 ? "bg-orange-400 text-orange-950" : "bg-yellow-300 text-yellow-950"
                      )}
                    >
                      {i + 1}
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-12 space-y-4">
                  <p className="text-xl font-bold text-slate-600 leading-tight">
                    Burada <span className="text-orange-500 font-extrabold underline">{Math.ceil(num1 / 2)} adet turuncu satır</span> ve <span className="text-yellow-600 font-extrabold underline">{Math.floor(num1 / 2)} adet sarı satır</span> (toplam {num1} satır) bulunuyor. Her satırda ise <span className="text-indigo-600 font-extrabold underline">{num2} adet kare</span> var!
                  </p>
                  <div className="flex items-center justify-center gap-4 text-5xl font-black text-slate-900">
                    <span>{num1}</span>
                    <span className="text-red-500">×</span>
                    <span>{num2}</span>
                    <span className="text-slate-300">=</span>
                    <span className={cn(
                      "w-28 h-16 border-4 border-slate-900 flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]",
                      status === "correct" ? "text-green-600 bg-green-50" : "text-slate-200"
                    )}>
                      {status === "correct" ? num1 * num2 : "?"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quiz Box */}
            <div className="lg:col-span-5 bg-indigo-600 text-white p-10 border-8 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">Kamp Mücadelesi</h3>
                
                <form onSubmit={handleAnswerSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-indigo-200">Yanıtını Hesapla</label>
                    <input
                      type="number"
                      value={userInput}
                      onChange={(e) => {
                        setUserInput(e.target.value);
                        if (status === "wrong") setStatus("idle");
                      }}
                      disabled={status === "correct"}
                      className="w-full bg-white border-4 border-slate-900 p-5 text-4xl font-black text-slate-900 focus:outline-none"
                      placeholder="?"
                      autoFocus
                    />
                  </div>

                  {status === "idle" && (
                    <button 
                      type="submit"
                      className="w-full bg-yellow-400 text-dashed text-slate-900 py-4 border-4 border-slate-900 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:bg-orange-500 active:text-white transition-all"
                    >
                      Onayla ⚡
                    </button>
                  )}

                  {status === "correct" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-green-500 border-4 border-slate-905 p-4 text-white font-black uppercase tracking-tight -rotate-2">
                        <CheckCircle2 className="w-8 h-8" />
                        Doğru! Harikasın!
                      </div>
                      <button 
                        type="button"
                        onClick={() => generateQuestion()}
                        className="w-full bg-white text-slate-900 py-4 border-4 border-slate-900 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowRight className="w-5 h-5" />
                        Sıradaki Soru
                      </button>
                    </div>
                  )}

                  {status === "wrong" && (
                    <div className="space-y-4">
                      <div className="bg-red-500 border-4 border-slate-900 p-4 text-white font-black uppercase tracking-tight text-center">
                        Tekrar Dene! Yan sütundaki kareleri tek tek sayabilirsin.
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setUserInput("");
                          setStatus("idle");
                        }}
                        className="w-full bg-white text-slate-900 py-4 border-4 border-slate-900 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Tekrar Dene
                      </button>
                    </div>
                  )}
                </form>
              </div>

              <div className="mt-12 bg-indigo-900/45 p-6 border-4 border-slate-900 font-bold leading-tight text-indigo-100 italic">
                <span className="text-yellow-400 font-black uppercase text-xs tracking-widest block mb-2">💡 Pratik Bilgiler</span>
                {num1} sayısını {num2} kez üst üste eklediğinde bu sonuca ulaşırsın. Matematik bir örüntü oyunudur!
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. CANAVAR DÜELLOSU */}
        {mode === "monster" && (
          <motion.div 
            key="monster"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left Column: Monster visual arena */}
            <div className="lg:col-span-7 bg-white p-10 border-8 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center justify-center min-h-[450px] relative">
              <span className="absolute top-6 left-6 text-red-600 font-black uppercase text-xs tracking-widest italic bg-red-150 border px-3 py-1">Arena Seviye {monsterLevel}</span>

              {/* Boss HP Bar */}
              <div className="w-full max-w-md space-y-2 mb-10">
                <div className="flex justify-between font-black text-sm uppercase">
                  <span>{monsterName}</span>
                  <span className="text-red-600">{monsterHp} / {monsterMaxHp} HP</span>
                </div>
                <div className="h-6 w-full bg-slate-100 border-4 border-slate-900 overflow-hidden relative">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: `${(monsterHp / monsterMaxHp) * 100}%` }}
                    className="h-full bg-red-500"
                  />
                  {/* Glass shimmer overlay */}
                  <div className="absolute inset-0 bg-white/10" />
                </div>
              </div>

              {/* Monster Emoji Portrait Animated */}
              <motion.div 
                animate={
                  monsterEmotion === "hurt" ? { x: [-20, 20, -10, 10, 0], scale: 0.9 } :
                  monsterEmotion === "happy" ? { y: [-15, 0, -15, 0], scale: 1.1 } :
                  monsterEmotion === "dead" ? { rotate: 90, opacity: 0.2 } :
                  { y: [0, -6, 0] }
                }
                transition={{ repeat: monsterEmotion === "idle" ? Infinity : 0, duration: 2 }}
                className="text-9xl my-8 select-none filter drop-shadow-[5px_5px_0px_rgba(15,23,42,1)]"
              >
                {monsterEmotion === "hurt" ? "🔥" : 
                 monsterEmotion === "happy" ? "🤪" : 
                 monsterEmotion === "dead" ? "💀" : "👾"}
              </motion.div>

              {monsterHp > 0 ? (
                <div className="text-center mt-6">
                  <h4 className="text-2xl font-black uppercase tracking-tight">{monsterName} Saldırmaya Hazır!</h4>
                  <p className="text-slate-500 font-bold">Her doğru çarpan cevabın ona hasar vuracak!</p>
                </div>
              ) : (
                <div className="text-center mt-6 space-y-4">
                  <h4 className="text-3xl font-black text-green-600 uppercase tracking-tighter">Canavar Nakavt Oldu! 🏆</h4>
                  <p className="text-slate-700 font-bold mb-4">Harika formdasın! Kazanılan tecrübe puanları seviyeni artırıyor.</p>
                  <button 
                    onClick={() => startMonsterFight(monsterLevel + 1)}
                    className="bg-yellow-400 text-slate-950 px-8 py-4 border-4 border-slate-900 font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Bir Sonraki Seviye Canavar ⚔️
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Battle actions / calculations */}
            <div className="lg:col-span-5 bg-red-500 text-white p-10 border-8 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">Savaş Gücü</h3>

                {monsterHp > 0 ? (
                  <form onSubmit={handleAnswerSubmit} className="space-y-6">
                    <div className="bg-white border-4 border-slate-900 p-8 text-slate-900 text-center mb-6">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Meydan Okuma Sorusunu Çöz</span>
                      <div className="text-5xl font-black my-4 flex items-center justify-center gap-3">
                        <span>{num1}</span>
                        <span className="text-red-500">×</span>
                        <span>{num2}</span>
                        <span className="text-slate-300">=</span>
                        <span className="text-red-500 animate-pulse">?</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-red-250">Saldırgan Güç Girişi</label>
                      <input
                        type="number"
                        value={userInput}
                        onChange={(e) => {
                          setUserInput(e.target.value);
                          if (status === "wrong") setStatus("idle");
                        }}
                        disabled={status === "correct"}
                        className="w-full bg-white border-4 border-slate-900 p-5 text-4xl font-black text-slate-900 focus:outline-none placeholder:text-slate-200"
                        placeholder="Güç Miktarı"
                        autoFocus
                      />
                    </div>

                    {status === "idle" && (
                      <button 
                        type="submit"
                        className="w-full bg-yellow-400 text-slate-900 py-4 border-4 border-slate-900 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:bg-red-600 active:text-white transition-all"
                      >
                        Hasar Vur! ⚔️
                      </button>
                    )}

                    {status === "correct" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-green-500 border-4 border-slate-900 p-4 text-white font-black uppercase tracking-tight">
                          <CheckCircle2 className="w-8 h-8" />
                          Tam İsabet! Hasar Verildi!
                        </div>
                        <button 
                          type="button"
                          onClick={() => generateQuestion()}
                          className="w-full bg-white text-slate-900 py-4 border-4 border-slate-900 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                          Saldırıya Devam ⚡
                        </button>
                      </div>
                    )}

                    {status === "wrong" && (
                      <div className="space-y-4">
                        <div className="bg-slate-900 border-4 border-white p-4 text-white font-black uppercase tracking-tight text-center">
                          Saldırı Iskaladı! Doğru Değer {num1 * num2} Olmalıydı.
                        </div>
                        <button
                          type="button"
                          onClick={() => generateQuestion()}
                          className="w-full bg-white text-slate-900 py-3 border-4 border-slate-900 font-black text-center uppercase"
                        >
                          Yeniden Odaklan
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="bg-slate-900 border-4 border-white p-6 rounded-none text-center">
                    <span className="text-xl font-black block text-yellow-400 mb-2">ZAFER ENERJİSİ!</span>
                    <p className="text-white text-sm">Canavarı yok ettin! Lobiye dönebilir veya sonraki boss ile çarpışabilirsin.</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setMode("menu")}
                className="w-full bg-white text-slate-900 py-4 mt-8 border-4 border-slate-900 font-black text-center uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5"
              >
                Savaş Limanından Çık
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. ZAMANA KARŞI HIZ ARENASI */}
        {mode === "speed" && (
          <motion.div 
            key="speed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left Column: Visual feedback counters & scoreboards */}
            <div className="lg:col-span-7 bg-white p-10 border-8 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex justify-between items-center mb-8 pb-4 border-b-4 border-slate-900">
                  <span className="text-indigo-600 font-black uppercase text-xs tracking-widest italic block">Hız Arenası</span>
                  <div className="flex gap-4">
                    <div className="bg-slate-900 text-white font-black px-4 py-1 flex items-center gap-1">
                      <Timer className="w-4 h-4 text-yellow-400" /> {timeLeft} saniye
                    </div>
                  </div>
                </div>

                {isSpeedRunning ? (
                  <div className="text-center py-12 space-y-6">
                    <span className="text-6xl font-black uppercase text-indigo-500 block animate-pulse">Sıradaki Soru!</span>
                    <div className="text-7xl font-black my-8 text-slate-900 flex items-center justify-center gap-4">
                      <span>{num1}</span>
                      <span className="text-red-500">×</span>
                      <span>{num2}</span>
                      <span className="text-slate-200">=</span>
                      <span className="text-indigo-600">?</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-8">
                    <span className="text-5xl font-black uppercase text-indigo-600 block">Süre Bitti! ⏳</span>
                    <div className="flex justify-center gap-8">
                      <div className="bg-slate-100 border-4 border-slate-900 p-6 flex flex-col items-center min-w-[120px]">
                        <span className="text-xs font-black uppercase text-slate-400">Skorun</span>
                        <span className="text-4xl font-black">{score}</span>
                      </div>
                      <div className="bg-yellow-50 border-4 border-slate-900 p-6 flex flex-col items-center min-w-[120px]">
                        <span className="text-xs font-black uppercase text-slate-400">Rekorun</span>
                        <span className="text-4xl font-black text-yellow-600">{highScore}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isSpeedRunning ? (
                <div className="h-4 w-full bg-slate-100 border-2 border-slate-900 overflow-hidden rounded-none relative">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000" 
                    style={{ width: `${(timeLeft / 45) * 100}%` }}
                  />
                </div>
              ) : (
                <button
                  onClick={startSpeedRun}
                  className="w-full bg-yellow-400 text-slate-900 py-4 border-4 border-slate-900 font-black uppercase tracking-wider text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Tekrar Deneyelim! ⚡
                </button>
              )}
            </div>

            {/* Right Column: Interaction inputs & speed check */}
            <div className="lg:col-span-5 bg-indigo-600 text-white p-10 border-8 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-8 border-b-2 border-indigo-400 pb-4">
                  <h3 className="text-2xl font-black uppercase">Skor: {score}</h3>
                  <div className="flex items-center gap-2 bg-yellow-400 px-3 py-1 font-bold text-xs uppercase text-slate-900 border-2 border-slate-900">
                    <Timer className="w-4 h-4" /> REKOR: {highScore}
                  </div>
                </div>

                {isSpeedRunning ? (
                  <form onSubmit={handleAnswerSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-indigo-200">Yanıtını Yaz</label>
                      <input
                        type="number"
                        value={userInput}
                        onChange={(e) => {
                          setUserInput(e.target.value);
                          if (status === "wrong") setStatus("idle");
                        }}
                        disabled={status === "correct" || !isSpeedRunning}
                        className="w-full bg-white border-4 border-slate-900 p-5 text-4xl font-black text-slate-900 focus:outline-none placeholder:text-slate-200"
                        placeholder="???"
                        autoFocus
                      />
                    </div>

                    {status === "idle" && (
                      <button 
                        type="submit"
                        className="w-full bg-yellow-400 text-slate-900 py-4 border-4 border-slate-900 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:bg-indigo-600 active:text-white transition-all"
                      >
                        Hızlı Yanıtla! 🚀
                      </button>
                    )}

                    {status === "correct" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-green-500 border-4 border-slate-900 p-4 text-white font-black uppercase tracking-tight">
                          <CheckCircle2 className="w-8 h-8" />
                          Hızlı ve Doğru! +5 Puan
                        </div>
                        <button 
                          type="button"
                          onClick={() => generateQuestion()}
                          className="w-full bg-white text-slate-900 py-4 border-4 border-slate-900 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                          Devam Et ⚡
                        </button>
                      </div>
                    )}

                    {status === "wrong" && (
                      <div className="space-y-4">
                        <div className="bg-red-500 border-4 border-slate-900 p-4 text-white font-black uppercase tracking-tight text-center">
                          Hatalı! Sıradaki soruya geç.
                        </div>
                        <button 
                          type="button"
                          onClick={() => generateQuestion()}
                          className="w-full bg-white text-slate-900 py-4 border-2 border-slate-900 font-black uppercase tracking-widest"
                        >
                          Sıradakine Geç
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center bg-slate-900 border-4 border-white p-6 rounded-none">
                    <span className="text-xl font-black block text-yellow-400 mb-2">ZAMAN DURDU!</span>
                    <p className="text-white text-sm mb-4">Hız Arenasını tamamladın. Kendini daha da geliştirebilirsin!</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setMode("menu")}
                className="w-full bg-white text-slate-900 py-4 mt-8 border-4 border-slate-900 font-black text-center uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                Giriş Menüsüne Dön
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
