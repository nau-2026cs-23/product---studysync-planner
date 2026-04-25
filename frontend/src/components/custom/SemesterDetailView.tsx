import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileText, Edit, Trash2, BookOpen, ArrowLeft, GraduationCap, Book, Plus, ChevronRight } from 'lucide-react';
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

interface Semester {
  id: string;
  name: string;
  isActive: boolean;
  drafts: number;
  notes: number;
  startDate?: string;
  endDate?: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  notes: number;
  drafts: number;
}

interface Props {
  onNavigate: (view: AppView) => void;
}

const SemesterDetailView = ({ onNavigate }: Props) => {
  const { id: semesterId } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [semester, setSemester] = useState<Semester | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // 模拟获取学期数据
  useEffect(() => {
    // 这里应该从API获取学期数据
    const mockSemesters: Semester[] = [
      { id: '1', name: '2026春季', isActive: true, drafts: 2, notes: 3, startDate: '2026-02-01', endDate: '2026-06-30' },
      { id: '2', name: '2025秋季', isActive: false, drafts: 1, notes: 2, startDate: '2025-09-01', endDate: '2025-12-31' }
    ];
    
    const foundSemester = mockSemesters.find(s => s.id === semesterId);
    if (foundSemester) {
      setSemester(foundSemester);
    }
  }, [semesterId]);

  // 模拟获取学期下的科目数据
  useEffect(() => {
    // 这里应该从API获取科目数据
    const mockSubjects: Subject[] = [
      { id: '1', name: '高数', color: '#4F46E5', notes: 3, drafts: 2 },
      { id: '2', name: '英语', color: '#10B981', notes: 1, drafts: 0 },
      { id: '3', name: '物理', color: '#F59E0B', notes: 0, drafts: 1 }
    ];
    
    // 过滤出属于该学期的科目
    const semesterSubjects = mockSubjects.filter(s => s.id === '1' || s.id === '2' || s.id === '3');
    setSubjects(semesterSubjects);
  }, [semesterId]);

  // 模拟获取笔记数据
  useEffect(() => {
    // 这里应该从API获取笔记数据
    const mockNotes: Note[] = [
      {
        id: '1',
        title: '微积分III - 分部积分法',
        content: '分部积分法是一种用于积分乘积函数的技术...',
        subject: '高数',
        subjectId: '1',
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
        subjectId: '1',
        semester: '2026春季',
        tags: '导数, 应用',
        createdAt: new Date('2026-04-18'),
        updatedAt: new Date('2026-04-18')
      },
      {
        id: '3',
        title: '英语语法',
        content: '英语语法的基本规则...',
        subject: '英语',
        subjectId: '2',
        semester: '2026春季',
        tags: '语法',
        createdAt: new Date('2026-04-15'),
        updatedAt: new Date('2026-04-15')
      }
    ];
    
    setNotes(mockNotes);
  }, []);

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
        subjectId: '1',
        semesterId: semesterId
      },
      {
        id: '2',
        title: '级数收敛性',
        content: '级数收敛性的判断方法...',
        createdAt: new Date('2026-04-21'),
        updatedAt: new Date('2026-04-21'),
        subjectId: '1',
        semesterId: semesterId
      }
    ];
    
    setDrafts(mockDrafts);
  }, [semesterId]);

  const handleBack = () => {
    if (selectedSubject) {
      setSelectedSubject(null);
    } else {
      onNavigate('semesters');
    }
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleEditNote = (note: Note) => {
    // 编辑笔记
    console.log('Editing note:', note.id);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleEditDraft = (draft: Draft) => {
    // 编辑草稿
    console.log('Editing draft:', draft.id);
  };

  const handleDeleteDraft = (draftId: string) => {
    setDrafts(drafts.filter(draft => draft.id !== draftId));
  };

  if (!semesterId || !semester) {
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
          <span>{selectedSubject ? semester?.name : '学期'}</span>
        </button>
        {selectedSubject && (
          <>
            <ChevronRight size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">{selectedSubject.name}</span>
          </>
        )}
      </div>

      {/* 学期或科目标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{selectedSubject ? selectedSubject.name : semester?.name}</h1>
          <p className="text-sm text-muted-foreground">
            {selectedSubject ? `${selectedSubject.notes} 笔记 · ${selectedSubject.drafts} 草稿` : `${notes.length} 笔记 · ${drafts.length} 草稿`}
          </p>
        </div>
        {!selectedSubject && (
          <Button
            onClick={() => window.location.href = `/dashboard/subjects`}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          >
            <Plus size={16} />
            添加课程
          </Button>
        )}
      </div>

      {/* 如果选择了科目，显示科目的笔记和草稿 */}
      {selectedSubject ? (
        <div className="space-y-6">
          {/* 笔记列表 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">该课程下的笔记</h2>
            <div className="space-y-4">
              {notes.filter(n => n.subjectId === selectedSubject.id).length > 0 ? (
                notes.filter(n => n.subjectId === selectedSubject.id).map(note => (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{note.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{note.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
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
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>该课程下暂无笔记</p>
                </div>
              )}
            </div>
          </div>

          {/* 草稿列表 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">该课程下的草稿</h2>
            <div className="space-y-4">
              {drafts.filter(d => d.subjectId === selectedSubject.id).length > 0 ? (
                drafts.filter(d => d.subjectId === selectedSubject.id).map(draft => (
                  <Card key={draft.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{draft.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {draft.content.substring(0, 100)}{draft.content.length > 100 ? '...' : ''}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{draft.updatedAt.toLocaleDateString()}</span>
                          </div>
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
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>该课程下暂无草稿</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 学期下的课程列表 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">课程</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(subject => (
                <Card
                  key={subject.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${subject.color}15` }}
                        >
                          <Book size={20} style={{ color: subject.color }} />
                        </div>
                        <div>
                          <h3 className="font-medium">{subject.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {subject.notes} 笔记 · {subject.drafts} 草稿
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 笔记列表 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">该学期下的所有笔记</h2>
            <div className="space-y-4">
              {notes.length > 0 ? (
                notes.map(note => (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-lg">{note.title}</h3>
                            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#4F46E520', color: '#4F46E5' }}>
                              {note.subject}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{note.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
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
            <h2 className="text-lg font-semibold mb-4">该学期下的所有草稿</h2>
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
                            <span>{draft.updatedAt.toLocaleDateString()}</span>
                          </div>
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
        </>
      )}
    </div>
  );
};

export default SemesterDetailView;