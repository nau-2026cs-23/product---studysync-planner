import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileText, Plus, Save, BookOpen, GraduationCap, Tag, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AppView } from '@/types';
import * as api from '@/lib/api';

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

interface Props {
  onNavigate: (view: AppView) => void;
  initialSemesterId?: string;
  initialSubjectId?: string;
}

const VaultView = ({ onNavigate, initialSemesterId, initialSubjectId }: Props) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [semester, setSemester] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [subjects, setSubjects] = useState([
    { id: '1', name: '高数' },
    { id: '2', name: '英语' },
    { id: '3', name: '物理' }
  ]);
  
  const [semesters] = useState([
    { id: '1', name: '2026春季' },
    { id: '2', name: '2025秋季' }
  ]);
  
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // 从服务器同步数据
  const syncFromServer = async () => {
    try {
      setIsSyncing(true);
      const response = await api.getNotes();
      if (response.success && response.data) {
        const serverNotes = response.data.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined
        }));
        setNotes(serverNotes);
      }
    } catch (error) {
      console.error('同步笔记失败:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // 初始化时同步数据
  useEffect(() => {
    syncFromServer();
    // 定期同步数据（每30秒）
    const interval = setInterval(syncFromServer, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleImportPDF = () => {
    // 实现PDF导入功能
    console.log('Import PDF clicked');
  };

  const handleAutoSave = () => {
    if ((noteTitle.trim() || noteContent.trim()) && !editingNote) {
      const selectedSubject = subjects.find(s => s.id === subjectId);
      
      const draftNote: Note = {
        id: Date.now().toString(),
        title: noteTitle || '未命名笔记',
        content: noteContent,
        subject: selectedSubject?.name || '',
        subjectId: subjectId,
        semester,
        tags,
        createdAt: new Date()
      };

      setNotes(prev => {
        // 检查是否已有未保存的笔记
        const existingNote = prev.find(n => n.title === '未命名笔记' && !n.subjectId && !n.semester);
        if (existingNote) {
          return prev.map(note => 
            note.id === existingNote.id 
              ? { ...note, content: noteContent, updatedAt: new Date() }
              : note
          );
        }
        return [draftNote, ...prev];
      });
      console.log('笔记已自动保存');
    } else if (editingNote) {
      // 更新正在编辑的笔记
      const selectedSubject = subjects.find(s => s.id === subjectId);
      
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { 
              ...note, 
              title: noteTitle, 
              content: noteContent, 
              subject: selectedSubject?.name || '',
              subjectId: subjectId,
              semester,
              tags,
              updatedAt: new Date()
            }
          : note
      ));
      console.log('笔记已自动更新');
    }
  };

  // 监听初始学期和科目ID
  useEffect(() => {
    if (initialSemesterId) {
      const semesterObj = semesters.find(s => s.id === initialSemesterId);
      if (semesterObj) {
        setSemester(semesterObj.name);
      }
    }
    if (initialSubjectId) {
      setSubjectId(initialSubjectId);
      const subjectObj = subjects.find(s => s.id === initialSubjectId);
      if (subjectObj) {
        setSubject(subjectObj.name);
      }
    }
  }, [initialSemesterId, initialSubjectId, semesters, subjects]);

  // 监听输入变化，触发自动保存
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    // 3秒后自动保存
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 3000);
    
    setAutoSaveTimer(timer);
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [noteTitle, noteContent, subjectId, semester, tags, editingNote]);

  const handleSaveDraft = () => {
    if (noteTitle.trim() === '' && noteContent.trim() === '') {
      alert('请输入标题或内容');
      return;
    }
    
    const selectedSubject = subjects.find(s => s.id === subjectId);
    const selectedSemester = semesters.find(s => s.name === semester);
    
    // 保存到草稿列表
    const newDraft = {
      id: Date.now().toString(),
      title: noteTitle || '未命名草稿',
      content: noteContent,
      createdAt: new Date(),
      updatedAt: new Date(),
      semesterId: selectedSemester?.id || '',
      subjectId: subjectId
    };
    
    // 从localStorage读取现有的草稿
    const savedDrafts = localStorage.getItem('drafts');
    const existingDrafts = savedDrafts ? JSON.parse(savedDrafts) : [];
    
    // 添加新草稿到列表开头
    const updatedDrafts = [newDraft, ...existingDrafts];
    localStorage.setItem('drafts', JSON.stringify(updatedDrafts));
    
    // 同样保存到notes列表作为未发布的笔记
    const draftNote: Note = {
      id: newDraft.id,
      title: noteTitle || '未命名笔记',
      content: noteContent,
      subject: selectedSubject?.name || '',
      subjectId: subjectId,
      semester,
      tags,
      createdAt: new Date()
    };
    setNotes(prev => [draftNote, ...prev]);
    
    alert('草稿保存成功！');
    resetForm();
  };

  const handleAddNote = async () => {
    if (noteTitle.trim() === '') return;
    
    const selectedSubject = subjects.find(s => s.id === subjectId);
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      subject: selectedSubject?.name || '',
      subjectId: subjectId,
      semester,
      tags,
      createdAt: new Date()
    };

    try {
      // 同步到服务器
      const response = await api.createNote(newNote);
      if (response.success && response.data) {
        setNotes([...notes, response.data]);
      } else {
        setNotes([...notes, newNote]);
      }
    } catch (error) {
      console.error('添加笔记失败:', error);
      setNotes([...notes, newNote]);
    }
    
    resetForm();
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setSubject(note.subject);
    setSubjectId(note.subjectId);
    setSemester(note.semester);
    setTags(note.tags);
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;
    
    const selectedSubject = subjects.find(s => s.id === subjectId);
    
    const updatedNote = {
      ...editingNote,
      title: noteTitle,
      content: noteContent,
      subject: selectedSubject?.name || '',
      subjectId,
      semester,
      tags,
      updatedAt: new Date()
    };

    try {
      // 同步到服务器
      const response = await api.updateNote(editingNote.id, updatedNote);
      if (response.success && response.data) {
        const updatedNotes = notes.map(note => 
          note.id === editingNote.id ? response.data : note
        );
        setNotes(updatedNotes);
      } else {
        const updatedNotes = notes.map(note => 
          note.id === editingNote.id ? updatedNote : note
        );
        setNotes(updatedNotes);
      }
    } catch (error) {
      console.error('更新笔记失败:', error);
      const updatedNotes = notes.map(note => 
        note.id === editingNote.id ? updatedNote : note
      );
      setNotes(updatedNotes);
    }
    
    resetForm();
  };

  const handleDeleteNote = async (id: string) => {
    try {
      // 找到要删除的笔记
      const noteToDelete = notes.find(note => note.id === id);
      if (noteToDelete) {
        // 保存到最近删除
        const savedDeleted = localStorage.getItem('recentlyDeleted');
        const existingDeleted = savedDeleted ? JSON.parse(savedDeleted) : [];
        const deletedItem = {
          id: Date.now().toString(),
          title: noteToDelete.title,
          content: noteToDelete.content,
          type: 'note' as const,
          deletedAt: new Date(),
          originalData: noteToDelete
        };
        const updatedDeleted = [deletedItem, ...existingDeleted];
        localStorage.setItem('recentlyDeleted', JSON.stringify(updatedDeleted));
      }

      // 同步到服务器
      await api.deleteNote(id);
    } catch (error) {
      console.error('删除笔记失败:', error);
    } finally {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setSubject('');
    setSubjectId('');
    setSemester('');
    setTags('');
    setEditingNote(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">您的保险库</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-2">
            <FileText size={16} />
            导入PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">#</span>
              </div>
              <h3 className="font-medium">保险库数量</h3>
            </div>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-medium">↑</span>
              </div>
              <h3 className="font-medium">本周新增</h3>
            </div>
            <p className="text-2xl font-bold">+0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                <BookOpen size={14} className="text-green-600" />
              </div>
              <h3 className="font-medium">保险库深度</h3>
            </div>
            <p className="text-2xl font-bold">轻度</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <Input
            type="text"
            placeholder="笔记标题..."
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="mb-4 text-lg"
          />

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
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
            <textarea
              placeholder="在这里写你的笔记..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full border rounded-md p-3 min-h-[200px]"
            />
          </div>

          <div className="mb-4">
            <details>
              <summary className="flex items-center gap-2 cursor-pointer">
                <BookOpen size={16} />
                <span>添加科目、学期和标签</span>
              </summary>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">科目</label>
                  <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择科目" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">学期</label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择学期" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map(semesterOption => (
                        <SelectItem key={semesterOption.id} value={semesterOption.name}>
                          {semesterOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">标签</label>
                  <Input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="添加标签"
                  />
                </div>
              </div>
            </details>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              className="flex items-center gap-2"
              onClick={handleSaveDraft}
            >
              <Save size={16} />
              保存草稿
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              onClick={editingNote ? handleUpdateNote : handleAddNote}
            >
              <Plus size={16} />
              {editingNote ? '更新笔记' : '添加笔记'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <div className="flex justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17h.01" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-muted-foreground">No notes yet. Start by adding a note or importing a PDF.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-lg truncate">{note.title}</h3>
                  <div className="flex items-center gap-2">
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
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                </p>
                {note.subject && (
                  <div className="text-xs text-muted-foreground mb-1">
                    <BookOpen size={12} className="inline mr-1" />
                    {note.subject}
                  </div>
                )}
                {note.semester && (
                  <div className="text-xs text-muted-foreground mb-1">
                    <GraduationCap size={12} className="inline mr-1" />
                    {note.semester}
                  </div>
                )}
                {note.tags && (
                  <div className="text-xs text-muted-foreground mb-2">
                    <Tag size={12} className="inline mr-1" />
                    {note.tags}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {note.createdAt.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaultView;