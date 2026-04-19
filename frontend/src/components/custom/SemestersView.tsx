import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, FileEdit, Edit, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Semester {
  id: string;
  name: string;
  isActive: boolean;
  drafts: number;
}

const SemestersView = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: '2026春季', isActive: true, drafts: 0 }
  ]);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [semesterName, setSemesterName] = useState('');

  const handleNewSemester = () => {
    if (semesterName.trim() === '') return;
    
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: semesterName,
      isActive: false,
      drafts: 0
    };

    setSemesters([...semesters, newSemester]);
    resetForm();
  };

  const handleEditSemester = (semester: Semester) => {
    setEditingSemester(semester);
    setSemesterName(semester.name);
  };

  const handleUpdateSemester = () => {
    if (!editingSemester) return;
    
    const updatedSemesters = semesters.map(semester => 
      semester.id === editingSemester.id 
        ? { ...semester, name: semesterName }
        : semester
    );

    setSemesters(updatedSemesters);
    resetForm();
  };

  const handleDeleteSemester = (id: string) => {
    setSemesters(semesters.filter(semester => semester.id !== id));
  };

  const handleSetActiveSemester = (id: string) => {
    const updatedSemesters = semesters.map(semester => ({
      ...semester,
      isActive: semester.id === id
    }));
    setSemesters(updatedSemesters);
  };

  const resetForm = () => {
    setSemesterName('');
    setEditingSemester(null);
  };

  const activeSemester = semesters.find(semester => semester.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Semesters</h1>
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
            <Calendar size={16} />
            New Semester
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
          <Calendar size={14} className="text-green-600" />
        </div>
        <span className="text-sm font-medium">{semesters.length} SEMESTER{semesters.length !== 1 ? 'S' : ''}</span>
        {activeSemester && (
          <div className="h-6 rounded-full bg-green-100 flex items-center justify-center px-3">
            <span className="text-sm font-medium text-green-600">ACTIVE {activeSemester.name}</span>
          </div>
        )}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <Input
            type="text"
            placeholder="Semester name..."
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
            className="mb-4"
          />
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            onClick={editingSemester ? handleUpdateSemester : handleNewSemester}
          >
            <Plus size={16} />
            {editingSemester ? 'Update Semester' : 'Add Semester'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {semesters.map((semester) => (
          <Card key={semester.id} className="border rounded-lg overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{semester.name}</h3>
                      {semester.isActive && (
                        <span className="text-xs font-medium bg-green-100 text-green-600 px-2 py-0.5 rounded-full">ACTIVE</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <FileEdit size={14} />
                      <span>{semester.drafts} Drafts</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditSemester(semester)}
                    className="p-1 rounded hover:bg-accent"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteSemester(semester.id)}
                    className="p-1 rounded hover:bg-accent"
                  >
                    <Trash2 size={16} />
                  </button>
                  {!semester.isActive && (
                    <button 
                      onClick={() => handleSetActiveSemester(semester.id)}
                      className="p-1 rounded hover:bg-accent"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SemestersView;