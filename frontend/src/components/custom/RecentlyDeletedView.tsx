import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Restore, Search, Calendar, BookOpen, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DeletedItem {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'draft';
  deletedAt: Date;
  originalData: any;
}

const RecentlyDeletedView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>(() => {
    const saved = localStorage.getItem('recentlyDeleted');
    return saved ? JSON.parse(saved).map((item: any) => ({
      ...item,
      deletedAt: new Date(item.deletedAt)
    })) : [];
  });

  // 保存到localStorage
  useEffect(() => {
    localStorage.setItem('recentlyDeleted', JSON.stringify(deletedItems));
  }, [deletedItems]);

  const handleRestore = (item: DeletedItem) => {
    // 恢复到对应的位置
    if (item.type === 'note') {
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      notes.push(item.originalData);
      localStorage.setItem('notes', JSON.stringify(notes));
    } else if (item.type === 'draft') {
      const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');
      drafts.push(item.originalData);
      localStorage.setItem('drafts', JSON.stringify(drafts));
    }

    // 从最近删除中移除
    setDeletedItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handlePermanentDelete = (id: string) => {
    setDeletedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteAll = () => {
    if (confirm('确定要永久删除所有项目吗？')) {
      setDeletedItems([]);
    }
  };

  const filteredItems = deletedItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">最近删除</h1>
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
          {deletedItems.length > 0 && (
            <Button 
              variant="destructive"
              onClick={handleDeleteAll}
            >
              清空
            </Button>
          )}
        </div>
      </div>

      {deletedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <Trash2 size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">最近没有删除的项目</h2>
          <p className="text-muted-foreground text-center max-w-md">
            已删除的笔记和草稿会显示在这里，可以在30天内恢复它们。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      {item.type === 'note' ? (
                        <BookOpen size={16} className="text-red-600" />
                      ) : (
                        <FileText size={16} className="text-red-600" />
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                      {item.type === 'note' ? '笔记' : '草稿'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex items-center gap-1"
                      onClick={() => handleRestore(item)}
                    >
                      <Restore size={14} />
                      恢复
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1"
                      onClick={() => handlePermanentDelete(item.id)}
                    >
                      <Trash2 size={14} />
                      删除
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.content.substring(0, 50)}{item.content.length > 50 ? '...' : ''}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>删除于: {item.deletedAt.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyDeletedView;