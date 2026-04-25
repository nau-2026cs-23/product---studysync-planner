import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { BookOpen, Edit2, Trash2, Plus, X, ChevronRight, ChevronLeft, Check, RotateCcw, BarChart3, Filter, Clock, Brain, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  lastReviewed: string | null;
  reviewCount: number;
  nextReview: string | null;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

const SAMPLE_SUBJECTS: Subject[] = [
  { id: '1', name: '数学', color: '#4F46E5' },
  { id: '2', name: '计算机科学', color: '#06B6D4' },
  { id: '3', name: '化学', color: '#10B981' },
  { id: '4', name: '物理', color: '#F59E0B' },
  { id: '5', name: '历史', color: '#EC4899' },
];

const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: '1',
    front: '什么是微积分中的导数？',
    back: '导数是函数在某一点的变化率，也可以理解为函数图像在该点的切线斜率。',
    subject: '数学',
    tags: ['微积分', '重要'],
    difficulty: 'medium',
    createdAt: '2026-03-15',
    lastReviewed: '2026-03-16',
    reviewCount: 3,
    nextReview: '2026-03-17',
  },
  {
    id: '2',
    front: '什么是二叉树？',
    back: '二叉树是一种树状数据结构，其中每个节点最多有两个子节点，分别称为左子节点和右子节点。',
    subject: '计算机科学',
    tags: ['数据结构', '算法'],
    difficulty: 'easy',
    createdAt: '2026-03-14',
    lastReviewed: '2026-03-15',
    reviewCount: 2,
    nextReview: '2026-03-16',
  },
  {
    id: '3',
    front: '什么是化学键？',
    back: '化学键是原子之间的相互作用力，使原子结合成分子或晶体。',
    subject: '化学',
    tags: ['基础化学', '重要'],
    difficulty: 'medium',
    createdAt: '2026-03-13',
    lastReviewed: '2026-03-14',
    reviewCount: 1,
    nextReview: '2026-03-15',
  },
];

export default function FlashcardComponent() {
  const { t } = useLanguage();
  const [flashcards, setFlashcards] = useState<Flashcard[]>(SAMPLE_FLASHCARDS);
  const [subjects, setSubjects] = useState<Subject[]>(SAMPLE_SUBJECTS);
  const [activeView, setActiveView] = useState<'list' | 'study' | 'stats'>('list');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    subject: SAMPLE_SUBJECTS[0].name,
    tags: [] as string[],
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });
  const [editCard, setEditCard] = useState<Flashcard | null>(null);
  const [reviewMode, setReviewMode] = useState<'all' | 'due' | 'difficult'>('all');
  const [studyStats, setStudyStats] = useState({
    totalCards: SAMPLE_FLASHCARDS.length,
    reviewedToday: 2,
    correctAnswers: 5,
    incorrectAnswers: 1,
    accuracy: 83,
    streak: 7,
  });
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // 语言国际化默认值
  const getTranslatedText = (key: string, params?: any) => {
    if (t(key, params)) return t(key, params);
    
    const defaults: Record<string, string> = {
      flashcards: '闪卡',
      flashcardsDescription: '创建和学习闪卡，提高记忆效率。',
      study: '学习',
      list: '列表',
      stats: '统计',
      addFlashcard: '添加闪卡',
      searchFlashcards: '搜索闪卡...',
      noFlashcards: '还没有闪卡',
      addYourFirstFlashcard: '添加您的第一张闪卡',
      front: '正面',
      back: '背面',
      subject: '科目',
      difficulty: '难度',
      tags: '标签',
      addTag: '添加标签',
      save: '保存',
      cancel: '取消',
      editFlashcard: '编辑闪卡',
      deleteFlashcard: '删除闪卡',
      confirmDelete: '确定要删除这张闪卡吗？',
      flashcardAdded: '闪卡已添加',
      flashcardUpdated: '闪卡已更新',
      flashcardDeleted: '闪卡已删除',
      easy: '简单',
      medium: '中等',
      hard: '困难',
      all: '全部',
      due: '待复习',
      difficult: '困难',
      totalCards: '总闪卡数',
      reviewedToday: '今日已复习',
      correctAnswers: '正确答案',
      incorrectAnswers: '错误答案',
      accuracy: '准确率',
      streak: '连续天数',
      flipCard: '点击翻转卡片',
      nextCard: '下一张',
      prevCard: '上一张',
      markEasy: '简单',
      markMedium: '中等',
      markHard: '困难',
      reset: '重置',
      studyMode: '学习模式',
      cardsLeft: '剩余卡片',
      progress: '进度',
    };
    
    return defaults[key] || key;
  };

  function handleAddFlashcard() {
    if (!newCard.front.trim() || !newCard.back.trim()) {
      return toast.error('请填写闪卡正面和背面内容');
    }
    
    const flashcard: Flashcard = {
      id: Date.now().toString(),
      front: newCard.front.trim(),
      back: newCard.back.trim(),
      subject: newCard.subject,
      tags: newCard.tags,
      difficulty: newCard.difficulty,
      createdAt: new Date().toISOString(),
      lastReviewed: null,
      reviewCount: 0,
      nextReview: null,
    };
    
    setFlashcards(prev => [flashcard, ...prev]);
    setNewCard({
      front: '',
      back: '',
      subject: SAMPLE_SUBJECTS[0].name,
      tags: [],
      difficulty: 'medium',
    });
    setShowAddModal(false);
    toast.success(getTranslatedText('flashcardAdded'));
  }

  function handleEditFlashcard() {
    if (!editCard || !editCard.front.trim() || !editCard.back.trim()) {
      return toast.error('请填写闪卡正面和背面内容');
    }
    
    setFlashcards(prev => prev.map(card => 
      card.id === editCard.id ? editCard : card
    ));
    setEditCard(null);
    setShowEditModal(null);
    toast.success(getTranslatedText('flashcardUpdated'));
  }

  function handleDeleteFlashcard(id: string) {
    if (confirm(getTranslatedText('confirmDelete'))) {
      setFlashcards(prev => prev.filter(card => card.id !== id));
      toast.success(getTranslatedText('flashcardDeleted'));
    }
  }

  function handleAddTag() {
    if (newTag.trim() && !newCard.tags.includes(newTag.trim())) {
      setNewCard(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  }

  function handleRemoveTag(tag: string) {
    setNewCard(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  }

  function handleEditAddTag() {
    if (editCard && newTag.trim() && !editCard.tags.includes(newTag.trim())) {
      setEditCard(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  }

  function handleEditRemoveTag(tag: string) {
    if (editCard) {
      setEditCard(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag),
      }));
    }
  }

  function handleStudyStart() {
    setActiveView('study');
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }

  function handleNextCard() {
    if (currentCardIndex < filteredFlashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  }

  function handlePrevCard() {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }

  function handleMarkCard(difficulty: 'easy' | 'medium' | 'hard') {
    const updatedFlashcards = [...flashcards];
    const currentCard = updatedFlashcards.find(card => card.id === filteredFlashcards[currentCardIndex].id);
    if (currentCard) {
      currentCard.lastReviewed = new Date().toISOString();
      currentCard.reviewCount += 1;
      currentCard.difficulty = difficulty;
      
      // 简单的间隔重复算法
      const interval = difficulty === 'easy' ? 7 : difficulty === 'medium' ? 3 : 1;
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);
      currentCard.nextReview = nextReview.toISOString();
      
      setFlashcards(updatedFlashcards);
    }
    
    handleNextCard();
  }

  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = card.front.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         card.back.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === null || card.subject === selectedSubject;
    
    if (reviewMode === 'due') {
      const now = new Date();
      return matchesSearch && matchesSubject && 
             (card.nextReview === null || new Date(card.nextReview) <= now);
    } else if (reviewMode === 'difficult') {
      return matchesSearch && matchesSubject && card.difficulty === 'hard';
    }
    
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{getTranslatedText('flashcards')}</h1>
        <p className="text-sm mt-1 text-muted-foreground">{getTranslatedText('flashcardsDescription')}</p>
      </div>

      {/* View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeView === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            <BookOpen size={16} className="inline mr-2" />
            {getTranslatedText('list')}
          </button>
          <button
            onClick={handleStudyStart}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeView === 'study' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            <Brain size={16} className="inline mr-2" />
            {getTranslatedText('study')}
          </button>
          <button
            onClick={() => setActiveView('stats')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeView === 'stats' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            <BarChart3 size={16} className="inline mr-2" />
            {getTranslatedText('stats')}
          </button>
        </div>
        
        {activeView === 'list' && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/80"
            >
              <Plus size={16} />
              {getTranslatedText('addFlashcard')}
            </button>
          </div>
        )}
      </div>

      {/* List View */}
      {activeView === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-card border border-input p-4">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                筛选
              </h2>
              
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={getTranslatedText('searchFlashcards')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                />
              </div>
              
              {/* Subject Filter */}
              <div className="mb-4">
                <h3 className="text-xs font-medium mb-2 text-muted-foreground">{getTranslatedText('subject')}</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSubject(null)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${selectedSubject === null ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
                  >
                    全部
                  </button>
                  {subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.name)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${selectedSubject === subject.name ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Review Mode */}
              <div>
                <h3 className="text-xs font-medium mb-2 text-muted-foreground">复习模式</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setReviewMode('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${reviewMode === 'all' ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
                  >
                    {getTranslatedText('all')}
                  </button>
                  <button
                    onClick={() => setReviewMode('due')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${reviewMode === 'due' ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
                  >
                    {getTranslatedText('due')}
                  </button>
                  <button
                    onClick={() => setReviewMode('difficult')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${reviewMode === 'difficult' ? 'bg-primary/20 text-primary' : 'text-foreground'}`}
                  >
                    {getTranslatedText('difficult')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Flashcards List */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-card border border-input">
              <div className="px-5 py-4 border-b border-input">
                <h2 className="font-semibold">闪卡列表 ({filteredFlashcards.length})</h2>
              </div>
              
              {filteredFlashcards.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={40} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">{getTranslatedText('noFlashcards')}</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/80"
                  >
                    {getTranslatedText('addYourFirstFlashcard')}
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {filteredFlashcards.map(card => {
                    const subject = subjects.find(s => s.name === card.subject);
                    return (
                      <div key={card.id} className="p-4 rounded-xl bg-muted border border-input">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ background: subject?.color || '#6B7280' }}
                              />
                              <span className="text-sm font-medium">{card.subject}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${card.difficulty === 'easy' ? 'bg-green-100 text-green-800' : card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                {getTranslatedText(card.difficulty)}
                              </span>
                            </div>
                            <h3 className="font-medium mb-2">{card.front}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{card.back.substring(0, 100)}...</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {card.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              复习次数: {card.reviewCount} | 最后复习: {card.lastReviewed ? new Date(card.lastReviewed).toLocaleDateString() : '从未'}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                setEditCard(card);
                                setShowEditModal(card.id);
                              }}
                              className="p-2 rounded-lg transition-all text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteFlashcard(card.id)}
                              className="p-2 rounded-lg transition-all text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Study View */}
      {activeView === 'study' && (
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-card border border-input p-6">
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">{getTranslatedText('studyMode')}</h2>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{getTranslatedText('cardsLeft')}: {filteredFlashcards.length - currentCardIndex}</span>
                <span>{getTranslatedText('progress')}: {currentCardIndex + 1}/{filteredFlashcards.length}</span>
              </div>
              <div className="mt-2 h-2 bg-secondary rounded-full">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${((currentCardIndex + 1) / filteredFlashcards.length) * 100}%` }}
                />
              </div>
            </div>
            
            {filteredFlashcards.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={40} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">没有可学习的闪卡</p>
                <button
                  onClick={() => setActiveView('list')}
                  className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/80"
                >
                  添加闪卡
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Flashcard */}
                <div className="relative h-64 sm:h-80">
                  <div 
                    className={`absolute inset-0 perspective-1000 transition-all duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl bg-muted border border-input p-6 flex flex-col justify-center">
                      <h3 className="text-lg font-medium mb-4">{getTranslatedText('front')}</h3>
                      <p className="text-xl font-semibold text-center">{filteredFlashcards[currentCardIndex].front}</p>
                      <p className="text-xs text-muted-foreground mt-4 text-center">{getTranslatedText('flipCard')}</p>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-muted border border-input p-6 flex flex-col justify-center">
                      <h3 className="text-lg font-medium mb-4">{getTranslatedText('back')}</h3>
                      <p className="text-xl font-semibold text-center">{filteredFlashcards[currentCardIndex].back}</p>
                      <p className="text-xs text-muted-foreground mt-4 text-center">{getTranslatedText('flipCard')}</p>
                    </div>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="space-y-4">
                  {/* Difficulty Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleMarkCard('easy')}
                      className="py-3 rounded-xl text-sm font-medium transition-all bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      <Check size={16} className="inline mr-2" />
                      {getTranslatedText('markEasy')}
                    </button>
                    <button
                      onClick={() => handleMarkCard('medium')}
                      className="py-3 rounded-xl text-sm font-medium transition-all bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    >
                      <Clock size={16} className="inline mr-2" />
                      {getTranslatedText('markMedium')}
                    </button>
                    <button
                      onClick={() => handleMarkCard('hard')}
                      className="py-3 rounded-xl text-sm font-medium transition-all bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      <Heart size={16} className="inline mr-2" />
                      {getTranslatedText('markHard')}
                    </button>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePrevCard}
                      disabled={currentCardIndex === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentCardIndex === 0 ? 'bg-secondary text-secondary-foreground cursor-not-allowed' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                    >
                      <ChevronLeft size={16} />
                      {getTranslatedText('prevCard')}
                    </button>
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/80"
                    >
                      <RotateCcw size={16} />
                      翻转
                    </button>
                    <button
                      onClick={handleNextCard}
                      disabled={currentCardIndex === filteredFlashcards.length - 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentCardIndex === filteredFlashcards.length - 1 ? 'bg-secondary text-secondary-foreground cursor-not-allowed' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                    >
                      {getTranslatedText('nextCard')}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats View */}
      {activeView === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overview */}
          <div className="rounded-2xl bg-card border border-input p-6">
            <h2 className="font-semibold mb-4">学习概览</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-accent">
                  <p className="text-xs text-muted-foreground mb-1">{getTranslatedText('totalCards')}</p>
                  <p className="text-2xl font-bold">{studyStats.totalCards}</p>
                </div>
                <div className="p-4 rounded-xl bg-accent">
                  <p className="text-xs text-muted-foreground mb-1">{getTranslatedText('reviewedToday')}</p>
                  <p className="text-2xl font-bold">{studyStats.reviewedToday}</p>
                </div>
                <div className="p-4 rounded-xl bg-accent">
                  <p className="text-xs text-muted-foreground mb-1">{getTranslatedText('correctAnswers')}</p>
                  <p className="text-2xl font-bold">{studyStats.correctAnswers}</p>
                </div>
                <div className="p-4 rounded-xl bg-accent">
                  <p className="text-xs text-muted-foreground mb-1">{getTranslatedText('incorrectAnswers')}</p>
                  <p className="text-2xl font-bold">{studyStats.incorrectAnswers}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-accent">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{getTranslatedText('accuracy')}</p>
                  <p className="text-sm font-bold">{studyStats.accuracy}%</p>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${studyStats.accuracy}%` }}
                  />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-accent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{getTranslatedText('streak')}</p>
                    <p className="text-xl font-bold">{studyStats.streak} 天</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed Stats */}
          <div className="rounded-2xl bg-card border border-input p-6">
            <h2 className="font-semibold mb-4">详细统计</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">按科目分类</h3>
                <div className="space-y-2">
                  {subjects.map(subject => {
                    const count = flashcards.filter(card => card.subject === subject.name).length;
                    return (
                      <div key={subject.id} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ background: subject.color }}
                        />
                        <span className="text-sm flex-1">{subject.name}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">按难度分类</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm flex-1">{getTranslatedText('easy')}</span>
                    <span className="text-sm font-medium">{flashcards.filter(card => card.difficulty === 'easy').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm flex-1">{getTranslatedText('medium')}</span>
                    <span className="text-sm font-medium">{flashcards.filter(card => card.difficulty === 'medium').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm flex-1">{getTranslatedText('hard')}</span>
                    <span className="text-sm font-medium">{flashcards.filter(card => card.difficulty === 'hard').length}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">待复习</h3>
                <p className="text-sm text-muted-foreground">
                  {flashcards.filter(card => {
                    const now = new Date();
                    return card.nextReview === null || new Date(card.nextReview) <= now;
                  }).length} 张闪卡待复习
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Flashcard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-2xl p-6 bg-card border border-input">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">{getTranslatedText('addFlashcard')}</h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('front')}</label>
                <textarea
                  value={newCard.front}
                  onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                  placeholder="输入闪卡正面内容..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('back')}</label>
                <textarea
                  value={newCard.back}
                  onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                  placeholder="输入闪卡背面内容..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('subject')}</label>
                <select
                  value={newCard.subject}
                  onChange={(e) => setNewCard(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('difficulty')}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setNewCard(prev => ({ ...prev, difficulty: 'easy' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${newCard.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {getTranslatedText('easy')}
                  </button>
                  <button
                    onClick={() => setNewCard(prev => ({ ...prev, difficulty: 'medium' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${newCard.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {getTranslatedText('medium')}
                  </button>
                  <button
                    onClick={() => setNewCard(prev => ({ ...prev, difficulty: 'hard' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${newCard.difficulty === 'hard' ? 'bg-red-100 text-red-800' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {getTranslatedText('hard')}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('tags')}</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {newCard.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-xs hover:opacity-100 opacity-70"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="添加标签..."
                    className="flex-1 px-3 py-2 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/80"
                  >
                    {getTranslatedText('addTag')}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-input text-muted-foreground hover:bg-accent"
              >
                {getTranslatedText('cancel')}
              </button>
              <button
                onClick={handleAddFlashcard}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80"
              >
                {getTranslatedText('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Flashcard Modal */}
      {showEditModal && editCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-2xl p-6 bg-card border border-input">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">{getTranslatedText('editFlashcard')}</h3>
              <button onClick={() => setShowEditModal(null)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('front')}</label>
                <textarea
                  value={editCard.front}
                  onChange={(e) => setEditCard(prev => ({ ...prev, front: e.target.value }))}
                  placeholder="输入闪卡正面内容..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('back')}</label>
                <textarea
                  value={editCard.back}
                  onChange={(e) => setEditCard(prev => ({ ...prev, back: e.target.value }))}
                  placeholder="输入闪卡背面内容..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('subject')}</label>
                <select
                  value={editCard.subject}
                  onChange={(e) => setEditCard(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('difficulty')}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setEditCard(prev => ({ ...prev, difficulty: 'easy' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${editCard.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {getTranslatedText('easy')}
                  </button>
                  <button
                    onClick={() => setEditCard(prev => ({ ...prev, difficulty: 'medium' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${editCard.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {getTranslatedText('medium')}
                  </button>
                  <button
                    onClick={() => setEditCard(prev => ({ ...prev, difficulty: 'hard' }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${editCard.difficulty === 'hard' ? 'bg-red-100 text-red-800' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {getTranslatedText('hard')}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('tags')}</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {editCard.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                      {tag}
                      <button
                        onClick={() => handleEditRemoveTag(tag)}
                        className="text-xs hover:opacity-100 opacity-70"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="添加标签..."
                    className="flex-1 px-3 py-2 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                  />
                  <button
                    onClick={handleEditAddTag}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/80"
                  >
                    {getTranslatedText('addTag')}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-input text-muted-foreground hover:bg-accent"
              >
                {getTranslatedText('cancel')}
              </button>
              <button
                onClick={handleEditFlashcard}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80"
              >
                {getTranslatedText('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
