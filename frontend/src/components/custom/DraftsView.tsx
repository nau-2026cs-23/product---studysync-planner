import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileEdit, Edit, Trash2, Send, Plus, Calendar, BookOpen, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AppView } from '@/types';
import * as api from '@/lib/api';

interface Semester {
  id: string;
  name: string;
  isActive: boolean;
}

interface Subject {
  id: string;
  name: string;
  color: string;
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

interface Props {
  onNavigate: (view: AppView) => void;
  initialSemesterId?: string;
  initialSubjectId?: string;
}

const DraftsView = ({ onNavigate, initialSemesterId, initialSubjectId }: Props) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    // 从localStorage中读取草稿数据
    const savedDrafts = localStorage.getItem('drafts');
    return savedDrafts ? JSON.parse(savedDrafts).map((draft: any) => ({
      ...draft,
      createdAt: new Date(draft.createdAt),
      updatedAt: new Date(draft.updatedAt)
    })) : [];
  });
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // 从服务器同步数据
  const syncFromServer = async () => {
    try {
      setIsSyncing(true);
      const response = await api.getDrafts();
      if (response.success && response.data) {
        const serverDrafts = response.data.map((draft: any) => ({
          ...draft,
          createdAt: new Date(draft.createdAt),
          updatedAt: new Date(draft.updatedAt)
        }));
        setDrafts(serverDrafts);
        localStorage.setItem('drafts', JSON.stringify(serverDrafts));
      }
    } catch (error) {
      console.error('同步草稿失败:', error);
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
  
  // 模拟学期数据
  const semesters: Semester[] = [
    { id: '1', name: '2026春季', isActive: true },
    { id: '2', name: '2025秋季', isActive: false }
  ];
  
  // 模拟科目数据
  const subjects: Subject[] = [
    { id: '1', name: '高数', color: '#4F46E5' },
    { id: '2', name: '英语', color: '#10B981' },
    { id: '3', name: '物理', color: '#F59E0B' }
  ];

  const handleAddDraft = async () => {
    if (draftTitle.trim() === '') return;
    
    const newDraft: Draft = {
      id: Date.now().toString(),
      title: draftTitle,
      content: draftContent,
      createdAt: new Date(),
      updatedAt: new Date(),
      semesterId: selectedSemester,
      subjectId: selectedSubject
    };

    try {
      // 同步到服务器
      const response = await api.createDraft(newDraft);
      if (response.success && response.data) {
        setDrafts([...drafts, response.data]);
      } else {
        setDrafts([...drafts, newDraft]);
      }
    } catch (error) {
      console.error('添加草稿失败:', error);
      setDrafts([...drafts, newDraft]);
    }
    
    resetForm();
  };

  const handleEditDraft = (draft: Draft) => {
    setEditingDraft(draft);
    setDraftTitle(draft.title);
    setDraftContent(draft.content);
    setSelectedSemester(draft.semesterId || '');
    setSelectedSubject(draft.subjectId || '');
  };

  const handleUpdateDraft = async () => {
    if (!editingDraft) return;
    
    const updatedDraft = {
      ...editingDraft,
      title: draftTitle,
      content: draftContent,
      updatedAt: new Date(),
      semesterId: selectedSemester,
      subjectId: selectedSubject
    };

    try {
      // 同步到服务器
      const response = await api.updateDraft(editingDraft.id, updatedDraft);
      if (response.success && response.data) {
        const updatedDrafts = drafts.map(draft => 
          draft.id === editingDraft.id ? response.data : draft
        );
        setDrafts(updatedDrafts);
      } else {
        const updatedDrafts = drafts.map(draft => 
          draft.id === editingDraft.id ? updatedDraft : draft
        );
        setDrafts(updatedDrafts);
      }
    } catch (error) {
      console.error('更新草稿失败:', error);
      const updatedDrafts = drafts.map(draft => 
        draft.id === editingDraft.id ? updatedDraft : draft
      );
      setDrafts(updatedDrafts);
    }
    
    resetForm();
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      // 找到要删除的草稿
      const draftToDelete = drafts.find(draft => draft.id === id);
      if (draftToDelete) {
        // 保存到最近删除
        const savedDeleted = localStorage.getItem('recentlyDeleted');
        const existingDeleted = savedDeleted ? JSON.parse(savedDeleted) : [];
        const deletedItem = {
          id: Date.now().toString(),
          title: draftToDelete.title,
          content: draftToDelete.content,
          type: 'draft' as const,
          deletedAt: new Date(),
          originalData: draftToDelete
        };
        const updatedDeleted = [deletedItem, ...existingDeleted];
        localStorage.setItem('recentlyDeleted', JSON.stringify(updatedDeleted));
      }

      // 同步到服务器
      await api.deleteDraft(id);
    } catch (error) {
      console.error('删除草稿失败:', error);
    } finally {
      setDrafts(drafts.filter(draft => draft.id !== id));
    }
  };

  const handlePublishDraft = async (draft: Draft) => {
    // 实现发布草稿到Vault的功能
    try {
      // 创建笔记
      const note = {
        title: draft.title,
        content: draft.content,
        subject: subjects.find(s => s.id === draft.subjectId)?.name || '',
        subjectId: draft.subjectId,
        semester: semesters.find(s => s.id === draft.semesterId)?.name || '',
        tags: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // 同步到服务器
      await api.createNote(note);
      // 删除草稿
      await api.deleteDraft(draft.id);
      // 更新本地状态
      setDrafts(drafts.filter(d => d.id !== draft.id));
      console.log('草稿已发布到保险库');
    } catch (error) {
      console.error('发布草稿失败:', error);
      // 即使失败也删除本地草稿
      setDrafts(drafts.filter(d => d.id !== draft.id));
    }
  };

  // 监听初始学期和科目ID
  useEffect(() => {
    if (initialSemesterId) {
      setSelectedSemester(initialSemesterId);
    }
    if (initialSubjectId) {
      setSelectedSubject(initialSubjectId);
    }
  }, [initialSemesterId, initialSubjectId]);

  // 监听drafts变化，保存到localStorage
  useEffect(() => {
    localStorage.setItem('drafts', JSON.stringify(drafts));
  }, [drafts]);

  const resetForm = () => {
    setDraftTitle('');
    setDraftContent('');
    setSelectedSemester('');
    setSelectedSubject('');
    setEditingDraft(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">草稿</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜索......."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-6">
            <FileEdit size={48} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">还没有草稿。</h2>
          <p className="text-muted-foreground text-center max-w-md">
            保存为草稿的笔记会显示在这里。它们会保持私密状态，直到您将它们发布到您的保险库。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map(draft => {
            const semester = semesters.find(s => s.id === draft.semesterId);
            const subject = subjects.find(s => s.id === draft.subjectId);
            return (
              <Card key={draft.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FileEdit size={16} className="text-green-600" />
                      </div>
                      {subject && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${subject.color}20`, color: subject.color }}>
                          {subject.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
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
                  <h3 className="font-medium text-lg mb-2">{draft.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {draft.content.substring(0, 50)}{draft.content.length > 50 ? '...' : ''}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{draft.createdAt.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 快速添加草稿已禁用 */}
      <Card className="border-dashed opacity-50 cursor-not-allowed">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">草稿创建功能已禁用</p>
            <p className="text-sm text-muted-foreground mt-2">请在Vault界面创建草稿</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftsView;