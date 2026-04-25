import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileText, Edit, Trash2, Plus, BookOpen, X, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AppView } from '@/types';

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

interface Props {
  onNavigate: (view: AppView) => void;
}

const TemplatesView = ({ onNavigate }: Props) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: '讲义',
      description: '讲座或课堂的结构化笔记',
      content: '# 讲义\n\n## 科目:\n\n## 日期:\n\n## 主题:\n\n### 关键点\n\n### 详细内容\n\n### 问题/后续行动\n\n### 总结',
      createdAt: new Date('2026-04-25'),
      updatedAt: new Date('2026-04-25'),
      usageCount: 12
    },
    {
      id: '2',
      name: '学习计划',
      description: '规划你的学习时间和目标',
      content: '# 学习计划\n\n## 目标:\n\n## 时间安排:\n\n## 学习内容:\n\n## 进度追踪:\n\n## 反思与调整:',
      createdAt: new Date('2026-04-25'),
      updatedAt: new Date('2026-04-25'),
      usageCount: 8
    },
    {
      id: '3',
      name: '书籍简介',
      description: '总结书中的关键要点',
      content: '# 书籍简介\n\n## 书名:\n\n## 作者:\n\n## 主要内容:\n\n## 关键要点:\n\n## 个人感悟:',
      createdAt: new Date('2026-04-25'),
      updatedAt: new Date('2026-04-25'),
      usageCount: 5
    },
    {
      id: '4',
      name: '会议纪要',
      description: '跟踪决策和行动项目',
      content: '# 会议纪要\n\n## 会议主题:\n\n## 日期时间:\n\n## 参会人员:\n\n## 讨论内容:\n\n## 决策事项:\n\n## 行动项目:',
      createdAt: new Date('2026-04-25'),
      updatedAt: new Date('2026-04-25'),
      usageCount: 7
    },
    {
      id: '5',
      name: '抽认卡准备',
      description: '在把概念整理成卡片前先整理好它们',
      content: '# 抽认卡准备\n\n## 主题:\n\n## 概念列表:\n\n1. 概念:\n   定义:\n\n2. 概念:\n   定义:\n\n3. 概念:\n   定义:',
      createdAt: new Date('2026-04-25'),
      updatedAt: new Date('2026-04-25'),
      usageCount: 4
    },
    {
      id: '6',
      name: '实验报告',
      description: '记录科学实验和结果',
      content: '# 实验报告\n\n## 实验名称:\n\n## 日期:\n\n## 目的:\n\n## 材料与方法:\n\n## 结果:\n\n## 分析:\n\n## 结论:',
      createdAt: new Date('2026-04-25'),
      updatedAt: new Date('2026-04-25'),
      usageCount: 3
    },
    {
      id: '7',
      name: '头脑风暴计划',
      description: '新项目的初步构思与范围',
      content: '# 头脑风暴计划\n\n## 项目名称:\n\n## 目标:\n\n## 想法列表:\n\n## 潜在挑战:\n\n## 下一步行动:',
      createdAt: new Date('2026-04-25'),
      updatedAt: new Date('2026-04-25'),
      usageCount: 6
    },
    {
      id: '8',
      name: '语言学习',
      description: '跟踪新的词汇和语法规则',
      content: '# 语言学习\n\n## 日期:\n\n## 新词汇:\n\n1. 单词:\n   意思:\n   用法:\n\n2. 单词:\n   意思:\n   用法:\n\n## 语法规则:\n\n## 练习:',
      createdAt: new Date('2026-04-25'),
      updatedAt: new Date('2026-04-25'),
      usageCount: 9
    },
    {
      id: '9',
      name: '主动回忆会话',
      description: '在某个特定主题上自我测试',
      content: '# 主动回忆会话\n\n## 主题:\n\n## 问题 1:\n   答案:\n\n## 问题 2:\n   答案:\n\n## 问题 3:\n   答案:\n\n## 薄弱环节:',
      createdAt: new Date('2026-04-25'),
      updatedAt: new Date('2026-04-25'),
      usageCount: 2
    }
  ]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleNewTemplate = () => {
    setTemplateName('');
    setTemplateDescription('');
    setTemplateContent('');
    setShowCreateModal(true);
  };

  const handleCreateTemplate = () => {
    if (templateName.trim() === '') return;
    
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      content: templateContent,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };

    setTemplates([...templates, newTemplate]);
    setShowCreateModal(false);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateContent(template.content);
    setShowEditModal(true);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;
    
    const updatedTemplates = templates.map(template => 
      template.id === editingTemplate.id 
        ? { 
            ...template, 
            name: templateName, 
            description: templateDescription, 
            content: templateContent, 
            updatedAt: new Date()
          }
        : template
    );

    setTemplates(updatedTemplates);
    setShowEditModal(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const handleUseTemplate = (template: Template) => {
    // 使用模板创建新笔记
    onNavigate('vault');
    // 这里可以通过props或状态管理将模板内容传递给vault页面
    console.log('Using template:', template.name);
  };

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">模板</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索模板..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            onClick={handleNewTemplate}
          >
            <Plus size={16} />
            新模板
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
          <FileText size={14} className="text-green-600" />
        </div>
        <span className="text-sm font-medium">{templates.length} 模板</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <BookOpen size={12} />
                      <span>{template.usageCount} 个单词</span>
                      <span className="mx-1">·</span>
                      <span>{template.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => handleUseTemplate(template)}
                    className="px-3 py-1 bg-green-100 text-green-600 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                  >
                    使用模板
                  </button>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEditTemplate(template)}
                      className="p-1 rounded hover:bg-accent"
                      title="编辑模板"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-1 rounded hover:bg-accent"
                      title="删除模板"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 创建模板模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">创建模板</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">模板名称 *</label>
                <Input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <Input
                  type="text"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">模板内容</label>
                <textarea
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  className="w-full border rounded-md p-3 min-h-[300px]"
                  placeholder="输入模板内容..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={handleCreateTemplate}
              >
                <Save size={16} />
                保存模板
              </Button>
              <Button 
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={() => setShowCreateModal(false)}
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑模板模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">编辑模板</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">模板名称 *</label>
                <Input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <Input
                  type="text"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">模板内容</label>
                <textarea
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  className="w-full border rounded-md p-3 min-h-[300px]"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={handleUpdateTemplate}
              >
                <Save size={16} />
                存档更改
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

export default TemplatesView;