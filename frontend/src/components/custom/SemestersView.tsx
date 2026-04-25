import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, FileEdit, Edit, Trash2, Plus, CheckCircle2, X, Calendar as CalendarIcon, FileText, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AppView } from '@/types';

interface Semester {
  id: string;
  name: string;
  isActive: boolean;
  drafts: number;
  notes: number;
  startDate?: string;
  endDate?: string;
}

interface Props {
  onNavigate: (view: AppView) => void;
}

const SemestersView = ({ onNavigate }: Props) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: '2026春季', isActive: true, drafts: 2, notes: 3 }
  ]);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [semesterName, setSemesterName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleNewSemester = () => {
    if (semesterName.trim() === '') return;
    
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: semesterName,
      isActive: false,
      drafts: 0,
      notes: 0,
      startDate,
      endDate
    };

    setSemesters([...semesters, newSemester]);
    resetForm();
  };

  const handleEditSemester = (semester: Semester) => {
    setEditingSemester(semester);
    setSemesterName(semester.name);
    setStartDate(semester.startDate || '');
    setEndDate(semester.endDate || '');
    setIsActive(semester.isActive);
    setShowEditModal(true);
  };

  const handleUpdateSemester = () => {
    if (!editingSemester) return;
    
    const updatedSemesters = semesters.map(semester => 
      semester.id === editingSemester.id 
        ? { 
            ...semester, 
            name: semesterName,
            startDate,
            endDate,
            isActive
          }
        : isActive ? { ...semester, isActive: false } : semester
    );

    setSemesters(updatedSemesters);
    setShowEditModal(false);
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
    setStartDate('');
    setEndDate('');
    setIsActive(false);
    setEditingSemester(null);
    setShowEditModal(false);
  };

  const activeSemester = semesters.find(semester => semester.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">学期</h1>
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
          <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
            <Calendar size={16} />
            新学期
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
          <Calendar size={14} className="text-green-600" />
        </div>
        <span className="text-sm font-medium">{semesters.length} 学期</span>
        {activeSemester && (
          <div className="h-6 rounded-full bg-green-100 flex items-center justify-center px-3">
            <span className="text-sm font-medium text-green-600">活跃 {activeSemester.name}</span>
          </div>
        )}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <Input
            type="text"
            placeholder="学期名称..."
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
            className="mb-4"
          />
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            onClick={editingSemester ? handleUpdateSemester : handleNewSemester}
          >
            <Plus size={16} />
            {editingSemester ? '更新学期' : '添加学期'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {semesters.map((semester) => (
          <Card 
            key={semester.id} 
            className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              // 跳转到学期详情页面
              window.location.href = `/dashboard/semesters/${semester.id}`;
            }}
          >
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
                        <span className="text-xs font-medium bg-green-100 text-green-600 px-2 py-0.5 rounded-full">活跃</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <FileEdit size={14} />
                      <span>{semester.drafts} 草稿 · {semester.notes} 笔记</span>
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
                      handleEditSemester(semester);
                    }}
                    className="p-1 rounded hover:bg-accent"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSemester(semester.id);
                    }}
                    className="p-1 rounded hover:bg-accent"
                  >
                    <Trash2 size={16} />
                  </button>
                  {!semester.isActive && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetActiveSemester(semester.id);
                      }}
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

      {/* 编辑学期模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">编辑学期</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">名称 *</label>
                <Input
                  type="text"
                  value={semesterName}
                  onChange={(e) => setSemesterName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">开始日期</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-8"
                    />
                    <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">结束日期</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-8"
                    />
                    <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="active" className="text-sm font-medium">设为活跃学期</label>
              </div>
              <p className="text-xs text-muted-foreground">这将停用当前活跃的学期。</p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={handleUpdateSemester}
              >
                保存更改
              </Button>
              <Button 
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={() => setShowEditModal(false)}
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemestersView;