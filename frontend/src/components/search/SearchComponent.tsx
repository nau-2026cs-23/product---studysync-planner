import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileText, FileEdit, BookOpen, GraduationCap, Tag, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AppView } from '@/types';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'draft' | 'course' | 'semester' | 'flashcard' | 'tag';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  subject?: string;
  semester?: string;
}

interface Props {
  onNavigate: (view: AppView) => void;
  notes?: any[];
  drafts?: any[];
  courses?: any[];
  semesters?: any[];
  flashcards?: any[];
  tags?: any[];
}

const SearchComponent = ({ 
  onNavigate, 
  notes = [], 
  drafts = [], 
  courses = [], 
  semesters = [], 
  flashcards = [], 
  tags = [] 
}: Props) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  // 整合所有数据进行搜索
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results: SearchResult[] = [];
    const term = searchTerm.toLowerCase();

    // 搜索笔记
    notes.forEach(note => {
      const titleMatch = note.title.toLowerCase().includes(term);
      const contentMatch = note.content.toLowerCase().includes(term);
      const tagMatch = note.tags && note.tags.toLowerCase().includes(term);
      const subjectMatch = note.subject && note.subject.toLowerCase().includes(term);

      if (titleMatch || contentMatch || tagMatch || subjectMatch) {
        results.push({
          id: note.id,
          title: note.title,
          content: note.content,
          type: 'note',
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt || note.createdAt),
          tags: note.tags ? [note.tags] : undefined,
          subject: note.subject,
          semester: note.semester
        });
      }
    });

    // 搜索草稿
    drafts.forEach(draft => {
      const titleMatch = draft.title.toLowerCase().includes(term);
      const contentMatch = draft.content.toLowerCase().includes(term);

      if (titleMatch || contentMatch) {
        results.push({
          id: draft.id,
          title: draft.title,
          content: draft.content,
          type: 'draft',
          createdAt: new Date(draft.createdAt),
          updatedAt: new Date(draft.updatedAt)
        });
      }
    });

    // 搜索课程
    courses.forEach(course => {
      const nameMatch = course.name.toLowerCase().includes(term);
      const codeMatch = course.code.toLowerCase().includes(term);

      if (nameMatch || codeMatch) {
        results.push({
          id: course.id,
          title: course.name,
          content: course.code,
          type: 'course',
          createdAt: new Date(course.createdAt),
          updatedAt: new Date(course.createdAt)
        });
      }
    });

    // 搜索学期
    semesters.forEach(semester => {
      const nameMatch = semester.name.toLowerCase().includes(term);

      if (nameMatch) {
        results.push({
          id: semester.id,
          title: semester.name,
          content: semester.isActive ? '活跃' : '非活跃',
          type: 'semester',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    // 搜索闪卡
    flashcards.forEach(card => {
      const frontMatch = card.front.toLowerCase().includes(term);
      const backMatch = card.back.toLowerCase().includes(term);
      const tagMatch = card.tags.some((tag: string) => tag.toLowerCase().includes(term));

      if (frontMatch || backMatch || tagMatch) {
        results.push({
          id: card.id,
          title: card.front.substring(0, 50),
          content: card.back.substring(0, 100),
          type: 'flashcard',
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt || card.createdAt),
          tags: card.tags
        });
      }
    });

    // 搜索标签
    tags.forEach(tag => {
      const nameMatch = tag.name.toLowerCase().includes(term);

      if (nameMatch) {
        results.push({
          id: tag.id,
          title: tag.name,
          content: `使用次数: ${tag.count || 0}`,
          type: 'tag',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    // 按相关性和更新时间排序
    return results.sort((a, b) => {
      // 先按类型排序（笔记和草稿优先）
      const typePriority = {
        note: 0,
        draft: 1,
        flashcard: 2,
        tag: 3,
        course: 4,
        semester: 5
      };

      if (typePriority[a.type] !== typePriority[b.type]) {
        return typePriority[a.type] - typePriority[b.type];
      }

      // 然后按更新时间排序（最新的优先）
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [searchTerm, notes, drafts, courses, semesters, flashcards, tags]);

  // 高亮搜索关键词
  const highlightKeyword = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark className="bg-yellow-200">$1</mark>');
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'note':
        return <FileText size={16} className="text-blue-500" />;
      case 'draft':
        return <FileEdit size={16} className="text-orange-500" />;
      case 'course':
        return <BookOpen size={16} className="text-green-500" />;
      case 'semester':
        return <GraduationCap size={16} className="text-purple-500" />;
      case 'flashcard':
        return <Tag size={16} className="text-pink-500" />;
      case 'tag':
        return <Tag size={16} className="text-gray-500" />;
      default:
        return <Search size={16} className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'note':
        return '笔记';
      case 'draft':
        return '草稿';
      case 'course':
        return '课程';
      case 'semester':
        return '学期';
      case 'flashcard':
        return '闪卡';
      case 'tag':
        return '标签';
      default:
        return '其他';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="搜索所有内容..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10 w-full md:w-80 lg:w-96"
        />
      </div>

      {showResults && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              没有找到相关结果
            </div>
          ) : (
            searchResults.map((result) => (
              <div
                key={result.id}
                className="p-4 hover:bg-accent cursor-pointer border-b last:border-b-0"
                onClick={() => {
                  setShowResults(false);
                  // 根据类型导航到相应页面
                  switch (result.type) {
                    case 'note':
                    case 'draft':
                      onNavigate('vault');
                      break;
                    case 'course':
                      onNavigate('subjects');
                      break;
                    case 'semester':
                      onNavigate('semesters');
                      break;
                    case 'flashcard':
                      onNavigate('flashcards');
                      break;
                    case 'tag':
                      onNavigate('tags');
                      break;
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium" dangerouslySetInnerHTML={{ __html: highlightKeyword(result.title) }} />
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: highlightKeyword(result.content) }} />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>{result.updatedAt.toLocaleDateString()}</span>
                      {result.subject && (
                        <span className="bg-blue-100 px-2 py-0.5 rounded">{result.subject}</span>
                      )}
                      {result.tags && result.tags.length > 0 && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{result.tags[0]}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;