import { useState } from 'react';
import { CheckCircle, XCircle, Award, RefreshCw, Shield, Play, Pause, Volume2 } from 'lucide-react';

// --- 1. EXPANDED & NON-REPETITIVE CHALLENGE POOL (5 Items) ---
const CHALLENGES = [
  {
    id: 1,
    type: "AI Image",
    // Hyper-realistic AI image of a politician
    content: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=800&q=80",
    question: "This photo showing a politician playing guitar at a flood relief camp is trending. Real or AI?",
    isReal: false,
    explanation: "AI GENERATED. Look closely at the guitar strings—they merge into the fingers. Also, the shadow lighting on the face doesn't match the background sun direction.",
    hint: "Check the hands and shadows. AI often struggles with fingers."
  },
  {
    id: 2,
    type: "Phishing Scam",
    content: "SMS: 'Dear Customer, your electricity connection will be disconnected tonight at 9:30 PM due to unpaid bill. Pay ₹10 immediately to update KYC via this link.'",
    question: "You receive this SMS from a random mobile number. Do you click the link?",
    isReal: false,
    explanation: "SCAM. Utility companies never ask for tiny payments (₹10) or threaten immediate disconnection via personal mobile numbers. The link steals your banking info.",
    hint: "Look at the urgency ('tonight') and the sender ID."
  },
  {
    id: 3,
    type: "Video Snippet",
    // Fake Player Placeholder
    content: "video_placeholder", 
    question: "A video shows a Tech CEO promising to 'Double your BTC' if you send it to a specific wallet. Is it legit?",
    isReal: false,
    explanation: "DEEPFAKE SCAM. This is a famous crypto scam. The video uses an old interview and overlays AI-generated audio. High-profile figures never do 'giveaways' like this.",
    hint: "If it sounds too good to be true (free money), it's always a scam."
  },
  {
    id: 4,
    type: "Out of Context",
    content: "https://images.unsplash.com/photo-1596466575578-23c4391d0f17?auto=format&fit=crop&w=800&q=80",
    question: "Viral post claims: 'Massive fire at Mumbai Metro station today'. Is this accurate?",
    isReal: false,
    explanation: "MISLEADING. The photo is real, but it is from a 2019 fire drill in a completely different city (Bangalore). It is being reshared to create panic.",
    hint: "Reverse image search would show this photo appeared online years ago."
  },
  {
    id: 5,
    type: "Headline",
    content: "BREAKING: Government introduces 'Bachelor Tax' for unmarried men over 30.",
    question: "A news screenshot with this headline is circulating on Instagram. Is it real?",
    isReal: false,
    explanation: "SATIRE/FAKE. No such tax exists. This originated from a satire news site ('The Onion' style) but is being shared as real news to trigger outrage.",
    hint: "Check if the source is a reputable news agency or a meme page."
  }
];

export function Academy() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGuess = (guess: boolean) => {
    setUserGuess(guess);
    setShowResult(true);
    if (guess === CHALLENGES[currentLevel].isReal) {
      setScore(score + 100);
    }
  };

  const nextLevel = () => {
    if (currentLevel + 1 < CHALLENGES.length) {
      setCurrentLevel(currentLevel + 1);
      setShowResult(false);
      setUserGuess(null);
      setIsPlaying(false);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setGameOver(false);
    setShowResult(false);
    setUserGuess(null);
  };

  if (gameOver) {
    return (
      <div className="max-w-2xl mx-auto pt-10 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-300">
          <div className="inline-block p-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-6">
            <Award size={64} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Training Complete!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">You are now a certified TruthLens Analyst.</p>
          
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-8">
            {score} <span className="text-xl font-medium text-slate-400">/ {CHALLENGES.length * 100} XP</span>
          </div>

          <button 
            onClick={resetGame}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105"
          >
            <RefreshCw size={20} /> Play Again
          </button>
        </div>
      </div>
    );
  }

  const challenge = CHALLENGES[currentLevel];

  return (
    <div className="max-w-3xl mx-auto pt-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Shield className="text-indigo-500" /> Truth Academy
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Level {currentLevel + 1}: Cognitive Security Training</p>
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-xl font-mono font-bold text-indigo-700 dark:text-indigo-300">
          XP: {score}
        </div>
      </div>

      {/* Game Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 relative min-h-[400px]">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2">
          <div 
            className="bg-indigo-500 h-2 transition-all duration-500" 
            style={{ width: `${((currentLevel + 1) / CHALLENGES.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-bold uppercase tracking-wider text-slate-500">
              Question {currentLevel + 1}
            </span>
            <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
              {challenge.type}
            </span>
          </div>

          <h3 className="text-xl font-medium text-slate-800 dark:text-white mb-6 leading-relaxed">
            {challenge.question}
          </h3>

          {/* --- VISUAL MEDIA RENDERING --- */}
          
          {/* 1. Image Logic (AI & Out of Context) */}
          {(challenge.type === "AI Image" || challenge.type === "Out of Context") && (
             <div className="w-full h-64 bg-slate-200 dark:bg-slate-700 rounded-xl mb-8 overflow-hidden relative group shadow-inner">
                <img 
                  src={challenge.content} 
                  alt="Quiz" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
             </div>
          )}
          
          {/* 2. Text/Headline/Phishing Logic */}
          {(challenge.type === "Headline" || challenge.type === "Phishing Scam") && (
             <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-l-4 border-indigo-500 rounded-r-xl mb-8 shadow-sm">
                <p className="font-serif text-2xl text-slate-900 dark:text-white italic leading-relaxed">
                  "{challenge.content}"
                </p>
             </div>
          )}

          {/* 3. Video/Audio Logic (Fake Player) */}
          {challenge.type === "Video Snippet" && (
             <div className="w-full bg-black rounded-xl mb-8 overflow-hidden border border-slate-700 shadow-lg">
                <div className="h-40 flex items-center justify-center relative bg-slate-900">
                  <div className={`flex items-end gap-1 h-12 ${isPlaying ? 'animate-pulse' : ''}`}>
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1 bg-indigo-500 rounded-t-sm transition-all duration-300"
                        style={{ 
                          height: isPlaying ? `${Math.random() * 100}%` : '20%',
                          opacity: isPlaying ? 1 : 0.5 
                        }}
                      ></div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      {isPlaying ? <Pause fill="white" className="text-white" /> : <Play fill="white" className="text-white ml-1" />}
                    </div>
                  </button>
                </div>
                <div className="bg-slate-800 p-3 flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={16} className="text-slate-300" /> : <Play size={16} className="text-slate-300" />}
                  </button>
                  <div className="flex-1 h-1 bg-slate-600 rounded-full overflow-hidden">
                    <div className={`h-full bg-indigo-500 ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/3'}`}></div>
                  </div>
                  <Volume2 size={16} className="text-slate-300" />
                </div>
             </div>
          )}

          {/* --- GAME CONTROLS --- */}
          {!showResult ? (
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleGuess(true)}
                className="py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-600 dark:text-slate-300 font-bold text-lg transition-all"
              >
                Real
              </button>
              <button 
                onClick={() => handleGuess(false)}
                className="py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 font-bold text-lg transition-all"
              >
                Fake
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className={`p-6 rounded-xl mb-6 border ${userGuess === challenge.isReal ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                <div className="flex items-center gap-3 mb-2">
                  {userGuess === challenge.isReal ? (
                    <CheckCircle className="text-green-600 dark:text-green-400 w-8 h-8" />
                  ) : (
                    <XCircle className="text-red-600 dark:text-red-400 w-8 h-8" />
                  )}
                  <span className={`text-xl font-bold ${userGuess === challenge.isReal ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {userGuess === challenge.isReal ? "Correct!" : "Incorrect!"}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 ml-11 leading-relaxed">
                  {challenge.explanation}
                </p>
              </div>
              
              <button 
                onClick={nextLevel}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
              >
                Next Challenge <RefreshCw size={18} className={gameOver ? "" : "hidden"}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}