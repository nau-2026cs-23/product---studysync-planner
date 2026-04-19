import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileEdit, Edit, Trash2, Send, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Draft {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const DraftsView = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');

  const handleAddDraft = () => {
    if (draftTitle.trim() === '') return;
    
    const newDraft: Draft = {
      id: Date.now().toString(),
      title: draftTitle,
      content: draftContent,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setDrafts([...drafts, newDraft]);
    resetForm();
  };

  const handleEditDraft = (draft: Draft) => {
    setEditingDraft(draft);
    setDraftTitle(draft.title);
    setDraftContent(draft.content);
  };

  const handleUpdateDraft = () => {
    if (!editingDraft) return;
    
    const updatedDrafts = drafts.map(draft => 
      draft.id === editingDraft.id 
        ? { ...draft, title: draftTitle, content: draftContent, updatedAt: new Date() }
        : draft
    );

    setDrafts(updatedDrafts);
    resetForm();
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(drafts.filter(draft => draft.id !== id));
  };

  const handlePublishDraft = (draft: Draft) => {
    // 实现发布草稿到Vault的功能
    console.log('Publishing draft:', draft);
    // 发布后删除草稿
    setDrafts(drafts.filter(d => d.id !== draft.id));
  };

  const resetForm = () => {
    setDraftTitle('');
    setDraftContent('');
    setEditingDraft(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Drafts</h1>
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
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <Input
            type="text"
            placeholder="Draft title..."
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            className="mb-4 text-lg"
          />
          <textarea
            placeholder="Write your draft here..."
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            className="w-full border rounded-md p-3 min-h-[200px] mb-4"
          />
          <div className="flex items-center gap-4">
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              onClick={editingDraft ? handleUpdateDraft : handleAddDraft}
            >
              <Plus size={16} />
              {editingDraft ? 'Update Draft' : 'Add Draft'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-6">
            <FileEdit size={48} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No drafts yet.</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Notes saved as drafts will appear here. They stay private until you publish them to your vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drafts.map(draft => (
            <Card key={draft.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-lg truncate">{draft.title}</h3>
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
                    <button 
                      onClick={() => handlePublishDraft(draft)}
                      className="p-1 rounded hover:bg-accent"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {draft.content.substring(0, 150)}{draft.content.length > 150 ? '...' : ''}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created: {draft.createdAt.toLocaleString()}</span>
                  <span>Updated: {draft.updatedAt.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftsView;