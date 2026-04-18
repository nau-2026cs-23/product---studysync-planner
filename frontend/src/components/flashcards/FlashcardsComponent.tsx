import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CreditCard, Plus, X, RotateCcw, CheckCircle2, Clock, BookOpen, BarChart3, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: string;
  reviewCount: number;
  lastReviewed: string | null;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  lastStudied: string | null;
}

const SAMPLE_DECKS: Deck[] = [
  {
    id: '1',
    name: 'Calculus III',
    description: 'Flashcards for Calculus III concepts',
    cardCount: 15,
    lastStudied: '2026-03-15',
  },
  {
    id: '2',
    name: 'Computer Science',
    description: 'Data structures and algorithms',
    cardCount: 20,
    lastStudied: '2026-03-14',
  },
  {
    id: '3',
    name: 'Organic Chemistry',
    description: 'Functional groups and reactions',
    cardCount: 12,
    lastStudied: '2026-03-13',
  },
];

const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: '1',
    front: 'What is integration by parts?',
    back: 'Integration by parts is a technique for integrating products of functions. The formula is ∫u dv = uv - ∫v du.',
    tags: ['Calculus', 'Integration'],
    difficulty: 'medium',
    nextReview: '2026-03-16',
    reviewCount: 3,
    lastReviewed: '2026-03-15',
  },
  {
    id: '2',
    front: 'What is a binary tree?',
    back: 'A binary tree is a tree data structure in which each node has at most two children, referred to as the left child and the right child.',
    tags: ['Computer Science', 'Data Structures'],
    difficulty: 'easy',
    nextReview: '2026-03-20',
    reviewCount: 5,
    lastReviewed: '2026-03-14',
  },
  {
    id: '3',
    front: 'What is a functional group?',
    back: 'A functional group is a specific group of atoms within a molecule that is responsible for the characteristic chemical reactions of that molecule.',
    tags: ['Chemistry', 'Organic Chemistry'],
    difficulty: 'medium',
    nextReview: '2026-03-17',
    reviewCount: 2,
    lastReviewed: '2026-03-13',
  },
];

export default function FlashcardsComponent() {
  const { t } = useLanguage();
  const [decks, setDecks] = useState<Deck[]>(SAMPLE_DECKS);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(SAMPLE_FLASHCARDS);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '', tags: '' });
  const [studying, setStudying] = useState(false);

  function handleStartStudying(deckId: string) {
    setSelectedDeck(deckId);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setStudying(true);
  }

  function handleFlipCard() {
    setIsFlipped(!isFlipped);
  }

  function handleShowAnswer() {
    setShowAnswer(true);
  }

  function handleNextCard(difficulty: 'easy' | 'medium' | 'hard') {
    // Update flashcard with new difficulty and next review date
    const updatedCards = [...flashcards];
    if (updatedCards[currentCardIndex]) {
      updatedCards[currentCardIndex] = {
        ...updatedCards[currentCardIndex],
        difficulty,
        nextReview: calculateNextReview(difficulty),
        reviewCount: updatedCards[currentCardIndex].reviewCount + 1,
        lastReviewed: new Date().toISOString().split('T')[0],
      };
      setFlashcards(updatedCards);
    }

    // Move to next card
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    } else {
      // End of deck
      setStudying(false);
      setSelectedDeck(null);
      toast.success(t('studySessionCompleted', { count: flashcards.length }));
    }
  }

  function calculateNextReview(difficulty: 'easy' | 'medium' | 'hard') {
    const today = new Date();
    let daysToAdd = 0;
    switch (difficulty) {
      case 'easy':
        daysToAdd = 7;
        break;
      case 'medium':
        daysToAdd = 3;
        break;
      case 'hard':
        daysToAdd = 1;
        break;
    }
    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString().split('T')[0];
  }

  function handleAddCard() {
    if (!newCard.front.trim() || !newCard.back.trim()) {
      return toast.error(t('cardFrontAndBackRequired'));
    }

    const tags = newCard.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const card: Flashcard = {
      id: Date.now().toString(),
      front: newCard.front.trim(),
      back: newCard.back.trim(),
      tags,
      difficulty: 'medium',
      nextReview: new Date().toISOString().split('T')[0],
      reviewCount: 0,
      lastReviewed: null,
    };

    setFlashcards(prev => [card, ...prev]);
    setNewCard({ front: '', back: '', tags: '' });
    setShowAddCardModal(false);
    toast.success(t('cardAdded'));
  }

  const filteredFlashcards = flashcards.filter(card =>
    card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentCard = studying && flashcards[currentCardIndex] ? flashcards[currentCardIndex] : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {studying ? (
        // Study Mode
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('studyMode')}</h1>
            <button
              onClick={() => setStudying(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#1E2D45', color: '#F1F5F9' }}
            >
              <X size={16} />
              {t('exitStudyMode')}
            </button>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: '#64748B' }} />
              <span className="text-sm" style={{ color: '#64748B' }}>
                {t('cardProgress', { current: currentCardIndex + 1, total: flashcards.length })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} style={{ color: '#64748B' }} />
              <span className="text-sm" style={{ color: '#64748B' }}>
                {t('deck', { name: decks.find(d => d.id === selectedDeck)?.name || '' })}
              </span>
            </div>
          </div>

          {currentCard && (
            <div className="mb-8">
              <div
                className="w-full h-96 perspective-1000 mb-6"
                onClick={handleFlipCard}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                  {/* Front */}
                  <div className="absolute w-full h-full backface-hidden rounded-2xl p-6 flex flex-col justify-center items-center text-center" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                    <h2 className="text-xl font-semibold mb-4">{t('question')}</h2>
                    <p className="text-lg">{currentCard.front}</p>
                    <div className="mt-6 flex gap-2 flex-wrap justify-center">
                      {currentCard.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 rounded-full text-xs" style={{ background: '#1E2D45', color: '#64748B' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFlipped(true);
                      }}
                      className="mt-8 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                      style={{ background: '#4F46E5', color: 'white' }}
                    >
                      {t('flipToSeeAnswer')}
                    </button>
                  </div>
                  
                  {/* Back */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl p-6 flex flex-col justify-center items-center text-center" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                    <h2 className="text-xl font-semibold mb-4">{t('answer')}</h2>
                    <p className="text-lg mb-6">{currentCard.back}</p>
                    <div className="w-full max-w-md space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextCard('easy');
                        }}
                        className="w-full py-2 rounded-xl text-sm font-medium transition-all"
                        style={{ background: '#10B981', color: 'white' }}
                      >
                        {t('easy')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextCard('medium');
                        }}
                        className="w-full py-2 rounded-xl text-sm font-medium transition-all"
                        style={{ background: '#F59E0B', color: 'white' }}
                      >
                        {t('medium')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextCard('hard');
                        }}
                        className="w-full py-2 rounded-xl text-sm font-medium transition-all"
                        style={{ background: '#EF4444', color: 'white' }}
                      >
                        {t('hard')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Main View
        <>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('flashcards')}</h1>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>{t('flashcardsDescription')}</p>
          </div>

          {/* Search and Add Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#64748B' }} />
              <input
                type="text"
                placeholder={t('searchFlashcards')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none"
                style={{ background: '#131929', border: '1px solid #1E2D45', color: '#F1F5F9' }}
              />
            </div>
            <button
              onClick={() => setShowAddCardModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#4F46E5', color: 'white' }}
            >
              <Plus size={16} />
              {t('addFlashcard')}
            </button>
          </div>

          {/* Decks */}
          <div className="mb-8">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={18} color="#4F46E5" />
              {t('yourDecks')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map(deck => (
                <div key={deck.id} className="rounded-2xl p-5 transition-all hover:shadow-lg" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{deck.name}</h3>
                    <div className="px-2 py-1 rounded-full text-xs" style={{ background: '#4F46E5/20', color: '#4F46E5' }}>
                      {deck.cardCount} {t('cards')}
                    </div>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>{deck.description}</p>
                  {deck.lastStudied && (
                    <p className="text-xs mb-4" style={{ color: '#64748B' }}>
                      {t('lastStudied')}: {deck.lastStudied}
                    </p>
                  )}
                  <button
                    onClick={() => handleStartStudying(deck.id)}
                    className="w-full py-2 rounded-xl text-sm font-medium transition-all"
                    style={{ background: '#4F46E5', color: 'white' }}
                  >
                    {t('startStudying')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Flashcards */}
          <div>
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={18} color="#4F46E5" />
              {t('allFlashcards')} ({filteredFlashcards.length})
            </h2>
            {filteredFlashcards.length === 0 ? (
              <div className="text-center py-12 rounded-2xl" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                <CreditCard size={40} color="#1E2D45" className="mx-auto mb-3" />
                <p style={{ color: '#64748B' }}>{t('noFlashcardsYet')}</p>
                <button
                  onClick={() => setShowAddCardModal(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ background: '#4F46E5', color: 'white' }}
                >
                  {t('addYourFirstFlashcard')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFlashcards.map(card => (
                  <div key={card.id} className="rounded-2xl p-4 transition-all hover:shadow-lg" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium truncate">{card.front.substring(0, 30)}...</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                          background: card.difficulty === 'easy' ? '#10B981/20' : card.difficulty === 'medium' ? '#F59E0B/20' : '#EF4444/20',
                          color: card.difficulty === 'easy' ? '#10B981' : card.difficulty === 'medium' ? '#F59E0B' : '#EF4444'
                        }}>
                          {t(card.difficulty)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#64748B' }}>{card.back.substring(0, 60)}...</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 rounded-full text-xs" style={{ background: '#1E2D45', color: '#64748B' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ color: '#64748B' }}>
                      <span>{t('reviewCount', { count: card.reviewCount })}</span>
                      <span>{t('nextReview', { date: card.nextReview })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Flashcard Modal */}
          {showAddCardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
              <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-lg">{t('addFlashcard')}</h3>
                  <button onClick={() => setShowAddCardModal(false)}><X size={20} color="#64748B" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>{t('frontOfCard')}</label>
                    <textarea
                      value={newCard.front}
                      onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                      placeholder={t('enterQuestionOrTerm')}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>{t('backOfCard')}</label>
                    <textarea
                      value={newCard.back}
                      onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                      placeholder={t('enterAnswerOrDefinition')}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>{t('tags')}</label>
                    <input
                      value={newCard.tags}
                      onChange={(e) => setNewCard({ ...newCard, tags: e.target.value })}
                      placeholder={t('enterTagsCommaSeparated')}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddCardModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                    style={{ border: '1px solid #1E2D45', color: '#64748B' }}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleAddCard}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: '#4F46E5', color: 'white' }}
                  >
                    {t('addFlashcard')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
