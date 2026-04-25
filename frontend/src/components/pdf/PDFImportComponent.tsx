import { useState } from 'react';
import { toast } from 'sonner';
import { FileText, Upload, CheckCircle2, X, Search, Download, Edit3, Eye, FilePen, Brain, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PDFDocument {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  pages: number;
  annotations: number;
  status: 'uploaded' | 'processing' | 'error';
  previewUrl?: string;
}

const SAMPLE_PDFS: PDFDocument[] = [
  {
    id: '1',
    name: 'Calculus III - Chapter 1.pdf',
    size: '2.5 MB',
    uploadDate: '2026-03-15',
    pages: 45,
    annotations: 12,
    status: 'uploaded',
  },
  {
    id: '2',
    name: 'Organic Chemistry - Lab Manual.pdf',
    size: '3.8 MB',
    uploadDate: '2026-03-10',
    pages: 72,
    annotations: 8,
    status: 'uploaded',
  },
  {
    id: '3',
    name: 'Data Structures - Algorithms.pdf',
    size: '1.9 MB',
    uploadDate: '2026-03-05',
    pages: 38,
    annotations: 5,
    status: 'uploaded',
  },
];

export default function PDFImportComponent() {
  const { t } = useLanguage();
  const [pdfs, setPdfs] = useState<PDFDocument[]>(SAMPLE_PDFS);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PDFDocument | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showAnnotateModal, setShowAnnotateModal] = useState(false);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }

  async function handleFiles(files: File[]) {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      toast.error(t('pleaseSelectPdfFiles'));
      return;
    }

    setUploading(true);
    // Simulate upload process
    for (const file of pdfFiles) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPdf: PDFDocument = {
        id: Date.now().toString(),
        name: file.name,
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        pages: Math.floor(Math.random() * 50) + 20,
        annotations: 0,
        status: 'uploaded',
      };
      setPdfs(prev => [newPdf, ...prev]);
    }
    setUploading(false);
    setShowUploadModal(false);
    toast.success(t('pdfsUploadedSuccessfully', { count: pdfFiles.length }));
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function handleDelete(id: string) {
    setPdfs(prev => prev.filter(pdf => pdf.id !== id));
    toast.success(t('pdfDeleted'));
  }

  function handleDownload(id: string) {
    toast.success(t('downloadingPdf', { name: pdfs.find(pdf => pdf.id === id)?.name }));
  }

  function handlePreview(id: string) {
    const pdf = pdfs.find(pdf => pdf.id === id);
    if (pdf) {
      setSelectedPdf(pdf);
      setShowPreviewModal(true);
    }
  }

  function handleConvertToNotes(id: string) {
    const pdf = pdfs.find(pdf => pdf.id === id);
    if (pdf) {
      setSelectedPdf(pdf);
      setShowConvertModal(true);
    }
  }

  function handleAnnotate(id: string) {
    const pdf = pdfs.find(pdf => pdf.id === id);
    if (pdf) {
      setSelectedPdf(pdf);
      setShowAnnotateModal(true);
    }
  }

  const filteredPdfs = pdfs.filter(pdf =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('pdfImport')}</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>{t('pdfImportDescription')}</p>
      </div>

      {/* Search and Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#64748B' }} />
          <input
            type="text"
            placeholder={t('searchPdfs')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{ background: '#131929', border: '1px solid #1E2D45', color: '#F1F5F9' }}
          />
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: '#4F46E5', color: 'white' }}
        >
          <Upload size={16} />
          {t('uploadPdf')}
        </button>
      </div>

      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl p-8 mb-6 text-center transition-all ${isDragging ? 'border-2 border-dashed border-blue-500 bg-blue-500/10' : 'border border-gray-700'}`}
        style={{ border: isDragging ? '2px dashed #4F46E5' : '1px solid #1E2D45', background: isDragging ? 'rgba(79, 70, 229, 0.1)' : '#131929' }}
      >
        <FileText size={40} style={{ color: isDragging ? '#4F46E5' : '#64748B' }} className="mx-auto mb-3" />
        <h3 className="font-semibold mb-1">{t('dragAndDropPdfs')}</h3>
        <p className="text-sm mb-4" style={{ color: '#64748B' }}>{t('orClickToBrowse')}</p>
        <label
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
          style={{ background: '#1E2D45', color: '#F1F5F9' }}
        >
          <Upload size={16} />
          {t('browseFiles')}
          <input
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
      </div>

      {/* PDF List */}
      <div className="rounded-2xl" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #1E2D45' }}>
          <h2 className="font-semibold flex items-center gap-2">
            <FileText size={18} color="#4F46E5" />
            {t('yourPdfDocuments', { count: filteredPdfs.length })}
          </h2>
        </div>
        {filteredPdfs.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={40} color="#1E2D45" className="mx-auto mb-3" />
            <p style={{ color: '#64748B' }}>{t('noPdfDocumentsYet')}</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#4F46E5', color: 'white' }}
            >
              {t('uploadYourFirstPdf')}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredPdfs.map(pdf => (
              <div key={pdf.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#4F46E5/20', border: '1px solid #4F46E5/30' }}>
                    <FileText size={20} color="#4F46E5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{pdf.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs" style={{ color: '#64748B' }}>{pdf.size}</span>
                      <span className="text-xs" style={{ color: '#64748B' }}>{pdf.pages} {t('pages')}</span>
                      <span className="text-xs" style={{ color: '#64748B' }}>{pdf.annotations} {t('annotations')}</span>
                      <span className="text-xs" style={{ color: '#64748B' }}>{pdf.uploadDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePreview(pdf.id)}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: '#64748B' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#4F46E5')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                    title="预览"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleConvertToNotes(pdf.id)}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: '#64748B' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#10B981')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                    title="转换为笔记"
                  >
                    <Brain size={16} />
                  </button>
                  <button
                    onClick={() => handleAnnotate(pdf.id)}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: '#64748B' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F59E0B')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                    title="标注"
                  >
                    <FilePen size={16} />
                  </button>
                  <button
                    onClick={() => handleDownload(pdf.id)}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: '#64748B' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#10B981')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                    title="下载"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(pdf.id)}
                    className="p-2 rounded-lg transition-all"
                    style={{ color: '#64748B' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                    title="删除"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">{t('uploadPdf')}</h3>
              <button onClick={() => setShowUploadModal(false)} disabled={uploading}>
                <X size={20} color="#64748B" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl p-6 text-center" style={{ background: '#1E2D45' }}>
                <FileText size={32} style={{ color: '#4F46E5' }} className="mx-auto mb-3" />
                <h4 className="font-medium mb-1">{t('selectPdfFiles')}</h4>
                <p className="text-sm mb-4" style={{ color: '#64748B' }}>{t('pdfFileSizeLimit')}</p>
                <label
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
                  style={{ background: '#4F46E5', color: 'white' }}
                >
                  <Upload size={16} />
                  {t('browseFiles')}
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
              {uploading && (
                <div className="rounded-xl p-4" style={{ background: '#1E2D45' }}>
                  <div className="w-full h-2 rounded-full bg-gray-700 mb-2">
                    <div className="h-2 rounded-full bg-blue-500 animate-pulse" style={{ width: '75%' }} />
                  </div>
                  <p className="text-sm text-center" style={{ color: '#64748B' }}>{t('uploadingPdfs')}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B', opacity: uploading ? 0.7 : 1 }}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPreviewModal && selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-4xl max-h-[80vh] rounded-2xl p-6 overflow-hidden" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">PDF 预览: {selectedPdf.name}</h3>
              <button onClick={() => setShowPreviewModal(false)}>
                <X size={20} color="#64748B" />
              </button>
            </div>
            <div className="w-full h-[60vh] bg-white rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <FileText size={64} color="#4F46E5" className="mx-auto mb-4" />
                <h4 className="font-medium mb-2">PDF 预览功能</h4>
                <p className="text-sm text-gray-500 mb-4">{selectedPdf.name}</p>
                <p className="text-sm text-gray-500">{selectedPdf.pages} 页 | {selectedPdf.size}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Convert to Notes Modal */}
      {showConvertModal && selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">转换为笔记: {selectedPdf.name}</h3>
              <button onClick={() => setShowConvertModal(false)}>
                <X size={20} color="#64748B" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl p-6 text-center" style={{ background: '#1E2D45' }}>
                <Brain size={32} style={{ color: '#10B981' }} className="mx-auto mb-3" />
                <h4 className="font-medium mb-1">AI 笔记生成</h4>
                <p className="text-sm mb-4" style={{ color: '#64748B' }}>将 PDF 内容转换为结构化笔记</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">提取主要内容</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">生成摘要</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">识别关键概念</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">生成闪卡</span>
                    <input type="checkbox" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConvertModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowConvertModal(false);
                  toast.success('PDF 已成功转换为笔记');
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#10B981', color: 'white' }}
              >
                转换
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Annotate Modal */}
      {showAnnotateModal && selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-4xl max-h-[80vh] rounded-2xl p-6 overflow-hidden" style={{ background: '#131929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">标注 PDF: {selectedPdf.name}</h3>
              <button onClick={() => setShowAnnotateModal(false)}>
                <X size={20} color="#64748B" />
              </button>
            </div>
            <div className="flex h-[60vh] gap-4">
              {/* 标注工具 */}
              <div className="w-16 flex flex-col items-center gap-4 p-2 rounded-lg" style={{ background: '#1E2D45' }}>
                <button className="p-2 rounded-lg bg-blue-500 text-white" title="高亮">
                  <Tag size={16} />
                </button>
                <button className="p-2 rounded-lg" style={{ color: '#64748B' }} title="下划线">
                  <Edit3 size={16} />
                </button>
                <button className="p-2 rounded-lg" style={{ color: '#64748B' }} title="笔记">
                  <FileText size={16} />
                </button>
                <button className="p-2 rounded-lg" style={{ color: '#64748B' }} title="橡皮擦">
                  <X size={16} />
                </button>
              </div>
              {/* PDF 内容 */}
              <div className="flex-1 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <FilePen size={64} color="#F59E0B" className="mx-auto mb-4" />
                  <h4 className="font-medium mb-2">PDF 标注功能</h4>
                  <p className="text-sm text-gray-500 mb-4">{selectedPdf.name}</p>
                  <p className="text-sm text-gray-500">使用左侧工具进行标注</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAnnotateModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ border: '1px solid #1E2D45', color: '#64748B' }}
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowAnnotateModal(false);
                  toast.success('PDF 标注已保存');
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: '#F59E0B', color: 'white' }}
              >
                保存标注
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
