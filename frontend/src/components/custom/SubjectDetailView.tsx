import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, FileText, Edit, Trash2, BookOpen, ArrowLeft, Book, Plus, Save, X, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AppView } from '@/types';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  subjectId: string;
  semester: string;
  tags: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface Draft {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  semesterId?: string;
  subjectId?: string;
}

interface Subject {
  id: string;
  name: string;
  notes: number;
  drafts: number;
  isActive: boolean;
  color: string;
}

interface Props {
  onNavigate: (view: AppView) => void;
}

const SubjectDetailView = ({ onNavigate }: Props) => {
  const { id: subjectId } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState<Subject | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  
  // 新笔记和草稿状态
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showAddDraftDialog, setShowAddDraftDialog] = useState(false);
  const [showEditNoteDialog, setShowEditNoteDialog] = useState(false);
  const [showEditDraftDialog, setShowEditDraftDialog] = useState(false);
  
  // 表单状态
  const [currentNote, setCurrentNote] = useState<Note>({
    id: '',
    title: '',
    content: '',
    subject: '',
    subjectId: subjectId || '',
    semester: '',
    tags: '',
    createdAt: new Date()
  });
  
  const [currentDraft, setCurrentDraft] = useState<Draft>({
    id: '',
    title: '',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    subjectId: subjectId || ''
  });

  // 模拟获取科目数据
  useEffect(() => {
    // 这里应该从API获取科目数据
    const mockSubjects: Subject[] = [
      { id: '1', name: '高数', notes: 3, drafts: 2, isActive: true, color: '#4F46E5' },
      { id: '2', name: '英语', notes: 1, drafts: 0, isActive: false, color: '#10B981' },
      { id: '3', name: '物理', notes: 0, drafts: 1, isActive: false, color: '#F59E0B' }
    ];
    
    const foundSubject = mockSubjects.find(s => s.id === subjectId);
    if (foundSubject) {
      setSubject(foundSubject);
      // 更新当前笔记和草稿的科目信息
      setCurrentNote(prev => ({
        ...prev,
        subject: foundSubject.name,
        subjectId: foundSubject.id
      }));
      setCurrentDraft(prev => ({
        ...prev,
        subjectId: foundSubject.id
      }));
    }
  }, [subjectId]);

  // 模拟获取笔记数据
  useEffect(() => {
    // 这里应该从API获取笔记数据
    const mockNotes: Note[] = [
      {
        id: '1',
        title: '微积分III - 分部积分法',
        content: '分部积分法是一种用于积分乘积函数的技术...',
        subject: '高数',
        subjectId: subjectId,
        semester: '2026春季',
        tags: '微积分, 积分',
        createdAt: new Date('2026-04-20'),
        updatedAt: new Date('2026-04-22')
      },
      {
        id: '2',
        title: '导数的应用',
        content: '导数在函数分析中的应用...',
        subject: '高数',
        subjectId: subjectId,
        semester: '2026春季',
        tags: '导数, 应用',
        createdAt: new Date('2026-04-18'),
        updatedAt: new Date('2026-04-18')
      },
      {
        id: '3',
        title: '极限的计算',
        content: '极限的定义和计算方法...',
        subject: '高数',
        subjectId: subjectId,
        semester: '2026春季',
        tags: '极限, 计算',
        createdAt: new Date('2026-04-15'),
        updatedAt: new Date('2026-04-15')
      }
    ];
    
    setNotes(mockNotes.filter(note => note.subjectId === subjectId));
  }, [subjectId]);

  // 模拟获取草稿数据
  useEffect(() => {
    // 这里应该从API获取草稿数据
    const mockDrafts: Draft[] = [
      {
        id: '1',
        title: '微分方程笔记',
        content: '微分方程的基本概念...',
        createdAt: new Date('2026-04-23'),
        updatedAt: new Date('2026-04-23'),
        subjectId: subjectId,
        semesterId: '1'
      },
      {
        id: '2',
        title: '级数收敛性',
        content: '级数收敛性的判断方法...',
        createdAt: new Date('2026-04-21'),
        updatedAt: new Date('2026-04-21'),
        subjectId: subjectId,
        semesterId: '1'
      }
    ];
    
    setDrafts(mockDrafts.filter(draft => draft.subjectId === subjectId));
  }, [subjectId]);

  const handleBack = () => {
    onNavigate('subjects');
  };

  // 笔记相关函数
  const handleAddNote = () => {
    const newNote: Note = {
      ...currentNote,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([...notes, newNote]);
    resetNoteForm();
    setShowAddNoteDialog(false);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setShowEditNoteDialog(true);
  };

  const handleUpdateNote = () => {
    const updatedNotes = notes.map(note => 
      note.id === currentNote.id 
        ? { ...currentNote, updatedAt: new Date() }
        : note
    );
    setNotes(updatedNotes);
    resetNoteForm();
    setShowEditNoteDialog(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  // 草稿相关函数
  const handleAddDraft = () => {
    const newDraft: Draft = {
      ...currentDraft,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setDrafts([...drafts, newDraft]);
    resetDraftForm();
    setShowAddDraftDialog(false);
  };

  const handleEditDraft = (draft: Draft) => {
    setCurrentDraft(draft);
    setShowEditDraftDialog(true);
  };

  const handleUpdateDraft = () => {
    const updatedDrafts = drafts.map(draft => 
      draft.id === currentDraft.id 
        ? { ...currentDraft, updatedAt: new Date() }
        : draft
    );
    setDrafts(updatedDrafts);
    resetDraftForm();
    setShowEditDraftDialog(false);
  };

  const handleDeleteDraft = (draftId: string) => {
    setDrafts(drafts.filter(draft => draft.id !== draftId));
  };

  // 重置表单函数
  const resetNoteForm = () => {
    setCurrentNote({
      id: '',
      title: '',
      content: '',
      subject: subject?.name || '',
      subjectId: subjectId || '',
      semester: '',
      tags: '',
      createdAt: new Date()
    });
  };

  const resetDraftForm = () => {
    setCurrentDraft({
      id: '',
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      subjectId: subjectId || ''
    });
  };

  if (!subjectId || !subject) {
    return <div className="flex items-center justify-center h-64">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span>学科</span>
        </button>
      </div>

      {/* 学科标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <p className="text-sm text-muted-foreground">{notes.length} 笔记 · {drafts.length} 草稿</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索这些笔记......"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
                <Book size={16} />
                添加笔记
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>添加新笔记</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">标题</label>
                  <Input
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="笔记标题"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">内容</label>
                  <Textarea
                    value={currentNote.content}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="笔记内容"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">学期</label>
                  <Input
                    value={currentNote.semester}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, semester: e.target.value }))}
                    placeholder="例如：2026春季"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">标签</label>
                  <Input
                    value={currentNote.tags}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="例如：微积分, 积分"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    resetNoteForm();
                    setShowAddNoteDialog(false);
                  }}
                >
                  取消
                </Button>
                <Button onClick={handleAddNote}>
                  保存
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showAddDraftDialog} onOpenChange={setShowAddDraftDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
                <FileText size={16} />
                添加草稿
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>添加新草稿</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">标题</label>
                  <Input
                    value={currentDraft.title}
                    onChange={(e) => setCurrentDraft(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="草稿标题"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">内容</label>
                  <Textarea
                    value={currentDraft.content}
                    onChange={(e) => setCurrentDraft(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="草稿内容"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    resetDraftForm();
                    setShowAddDraftDialog(false);
                  }}
                >
                  取消
                </Button>
                <Button onClick={handleAddDraft}>
                  保存
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 笔记和草稿列表 */}
      <div className="space-y-6">
        {/* 笔记列表 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">笔记</h2>
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map(note => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{note.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">{note.semester}</span>
                          <span className="text-xs text-muted-foreground">{note.createdAt.toLocaleDateString()}</span>
                          {note.updatedAt && (
                            <span className="text-xs text-muted-foreground">更新于: {note.updatedAt.toLocaleDateString()}</span>
                          )}
                        </div>
                        {note.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {note.tags.split(',').map((tag, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                <Tag size={10} />
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button 
                          onClick={() => handleEditNote(note)}
                          className="p-1 rounded hover:bg-accent"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 rounded hover:bg-accent"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p>暂无笔记</p>
              </div>
            )}
          </div>
        </div>

        {/* 草稿列表 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">草稿</h2>
          <div className="space-y-4">
            {drafts.length > 0 ? (
              drafts.map(draft => (
                <Card key={draft.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{draft.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {draft.content.substring(0, 100)}{draft.content.length > 100 ? '...' : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>创建于: {draft.createdAt.toLocaleDateString()}</span>
                          <span>更新于: {draft.updatedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button 
                          onClick={() => handleEditDraft(draft)}
                          className="p-1 rounded hover:bg-accent"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="p-1 rounded hover:bg-accent"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>暂无草稿</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 编辑笔记对话框 */}
      <Dialog open={showEditNoteDialog} onOpenChange={setShowEditNoteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑笔记</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">标题</label>
              <Input
                value={currentNote.title}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="笔记标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">内容</label>
              <Textarea
                value={currentNote.content}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="笔记内容"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">学期</label>
              <Input
                value={currentNote.semester}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, semester: e.target.value }))}
                placeholder="例如：2026春季"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">标签</label>
              <Input
                value={currentNote.tags}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="例如：微积分, 积分"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                resetNoteForm();
                setShowEditNoteDialog(false);
              }}
            >
              取消
            </Button>
            <Button onClick={handleUpdateNote}>
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑草稿对话框 */}
      <Dialog open={showEditDraftDialog} onOpenChange={setShowEditDraftDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑草稿</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">标题</label>
              <Input
                value={currentDraft.title}
                onChange={(e) => setCurrentDraft(prev => ({ ...prev, title: e.target.value }))}
                placeholder="草稿标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">内容</label>
              <Textarea
                value={currentDraft.content}
                onChange={(e) => setCurrentDraft(prev => ({ ...prev, content: e.target.value }))}
                placeholder="草稿内容"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                resetDraftForm();
                setShowEditDraftDialog(false);
              }}
            >
              取消
            </Button>
            <Button onClick={handleUpdateDraft}>
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectDetailView;