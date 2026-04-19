import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TemplatesView = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const templates = [
    { id: 1, title: '讲义', description: '讲座或课堂的结构化笔记' },
    { id: 2, title: '学习计划', description: '规划你的学习时间和目标' },
    { id: 3, title: '书籍简介', description: '总结书中的关键要点' },
    { id: 4, title: '会议纪要', description: '跟踪决策和行动项目' },
    { id: 5, title: '抽认卡准备', description: '在把概念整理成卡片前先整理好它们' },
    { id: 6, title: '实验报告', description: '记录科学实验和结果' },
    { id: 7, title: '头脑风暴计划', description: '新项目的初步构思与范围' },
    { id: 8, title: '语言学习', description: '跟踪新的词汇和语法规则' },
    { id: 9, title: '主动回忆会话', description: '在某个特定主题上自我测试' },
  ];

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('templates') || '模板'}</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('searchTemplates') || '搜索模板......'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Plus size={16} className="mr-2" />
            {t('newTemplate') || '新模板'}
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
              <BookOpen size={14} className="text-green-600" />
            </div>
            <span className="text-sm font-medium">0 模板</span>
          </div>

          <h2 className="text-lg font-semibold mb-4">{t('startWithTemplate') || '用一个入门模板开始：'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <BookOpen size={14} className="text-green-600" />
                      </div>
                      <h3 className="font-medium">{template.title}</h3>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Plus size={14} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatesView;