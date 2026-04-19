import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timer, ArrowUpRight, Play, Pause, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FocusModeView = () => {
  const { t } = useLanguage();
  const [selectedNote, setSelectedNote] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [timerDuration, setTimerDuration] = useState(25); // 默认25分钟
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 秒
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimerSettings, setShowTimerSettings] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      // 可以添加定时器结束的提示
      alert('Focus session completed!');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(timerDuration * 60);
  };

  const handleDurationChange = (value: string) => {
    const duration = parseInt(value);
    setTimerDuration(duration);
    setTimeLeft(duration * 60);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Focus Mode</h1>
          <p className="text-muted-foreground">Distraction-free writing for deep study sessions</p>
        </div>
        <button className="p-2 rounded-full hover:bg-accent">
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Select value={selectedNote} onValueChange={setSelectedNote}>
          <SelectTrigger className="w-96">
            <SelectValue placeholder="New session / select note" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New session</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            className="flex items-center gap-2"
            onClick={() => setShowTimerSettings(!showTimerSettings)}
          >
            <Timer size={16} />
            Focus Timer
          </Button>
          
          {showTimerSettings && (
            <div className="flex items-center gap-2">
              <Select value={timerDuration.toString()} onValueChange={handleDurationChange}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="25">25 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-xl font-mono">{formatTime(timeLeft)}</div>
              
              {!isTimerRunning ? (
                <Button onClick={startTimer} className="bg-green-500 hover:bg-green-600 text-white">
                  <Play size={16} />
                </Button>
              ) : (
                <Button onClick={pauseTimer} className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Pause size={16} />
                </Button>
              )}
              
              <Button onClick={resetTimer} variant="secondary">
                <RefreshCw size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-6">
          <textarea
            placeholder="Start typing your thoughts..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full border-none outline-none resize-none min-h-[400px]"
          />
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <button className="font-bold">B</button>
            <button className="font-italic">I</button>
            <button className="text-line-through">S</button>
            <span className="mx-2">|</span>
            <button className="text-sm">H₂</button>
            <button className="text-sm">H₃</button>
            <span className="mx-2">|</span>
            <button>≡</button>
            <button>≣</button>
            <button>⊟</button>
            <span className="mx-2">|</span>
            <button>‹</button>
            <button>›</button>
            <span className="mx-2">|</span>
            <button>↩</button>
            <button>↪</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusModeView;