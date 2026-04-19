import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Link, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ImportComponent = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('document');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [importStatus, setImportStatus] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
      setImportStatus({ status: 'idle', message: '' });
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
    setImportStatus({ status: 'idle', message: '' });
  };

  const handleImport = () => {
    if (activeTab === 'document' && documentFile) {
      // 模拟文档导入
      setTimeout(() => {
        setImportStatus({ status: 'success', message: 'Document imported successfully!' });
        setDocumentFile(null);
      }, 1000);
    } else if (activeTab === 'link' && linkUrl) {
      // 模拟链接导入
      setTimeout(() => {
        setImportStatus({ status: 'success', message: 'Link imported successfully!' });
        setLinkUrl('');
      }, 1000);
    } else {
      setImportStatus({ status: 'error', message: 'Please select a document or enter a link.' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('import') || 'Import'}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Import Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="document">
                <FileText size={16} className="mr-2" />
                Document
              </TabsTrigger>
              <TabsTrigger value="link">
                <Link size={16} className="mr-2" />
                Link
              </TabsTrigger>
            </TabsList>
            <TabsContent value="document" className="mt-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="mb-4">Drag and drop your document here, or click to browse</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <Button onClick={() => document.getElementById('document-upload')?.click()}>
                  Browse Files
                </Button>
                {documentFile && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Selected: {documentFile.name}
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="link" className="mt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="link-url" className="block text-sm font-medium mb-2">
                    Link URL
                  </label>
                  <Input
                    id="link-url"
                    type="url"
                    placeholder="Enter a URL to import"
                    value={linkUrl}
                    onChange={handleLinkChange}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter a URL to import content from the web.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {importStatus.status !== 'idle' && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-md" style={{
              background: importStatus.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${importStatus.status === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: importStatus.status === 'success' ? '#10B981' : '#EF4444'
            }}>
              {importStatus.status === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          <Button 
            className="mt-6 w-full" 
            onClick={handleImport}
            disabled={!((activeTab === 'document' && documentFile) || (activeTab === 'link' && linkUrl))}
          >
            Import
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Imported</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Study Guide.pdf</p>
                  <p className="text-xs text-muted-foreground">Imported 2 hours ago</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Open
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <Link size={20} className="text-primary" />
                <div>
                  <p className="font-medium">React Documentation</p>
                  <p className="text-xs text-muted-foreground">Imported 1 day ago</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Open
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportComponent;