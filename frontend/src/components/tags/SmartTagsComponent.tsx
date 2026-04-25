import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tags, Search, Plus, X, Trash2, Edit2, Check, Zap, BarChart3, Cloud, BookOpen, Brain, Filter, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
  isSystem: boolean;
  category: 'subject' | 'priority' | 'type' | 'custom';
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

const SAMPLE_TAGS: Tag[] = [
  { id: '1', name: '数学', color: '#4F46E5', count: 12, isSystem: true, category: 'subject' },
  { id: '2', name: '计算机科学', color: '#06B6D4', count: 8, isSystem: true, category: 'subject' },
  { id: '3', name: '化学', color: '#10B981', count: 5, isSystem: true, category: 'subject' },
  { id: '4', name: '重要', color: '#F59E0B', count: 15, isSystem: true, category: 'priority' },
  { id: '5', name: '考试准备', color: '#EC4899', count: 7, isSystem: false, category: 'type' },
  { id: '6', name: '作业', color: '#8B5CF6', count: 9, isSystem: false, category: 'type' },
  { id: '7', name: '学习指南', color: '#0EA5E9', count: 4, isSystem: false, category: 'type' },
  { id: '8', name: '课堂笔记', color: '#F97316', count: 6, isSystem: false, category: 'type' },
  { id: '9', name: '练习题目', color: '#14B8A6', count: 3, isSystem: false, category: 'type' },
  { id: '10', name: '研究', color: '#8B5CF6', count: 2, isSystem: false, category: 'type' },
];

const SAMPLE_NOTES: Note[] = [
  {
    id: '1',
    title: '微积分III - 分部积分法',
    content: '分部积分法是一种用于积分函数乘积的技术...',
    tags: ['数学', '重要', '作业'],
    createdAt: '2026-03-15',
  },
  {
    id: '2',
    title: '数据结构 - 二叉树',
    content: '二叉树是一种树状数据结构，其中每个节点最多有两个子节点...',
    tags: ['计算机科学', '重要', '考试准备'],
    createdAt: '2026-03-14',
  },
  {
    id: '3',
    title: '有机化学 - 官能团',
    content: '官能团是分子中特定的原子团，负责分子的特征化学反应...',
    tags: ['化学', '重要'],
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
  const [newTagCategory, setNewTagCategory] = useState<'subject' | 'priority' | 'type' | 'custom'>('custom');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagCategory, setEditTagCategory] = useState<'subject' | 'priority' | 'type' | 'custom'>('custom');
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showTagSelection, setShowTagSelection] = useState<string | null>(null); // Note ID for tag selection
  const [activeView, setActiveView] = useState<'list' | 'cloud' | 'stats'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // AI-generated tag suggestions
  const aiSuggestions = [
    { name: '学习指南', color: '#0EA5E9' },
    { name: '课堂笔记', color: '#F97316' },
    { name: '练习题目', color: '#14B8A6' },
    { name: '研究', color: '#8B5CF6' },
  ];

  // 语言国际化默认值
  const getTranslatedText = (key: string, params?: any) => {
    if (t(key, params)) return t(key, params);
    
    const defaults: Record<string, string> = {
      smartTags: '智能标签',
      smartTagsDescription: 'AI驱动的标签系统，自动组织您的笔记。',
      searchTags: '搜索标签...',
      aiSuggestions: 'AI建议',
      addTag: '添加标签',
      aiTagSuggestions: 'AI标签建议',
      yourTags: `您的标签 (${filteredTags.length})`,
      noTagsYet: '还没有标签',
      addYourFirstTag: '添加您的第一个标签',
      notes: '笔记',
      allNotes: '所有笔记',
      notesWithTag: `包含标签 "${selectedTag}" 的笔记`,
      noNotesWithTag: `没有包含标签 "${selectedTag}" 的笔记`,
      tagNameRequired: '请输入标签名称',
      tagAdded: `标签 "${params?.name}" 已添加`,
      tagUpdated: '标签已更新',
      cannotDeleteSystemTag: '不能删除系统标签',
      tagDeleted: '标签已删除',
      tagAddedToNote: `标签 "${params?.tag}" 已添加到笔记`,
      cancel: '取消',
      save: '保存',
      editTag: '编辑标签',
      enterTagName: '输入标签名称',
      tagName: '标签名称',
    };
    
    return defaults[key] || key;
  };

  function handleAddTag() {
    if (!newTagName.trim()) return toast.error(getTranslatedText('tagNameRequired'));
    
    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: getRandomColor(),
      count: 0,
      isSystem: false,
      category: newTagCategory,
    };
    
    setTags(prev => [newTag, ...prev]);
    setNewTagName('');
    setNewTagCategory('custom');
    setShowAddTagModal(false);
    toast.success(getTranslatedText('tagAdded', { name: newTag.name }));
  }

  function handleEditTag(id: string) {
    const tag = tags.find(t => t.id === id);
    if (tag) {
      setEditingTag(id);
      setEditTagName(tag.name);
      setEditTagCategory(tag.category);
    }
  }

  function handleSaveTag(id: string) {
    if (!editTagName.trim()) return toast.error(getTranslatedText('tagNameRequired'));
    
    setTags(prev => prev.map(tag => 
      tag.id === id ? { ...tag, name: editTagName.trim(), category: editTagCategory } : tag
    ));
    setEditingTag(null);
    setEditTagName('');
    setEditTagCategory('custom');
    toast.success(getTranslatedText('tagUpdated'));
  }

  function handleDeleteTag(id: string) {
    const tag = tags.find(t => t.id === id);
    if (tag?.isSystem) {
      return toast.error(getTranslatedText('cannotDeleteSystemTag'));
    }
    
    const tagToDelete = tags.find(t => t.id === id);
    setTags(prev => prev.filter(tag => tag.id !== id));
    setNotes(prev => prev.map(note => ({
      ...note,
      tags: note.tags.filter(tagName => tagName !== tagToDelete?.name),
    })));
    toast.success(getTranslatedText('tagDeleted'));
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
    toast.success(getTranslatedText('tagAddedToNote', { tag: tagName }));
    setShowTagSelection(null);
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
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === null || tag.category === selectedCategory)
  );

  const filteredNotes = selectedTag
    ? notes.filter(note => note.tags.includes(selectedTag))
    : notes;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{getTranslatedText('smartTags')}</h1>
        <p className="text-sm mt-1 text-muted-foreground">{getTranslatedText('smartTagsDescription')}</p>
      </div>

      {/* Search and Add Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={getTranslatedText('searchTags')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none bg-card border border-input text-foreground"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <Zap size={16} />
            {getTranslatedText('aiSuggestions')}
          </button>
          <button
            onClick={() => setShowAddTagModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/80"
          >
            <Plus size={16} />
            {getTranslatedText('addTag')}
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      {showAISuggestions && (
        <div className="rounded-2xl p-4 mb-6 bg-card border border-input">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap size={16} className="text-primary" />
            {getTranslatedText('aiTagSuggestions')}
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
                  toast.success(getTranslatedText('tagAdded', { name: suggestion.name }));
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
          <div className="rounded-2xl bg-card border border-input">
            <div className="px-5 py-4 border-b border-input">
              <h2 className="font-semibold flex items-center gap-2">
                <Tags size={18} className="text-primary" />
                {getTranslatedText('yourTags', { count: filteredTags.length })}
              </h2>
            </div>
            
            {/* View and Category Filters */}
            <div className="p-4 border-b border-input">
              <div className="flex flex-col gap-3">
                {/* View Switcher */}
                <div>
                  <h3 className="text-xs font-medium mb-2 text-muted-foreground">视图</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveView('list')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                      列表
                    </button>
                    <button
                      onClick={() => setActiveView('cloud')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === 'cloud' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                      标签云
                    </button>
                    <button
                      onClick={() => setActiveView('stats')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === 'stats' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                      统计
                    </button>
                  </div>
                </div>
                
                {/* Category Filter */}
                <div>
                  <h3 className="text-xs font-medium mb-2 text-muted-foreground">分类</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedCategory === null ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                      全部
                    </button>
                    <button
                      onClick={() => setSelectedCategory('subject')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedCategory === 'subject' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                      科目
                    </button>
                    <button
                      onClick={() => setSelectedCategory('priority')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedCategory === 'priority' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                      优先级
                    </button>
                    <button
                      onClick={() => setSelectedCategory('type')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedCategory === 'type' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                      类型
                    </button>
                    <button
                      onClick={() => setSelectedCategory('custom')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedCategory === 'custom' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                      自定义
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {filteredTags.length === 0 ? (
              <div className="text-center py-12">
                <Tags size={40} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">{getTranslatedText('noTagsYet')}</p>
                <button
                  onClick={() => setShowAddTagModal(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/80"
                >
                  {getTranslatedText('addYourFirstTag')}
                </button>
              </div>
            ) : (
              <div className="p-4">
                {activeView === 'list' && (
                  <div className="space-y-2">
                    {filteredTags.map(tag => (
                      <div key={tag.id} className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-accent/50">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ background: tag.color }} />
                          <div>
                            <p className="font-medium">{tag.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{tag.count} {getTranslatedText('notes')}</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                {tag.category === 'subject' ? '科目' : tag.category === 'priority' ? '优先级' : tag.category === 'type' ? '类型' : '自定义'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTagClick(tag.name)}
                            className={`p-1.5 rounded-lg transition-all ${selectedTag === tag.name ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                          >
                            {selectedTag === tag.name ? <Check size={14} /> : <Plus size={14} />}
                          </button>
                          {!tag.isSystem && (
                            <>
                              <button
                                onClick={() => handleEditTag(tag.id)}
                                className="p-1.5 rounded-lg transition-all text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteTag(tag.id)}
                                className="p-1.5 rounded-lg transition-all text-muted-foreground hover:text-destructive"
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
                
                {activeView === 'cloud' && (
                  <div className="flex flex-wrap gap-3 p-4 justify-center">
                    {filteredTags.map(tag => {
                      // 根据标签使用次数计算字体大小
                      const fontSize = Math.max(12, Math.min(24, 12 + (tag.count / 2)));
                      return (
                        <button
                          key={tag.id}
                          onClick={() => handleTagClick(tag.name)}
                          className={`px-3 py-1.5 rounded-full transition-all ${selectedTag === tag.name ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                          style={{ 
                            color: tag.color,
                            fontSize: `${fontSize}px`,
                            border: `1px solid ${tag.color}30`,
                            backgroundColor: selectedTag === tag.name ? tag.color : `${tag.color}10`
                          }}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {activeView === 'stats' && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-accent">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <BarChart3 size={14} />
                        标签统计
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>总标签数</span>
                          <span className="font-medium">{filteredTags.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>总使用次数</span>
                          <span className="font-medium">{filteredTags.reduce((sum, tag) => sum + tag.count, 0)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>最常用标签</span>
                          <span className="font-medium">
                            {filteredTags.sort((a, b) => b.count - a.count)[0]?.name || '无'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium mb-2">使用频率</h3>
                      {filteredTags.sort((a, b) => b.count - a.count).slice(0, 5).map(tag => {
                        const maxCount = Math.max(...filteredTags.map(t => t.count));
                        const width = maxCount > 0 ? Math.min(100, (tag.count / maxCount) * 100) + '%' : '0%';
                        return (
                          <div key={tag.id} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: tag.color }} />
                            <span className="text-sm flex-1">{tag.name}</span>
                            <div className="flex-1 h-2 bg-secondary rounded-full">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: width,
                                  background: tag.color
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium ml-2">{tag.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notes List */}
        <div className="md:col-span-2">
          <div className="rounded-2xl bg-card border border-input">
            <div className="px-5 py-4 border-b border-input">
              <h2 className="font-semibold flex items-center gap-2">
                <Tags size={18} className="text-primary" />
                {selectedTag ? getTranslatedText('notesWithTag', { tag: selectedTag }) : getTranslatedText('allNotes')}
              </h2>
            </div>
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <Tags size={40} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">{getTranslatedText('noNotesWithTag', { tag: selectedTag })}</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {filteredNotes.map(note => (
                  <div key={note.id} className="p-4 rounded-xl bg-muted">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{note.title}</h3>
                      <span className="text-xs text-muted-foreground">{note.createdAt}</span>
                    </div>
                    <p className="text-sm mb-3 text-muted-foreground">{note.content.substring(0, 100)}...</p>
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
                        onClick={() => setShowTagSelection(note.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-border text-muted-foreground border border-dashed hover:bg-accent"
                      >
                        <Plus size={10} />
                        {getTranslatedText('addTag')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tag Selection Modal */}
      {showTagSelection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md rounded-2xl p-6 bg-card border border-input">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">{getTranslatedText('addTag')}</h3>
              <button onClick={() => setShowTagSelection(null)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">选择要添加到笔记的标签：</p>
              <div className="flex flex-wrap gap-2">
                {tags.filter(tag => !notes.find(n => n.id === showTagSelection)?.tags.includes(tag.name)).map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleAddTagToNote(showTagSelection!, tag.name)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{ background: `${tag.color}20`, color: tag.color, border: `1px solid ${tag.color}30` }}
                  >
                    <Plus size={12} />
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTagSelection(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-input text-muted-foreground hover:bg-accent"
              >
                {getTranslatedText('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      {showAddTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md rounded-2xl p-6 bg-card border border-input">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">{getTranslatedText('addTag')}</h3>
              <button onClick={() => setShowAddTagModal(false)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('tagName')}</label>
                <input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder={getTranslatedText('enterTagName')}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">分类</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewTagCategory('subject')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${newTagCategory === 'subject' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    科目
                  </button>
                  <button
                    onClick={() => setNewTagCategory('priority')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${newTagCategory === 'priority' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    优先级
                  </button>
                  <button
                    onClick={() => setNewTagCategory('type')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${newTagCategory === 'type' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    类型
                  </button>
                  <button
                    onClick={() => setNewTagCategory('custom')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${newTagCategory === 'custom' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    自定义
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddTagModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-input text-muted-foreground hover:bg-accent"
              >
                {getTranslatedText('cancel')}
              </button>
              <button
                onClick={handleAddTag}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80"
              >
                {getTranslatedText('addTag')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {editingTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md rounded-2xl p-6 bg-card border border-input">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">{getTranslatedText('editTag')}</h3>
              <button onClick={() => setEditingTag(null)}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">{getTranslatedText('tagName')}</label>
                <input
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  placeholder={getTranslatedText('enterTagName')}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block text-muted-foreground">分类</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEditTagCategory('subject')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${editTagCategory === 'subject' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    科目
                  </button>
                  <button
                    onClick={() => setEditTagCategory('priority')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${editTagCategory === 'priority' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    优先级
                  </button>
                  <button
                    onClick={() => setEditTagCategory('type')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${editTagCategory === 'type' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    类型
                  </button>
                  <button
                    onClick={() => setEditTagCategory('custom')}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${editTagCategory === 'custom' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    自定义
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingTag(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-input text-muted-foreground hover:bg-accent"
              >
                {getTranslatedText('cancel')}
              </button>
              <button
                onClick={() => handleSaveTag(editingTag)}
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
