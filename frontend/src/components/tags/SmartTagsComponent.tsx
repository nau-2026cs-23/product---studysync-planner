import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tags, Tag, Search, Plus, X, Trash2, Edit2, Check, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
  isSystem: boolean;
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

const SAMPLE_TAGS: Tag[] = [
  { id: '1', name: 'Mathematics', color: '#4F46E5', count: 12, isSystem: true },
  { id: '2', name: 'Computer Science', color: '#06B6D4', count: 8, isSystem: true },
  { id: '3', name: 'Chemistry', color: '#10B981', count: 5, isSystem: true },
  { id: '4', name: 'Important', color: '#F59E0B', count: 15, isSystem: true },
  { id: '5', name: 'Exam Prep', color: '#EC4899', count: 7, isSystem: false },
  { id: '6', name: 'Homework', color: '#8B5CF6', count: 9, isSystem: false },
];

const SAMPLE_NOTES: Note[] = [
  {
    id: '1',
    title: 'Calculus III - Integration by Parts',
    content: 'Integration by parts is a technique for integrating products of functions...',
    tags: ['Mathematics', 'Important', 'Homework'],
    createdAt: '2026-03-15',
  },
  {
    id: '2',
    title: 'Data Structures - Binary Trees',
    content: 'A binary tree is a tree data structure in which each node has at most two children...',
    tags: ['Computer Science', 'Important', 'Exam Prep'],
    createdAt: '2026-03-14',
  },
  {
    id: '3',
    title: 'Organic Chemistry - Functional Groups',
    content: 'Functional groups are specific groups of atoms within molecules that are responsible for the characteristic chemical reactions...',
    tags: ['Chemistry', 'Important'],
    createdAt: '2026-03-13',
  },
];

export default function SmartTagsComponent() {
  const { t } = useLanguage();
  const [tags, setTags] = useState<Tag[]>(SAMPLE_TAGS);
  const [notes, setNotes] = useState<Note[]>(SAMPLE_NOTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  // AI-generated tag suggestions
  const aiSuggestions = [
    { name: 'Study Guide', color: '#0EA5E9' },
    { name: 'Lecture Notes', color: '#F97316' },
    { name: 'Practice Problems', color: '#14B8A6' },
    { name: 'Research', color: '#8B5CF6' },
  ];

  function handleAddTag() {
    if (!newTagName.trim()) return toast.error(t('tagNameRequired'));
    
    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: getRandomColor(),
      count: 0,
      isSystem: false,
    };
    
    setTags(prev => [newTag, ...prev]);
    setNewTagName('');
    setShowAddTagModal(false);
    toast.success(t('tagAdded', { name: newTag.name }));
  }

  function handleEditTag(id: string) {
    const tag = tags.find(t => t.id === id);
    if (tag) {
      setEditingTag(id);
      setEditTagName(tag.name);
    }
  }

  function handleSaveTag(id: string) {
    if (!editTagName.trim()) return toast.error(t('tagNameRequired'));
    
    setTags(prev => prev.map(tag => 
      tag.id === id ? { ...tag, name: editTagName.trim() } : tag
    ));
    setEditingTag(null);
    setEditTagName('');
    toast.success(t('tagUpdated'));
  }

  function handleDeleteTag(id: string) {
    const tag = tags.find(t => t.id === id);
    if (tag?.isSystem) {
      return toast.error(t('cannotDeleteSystemTag'));
    }
    
    setTags(prev => prev.filter(tag => tag.id !== id));
    setNotes(prev => prev.map(note => ({
      ...note,
      tags: note.tags.filter(tagName => tagName !== tags.find(t => t.id === id)?.name),
    })));
    toast.success(t('tagDeleted'));
  }

  function getRandomColor(): string {
    const colors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#0EA5E9', '#F97316'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function handleTagClick(tagName: string) {
    setSelectedTag(selectedTag === tagName ? null : tagName);
  }

  function handleAddTagToNote(noteId: string, tagName: string) {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        if (!note.tags.includes(tagName)) {
          const updatedTags = [...note.tags, tagName];
          // Update tag count
          setTags(tPrev => tPrev.map(tag => 
            tag.name === tagName ? { ...tag, count: tag.count + 1 } : tag
          ));
          return { ...note, tags: updatedTags };
        }
      }
      return note;
    }));
    toast.success(t('tagAddedToNote', { tag: tagName }));
  }

  function handleRemoveTagFromNote(noteId: string, tagName: string) {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const updatedTags = note.tags.filter(tag => tag !== tagName);
        // Update tag count
        setTags(tPrev => tPrev.map(tag => 
          tag.name === tagName ? { ...tag, count: Math.max(0, tag.count - 1) } : tag
        ));
        return { ...note, tags: updatedTags };
      }
      return note;
    }));
  }

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotes = selectedTag
    ? notes.filter(note => note.tags.includes(selectedTag))
    : notes;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('smartTags')}</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>{t('smartTagsDescription')}</p>
      </div>

      {/* Search and Add Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#64748B' }} />
          <input
            type="text"
            placeholder={t('searchTags')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{ background: '#131929', border: '1px solid #1E2D45', color: '#F1F5F9' }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#1E2D45', color: '#F1F5F9' }}
          >
            <Zap size={16} />
            {t('aiSuggestions')}
          </button>
          <button
            onClick={() => setShowAddTagModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#4F46E5', color: 'white' }}
          >
            <Plus size={16} />
            {t('addTag')}
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      {showAISuggestions && (
        <div className="rounded-2xl p-4 mb-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap size={16} color="#4F46E5" />
            {t('aiTagSuggestions')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  const newTag: Tag = {
                    id: Date.now().toString() + index,
                    name: suggestion.name,
                    color: suggestion.color,
                    count: 0,
                    isSystem: false,
                  };
                  setTags(prev => [newTag, ...prev]);
                  toast.success(t('tagAdded', { name: suggestion.name }));
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{ background: `${suggestion.color}20`, color: suggestion.color, border: `1px solid ${suggestion.color}30` }}
              >
                <Plus size={12} />
                {suggestion.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <div className="rounded-2xl" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
              <h2 className="font-semibold flex items-center gap-2">
                <Tags size={18} color="#4F46E5" />
                {t('yourTags', { count: filteredTags.length })}
              </h2>
            </div>
            {filteredTags.length === 0 ? (
              <div className="text-center py-12">
                <Tags size={40} color="#1E2D45" className="mx-auto mb-3" />
                <p style={{ color: '#64748B' }}>{t('noTagsYet')}</p>
                <button
                  onClick={() => setShowAddTagModal(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ background: '#4F46E5', color: 'white' }}
                >
                  {t('addYourFirstTag')}
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredTags.map(tag => (
                  <div key={tag.id} className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: tag.color }} />
                      <div>
                        <p className="font-medium">{tag.name}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{tag.count} {t('notes')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTagClick(tag.name)}
                        className={`p-1.5 rounded-lg transition-all ${selectedTag === tag.name ? 'bg-blue-500/20' : 'text-gray-500'}`}
                        style={{ color: selectedTag === tag.name ? '#4F46E5' : '#64748B' }}
                      >
                        {selectedTag === tag.name ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                      {!tag.isSystem && (
                        <>
                          <button
                            onClick={() => handleEditTag(tag.id)}
                            className="p-1.5 rounded-lg transition-all"
                            style={{ color: '#64748B' }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="p-1.5 rounded-lg transition-all"
                            style={{ color: '#64748B' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes List */}
        <div className="md:col-span-2">
          <div className="rounded-2xl" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
              <h2 className="font-semibold flex items-center gap-2">
                <Tags size={18} color="#4F46E5" />
                {selectedTag ? t('notesWithTag', { tag: selectedTag }) : t('allNotes')}
              </h2>
            </div>
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <Tags size={40} color="#1E2D45" className="mx-auto mb-3" />
                <p style={{ color: '#64748B' }}>{t('noNotesWithTag', { tag: selectedTag })}</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {filteredNotes.map(note => (
                  <div key={note.id} className="p-4 rounded-xl" style={{ background: '#1E2D45' }}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{note.title}</h3>
                      <span className="text-xs" style={{ color: '#64748B' }}>{note.createdAt}</span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#94A3B8' }}>{note.content.substring(0, 100)}...</p>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map(tagName => {
                        const tag = tags.find(t => t.name === tagName);
                        return (
                          <span key={tagName} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: `${tag?.color}20`, color: tag?.color, border: `1px solid ${tag?.color}30` }}>
                            {tagName}
                            <button
                              onClick={() => handleRemoveTagFromNote(note.id, tagName)}
                              className="text-xs hover:opacity-100 opacity-70"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        );
                      })}
                      <button
                        onClick={() => {
                          // Show tag selection for this note
                          const availableTags = tags.filter(tag => !note.tags.includes(tag.name));
                          if (availableTags.length > 0) {
                            const tag = availableTags[0];
                            handleAddTagToNote(note.id, tag.name);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: '#2D3748', color: '#CBD5E1', border: '1px dashed #4A5568' }}>
                          <Plus size={10} />
                          {t('addTag')}
                        </button>
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Tag Modal */}
      {showAddTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">{t('addTag')}</h3>
              <button onClick={() => setShowAddTagModal(false)}><X size={20} color="#64748B" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>{t('tagName')}</label>
                <input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder={t('enterTagName')}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddTagModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddTag}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#4F46E5', color: 'white' }}
              >
                {t('addTag')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {editingTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">{t('editTag')}</h3>
              <button onClick={() => setEditingTag(null)}><X size={20} color="#64748B" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#64748B' }}>{t('tagName')}</label>
                <input
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  placeholder={t('enterTagName')}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2D45', color: '#F1F5F9' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingTag(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => handleSaveTag(editingTag)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#4F46E5', color: 'white' }}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
