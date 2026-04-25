import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Book, FileText, Edit, Trash2, Plus, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AppView } from '@/types';

interface Subject {
  id: string;
  name: string;
  notes: number;
  drafts: number;
  isActive: boolean;
  color: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  subjectId: string;
  semester: string;
  tags: string;
  createdAt: Date;
}

interface Props {
  onNavigate: (view: AppView) => void;
  onNavigateToSubject?: (subjectId: string) => void;
}

const SubjectsView = ({ onNavigate, onNavigateToSubject }: Props) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '高数', notes: 3, drafts: 2, isActive: true, color: '#4F46E5' },
    { id: '2', name: '英语', notes: 1, drafts: 0, isActive: false, color: '#10B981' },
    { id: '3', name: '物理', notes: 0, drafts: 1, isActive: false, color: '#F59E0B' }
  ]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [subjectColor, setSubjectColor] = useState('#4F46E5');

  const handleNewSubject = () => {
    if (subjectName.trim() === '') return;
    
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
      notes: 0,
      drafts: 0,
      isActive: true,
      color: subjectColor
    };

    setSubjects([...subjects, newSubject]);
    resetForm();
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectName(subject.name);
    setSubjectColor(subject.color);
  };

  const handleUpdateSubject = () => {
    if (!editingSubject) return;
    
    const updatedSubjects = subjects.map(subject => 
      subject.id === editingSubject.id 
        ? { ...subject, name: subjectName, color: subjectColor }
        : subject
    );

    setSubjects(updatedSubjects);
    resetForm();
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    // 同时移除该科目下的所有笔记
    setNotes(notes.filter(note => note.subjectId !== id));
  };

  const getSubjectNotes = (subjectId: string) => {
    return notes.filter(note => note.subjectId === subjectId);
  };

  const handleRemoveNoteFromSubject = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, subjectId: '', subject: '' } : note
    ));
  };

  const resetForm = () => {
    setSubjectName('');
    setSubjectColor('#4F46E5');
    setEditingSubject(null);
  };

  const colorOptions = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
            <Book size={16} />
            New Subject
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
          <Book size={14} className="text-green-600" />
        </div>
        <span className="text-sm font-medium">{subjects.length} SUBJECT{subjects.length !== 1 ? 'S' : ''}</span>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <Input
            type="text"
            placeholder="Subject name..."
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex items-center gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => setSubjectColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${subjectColor === color ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            onClick={editingSubject ? handleUpdateSubject : handleNewSubject}
          >
            <Plus size={16} />
            {editingSubject ? 'Update Subject' : 'Add Subject'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => {
          const subjectNotes = getSubjectNotes(subject.id);
          return (
            <Card 
              key={subject.id} 
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                // 跳转到科目详情页面
                window.location.href = `/dashboard/subjects/${subject.id}`;
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${subject.color}15` }}>
                      <Book size={20} style={{ color: subject.color }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{subject.name}</h3>
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <FileText size={14} />
                      <span>{subject.drafts} 草稿 · {subject.notes} 笔记</span>
                    </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('drafts');
                      }}
                      className="p-1 rounded hover:bg-accent"
                      title="添加草稿"
                    >
                      <FileText size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('vault');
                      }}
                      className="p-1 rounded hover:bg-accent"
                      title="添加笔记"
                    >
                      <BookOpen size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSubject(subject);
                      }}
                      className="p-1 rounded hover:bg-accent"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubject(subject.id);
                      }}
                      className="p-1 rounded hover:bg-accent"
                    >
                      <Trash2 size={16} />
                    </button>
                    {subject.isActive && (
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                    )}
                  </div>
                </div>
                
                {subjectNotes.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Notes:</h4>
                    {subjectNotes.map(note => (
                      <div key={note.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm truncate">{note.title}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveNoteFromSubject(note.id);
                          }}
                          className="p-1 rounded hover:bg-accent"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

      </div>
    </div>
  );
};

export default SubjectsView;