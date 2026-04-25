import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timer, Zap, Pause, Play, SkipForward, Settings, X, Moon, Sun, Coffee, Clock, Target, Music, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FocusModeProps {
  className?: string;
}

export function FocusMode({ className }: FocusModeProps) {
  const { t } = useLanguage();
  
  // 状态管理
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分钟，单位秒
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [focusTasks, setFocusTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [customTime, setCustomTime] = useState('25');
  
  // 参考链接中的专注模式设置
  const modeSettings = {
    focus: { duration: 25, label: '专注', color: 'bg-green-500' },
    shortBreak: { duration: 5, label: '短休息', color: 'bg-blue-500' },
    longBreak: { duration: 15, label: '长休息', color: 'bg-purple-500' }
  };
  
  // 计时器引用
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 音效引用
  const soundRef = useRef<HTMLAudioElement | null>(null);
  
  // 初始化音效
  useEffect(() => {
    soundRef.current = new Audio('/sounds/bell.mp3');
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
      }
    };
  }, []);
  
  // 计时器逻辑
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused]);
  
  // 处理会话结束
  const handleSessionEnd = () => {
    setIsRunning(false);
    setIsPaused(false);
    
    // 播放音效
    if (soundEnabled && soundRef.current) {
      soundRef.current.play().catch(e => console.error('播放音效失败:', e));
    }
    
    // 更新会话计数
    if (mode === 'focus') {
      setSessionCount(prev => {
        const newCount = prev + 1;
        // 每4个专注会话后，下一个休息是长休息
        if (newCount % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(modeSettings.longBreak.duration * 60);
        } else {
          setMode('shortBreak');
          setTimeLeft(modeSettings.shortBreak.duration * 60);
        }
        return newCount;
      });
    } else {
      // 休息结束后回到专注模式
      setMode('focus');
      setTimeLeft(modeSettings.focus.duration * 60);
    }
  };
  
  // 开始/暂停计时器
  const toggleTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };
  
  // 重置计时器
  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(modeSettings[mode].duration * 60);
  };
  
  // 切换模式
  const changeMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(modeSettings[newMode].duration * 60);
    setIsRunning(false);
    setIsPaused(false);
  };
  
  // 添加任务
  const addTask = () => {
    if (newTask.trim()) {
      setFocusTasks([...focusTasks, newTask.trim()]);
      setNewTask('');
    }
  };
  
  // 完成任务
  const completeTask = (index: number) => {
    const task = focusTasks[index];
    setCompletedTasks([...completedTasks, task]);
    setFocusTasks(focusTasks.filter((_, i) => i !== index));
  };
  
  // 移除任务
  const removeTask = (index: number) => {
    setFocusTasks(focusTasks.filter((_, i) => i !== index));
  };
  
  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 计算进度百分比
  const progressPercentage = () => {
    const totalSeconds = modeSettings[mode].duration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300 ${className || ''}`}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="text-yellow-500" />
            专注模式
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full ${soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-600'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* 模式选择 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => changeMode('focus')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${mode === 'focus' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            专注
          </button>
          <button
            onClick={() => changeMode('shortBreak')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${mode === 'shortBreak' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            短休息
          </button>
          <button
            onClick={() => changeMode('longBreak')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${mode === 'longBreak' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            长休息
          </button>
        </div>

        {/* 计时器 */}
        <div className="flex flex-col items-center mb-8">
          <Card className={`w-full max-w-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="relative w-64 h-64">
                  {/* 进度环 */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* 背景圆环 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={darkMode ? '#374151' : '#e5e7eb'}
                      strokeWidth="8"
                    />
                    {/* 进度圆环 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={mode === 'focus' ? '#10b981' : mode === 'shortBreak' ? '#3b82f6' : '#8b5cf6'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * progressPercentage()) / 100}
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  {/* 时间显示 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>
                    <div className="text-xl text-gray-500 mt-2">{modeSettings[mode].label}</div>
                  </div>
                </div>
              </div>

              {/* 控制按钮 */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={resetTimer}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Timer size={16} />
                  重置
                </Button>
                <Button
                  onClick={toggleTimer}
                  className={`flex items-center gap-2 ${mode === 'focus' ? 'bg-green-500 hover:bg-green-600' : mode === 'shortBreak' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'}`}
                >
                  {isRunning && !isPaused ? (
                    <>
                      <Pause size={16} />
                      暂停
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      开始
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    handleSessionEnd();
                  }}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <SkipForward size={16} />
                  跳过
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 会话统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-green-500" />
                <h3 className="font-medium">今日专注会话</h3>
              </div>
              <p className="text-3xl font-bold">{sessionCount}</p>
            </CardContent>
          </Card>
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-blue-500" />
                <h3 className="font-medium">今日专注时间</h3>
              </div>
              <p className="text-3xl font-bold">{Math.round((sessionCount * 25) / 60)}h {sessionCount * 25 % 60}m</p>
            </CardContent>
          </Card>
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="text-purple-500" />
                <h3 className="font-medium">休息次数</h3>
              </div>
              <p className="text-3xl font-bold">{Math.floor(sessionCount / 4)}次长休息</p>
            </CardContent>
          </Card>
        </div>

        {/* 任务管理 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 待完成任务 */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="text-yellow-500" />
                待完成任务
              </h3>
              <div className="space-y-2 mb-4">
                {focusTasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <button
                      onClick={() => completeTask(index)}
                      className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                    >
                      ✓
                    </button>
                    <span className="flex-1">{task}</span>
                    <button
                      onClick={() => removeTask(index)}
                      className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {focusTasks.length === 0 && (
                  <p className="text-center text-gray-500">添加任务开始专注</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="添加任务..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  className="flex-1"
                />
                <Button onClick={addTask}>
                  <Plus size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 已完成任务 */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                已完成任务
              </h3>
              <div className="space-y-2">
                {completedTasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <div className="p-1 rounded-full bg-green-200 text-green-600">
                      ✓
                    </div>
                    <span className="flex-1 line-through text-gray-600 dark:text-gray-400">{task}</span>
                  </div>
                ))}
                {completedTasks.length === 0 && (
                  <p className="text-center text-gray-500">完成任务后会显示在这里</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 专注统计 */}
        <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">专注统计</h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-sm mb-2">{day}</span>
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="font-medium">{Math.floor(Math.random() * 10)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 缺少的组件
const CheckCircle = ({ className, size = 20 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Plus = ({ className, size = 20 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);