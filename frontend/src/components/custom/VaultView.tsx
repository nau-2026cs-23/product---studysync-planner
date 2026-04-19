import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileText, Plus, Save, BookOpen, GraduationCap, Tag, Edit, Trash2, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

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

const VaultView = () => {
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

  const handleImportPDF = () => {
    // 实现PDF导入功能
    console.log('Import PDF clicked');
  };

  const handleSaveDraft = () => {
    if (noteTitle.trim() === '' && noteContent.trim() === '') {
      alert('请输入标题或内容');
      return;
    }
    
    const selectedSubject = subjects.find(s => s.id === subjectId);
    
    const draftNote: Note = {
      id: Date.now().toString(),
      title: noteTitle || 'Untitled Draft',
      content: noteContent,
      subject: selectedSubject?.name || '',
      subjectId: subjectId,
      semester,
      tags,
      createdAt: new Date()
    };

    setNotes([...notes, draftNote]);
    alert('草稿保存成功！');
    resetForm();
  };

  const handleAddNote = () => {
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

    setNotes([...notes, newNote]);
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

  const handleUpdateNote = () => {
    if (!editingNote) return;
    
    const selectedSubject = subjects.find(s => s.id === subjectId);
    
    const updatedNotes = notes.map(note => 
      note.id === editingNote.id 
        ? { ...note, title: noteTitle, content: noteContent, subject: selectedSubject?.name || '', subjectId, semester, tags }
        : note
    );

    setNotes(updatedNotes);
    resetForm();
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
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
        <h1 className="text-2xl font-bold">Your Vault</h1>
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
          <Button className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-2">
            <FileText size={16} />
            Import PDF
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
              <h3 className="font-medium">VAULT COUNT</h3>
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
              <h3 className="font-medium">NEW THIS WEEK</h3>
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
              <h3 className="font-medium">VAULT DEPTH</h3>
            </div>
            <p className="text-2xl font-bold">Light</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <Input
            type="text"
            placeholder="Note title..."
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
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full border rounded-md p-3 min-h-[200px]"
            />
          </div>

          <div className="mb-4">
            <details>
              <summary className="flex items-center gap-2 cursor-pointer">
                <BookOpen size={16} />
                <span>Add subject, semester & tags</span>
              </summary>
              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
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
                  <label className="block text-sm font-medium mb-1">Semester</label>
                  <Input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    placeholder="Add semester"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <Input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Add tags"
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
              Save Draft
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              onClick={editingNote ? handleUpdateNote : handleAddNote}
            >
              <Plus size={16} />
              {editingNote ? 'Update Note' : 'Add Note'}
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