import { useState, useRef } from 'react';
import { Mic, Volume2, AudioWaveform, PlayCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ThinkingProcess, AgentThought } from '../ui/ThinkingProcess';

export function TruthLine() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // FIX: Added missing state for language detection
  const [detectedLang, setDetectedLang] = useState('hi-IN'); 
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    setResult(null);
    setTranscript('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = handleAudioStop;
      
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied. Please check settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release mic
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAudioStop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64Audio = reader.result as string;
      sendAudioToBackend(base64Audio);
    };
  };

  const sendAudioToBackend = async (base64Audio: string) => {
    setLoading(true);
    setThoughts([]);

    try {
      const res = await fetch('http://127.0.0.1:5500/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio_data: base64Audio })
      });

      const data = await res.json();
      const fullText = data.analysis;
      
      // FIX: Removed unused 'replyMatch'. Added 'langMatch'.
      const transMatch = fullText.match(/TRANSCRIPT:\s*(.*?)(?=\nVERDICT:|$)/s);
      const langMatch = fullText.match(/LANGUAGE_TAG:\s*(.*)/);

      if (transMatch) setTranscript(transMatch[1].trim());
      else setTranscript("Audio processed");

      if (langMatch) setDetectedLang(langMatch[1].trim());

      setResult(fullText);
      setThoughts(data.thoughts || []);

    } catch (e) {
      console.error(e);
      setError("Failed to process audio. Backend might be busy.");
    } finally {
      setLoading(false);
    }
  };

  const speakResult = () => {
    if (!result) return;
    
    // Parse the reply again here where it is actually used
    const replyMatch = result.match(/REPLY:\s*(.*?)(?=\nLANGUAGE_TAG:|$)/s);
    const textToSpeak = replyMatch ? replyMatch[1].trim() : result;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = detectedLang; // Use the language detected by AI
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-2xl mx-auto pt-12 text-center space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-3">
          <AudioWaveform className="text-purple-500" size={40} /> TruthLine
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Voice-First Verification by TruthLens.
        </p>
      </div>

      {/* Big Mic Button */}
      <div className="relative group cursor-pointer" onClick={isRecording ? stopRecording : startRecording}>
        <div className={`absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-20 transition-opacity ${isRecording ? 'animate-pulse opacity-60' : ''}`}></div>
        
        <div className={`relative w-48 h-48 mx-auto rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-4 ${isRecording ? 'bg-red-600 border-red-400 scale-105' : 'bg-slate-900 dark:bg-slate-800 border-slate-700 hover:border-purple-500'}`}>
          {isRecording ? (
            <div className="w-16 h-16 bg-white rounded-lg animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          ) : (
            <Mic size={80} className="text-white group-hover:scale-110 transition-transform" />
          )}
        </div>
        
        <div className="mt-8">
           <p className={`text-xl font-bold ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-600 dark:text-slate-300'}`}>
             {isRecording ? "Recording... Tap to Stop" : "Tap to Speak"}
           </p>
        </div>
      </div>

      {error && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 border border-red-200 text-red-700 dark:text-red-300 rounded-full text-sm font-medium animate-in fade-in">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Transcript Area */}
      {(transcript || loading) && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl inline-block border border-slate-200 dark:border-slate-700 max-w-lg relative min-w-[300px]">
            <p className="text-xs uppercase text-slate-400 font-bold mb-2">You Said:</p>
            {loading && !transcript ? (
               <div className="flex items-center justify-center gap-2 text-blue-500 py-2">
                 <Loader2 className="animate-spin" /> Processing Audio...
               </div>
            ) : (
               <p className="text-lg text-slate-700 dark:text-white italic font-serif leading-relaxed">
                 "{transcript}"
               </p>
            )}
          </div>
        </div>
      )}

      {(loading || thoughts.length > 0) && <ThinkingProcess thoughts={thoughts} loading={loading} />}

      {/* Result Display */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-purple-200 dark:border-purple-900/30 shadow-xl p-8 text-left animate-in slide-in-from-bottom-8">
          <div className="flex justify-between items-start mb-6 border-b border-purple-100 dark:border-purple-900/30 pb-4">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                 <Volume2 className="text-purple-600 dark:text-purple-400" />
               </div>
               <h3 className="font-bold text-xl text-slate-900 dark:text-white">TruthLens Reply</h3>
             </div>
             <button 
               onClick={speakResult} 
               className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95"
             >
               <PlayCircle size={20} /> Speak Reply ({detectedLang})
             </button>
          </div>
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}