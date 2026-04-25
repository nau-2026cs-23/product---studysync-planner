import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Clock, TrendingUp, Calendar, AlertCircle, CheckCircle, BarChart3, Brain, Target, Zap, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface AISummaryComponentProps {
  className?: string;
}

interface Metrics {
  totalStudyHours: number;
  completedTasks: number;
  upcomingDeadlines: number;
  efficiencyScore: number;
  averageFocusTime: number;
  subjectDistribution: Record<string, number>;
  weeklyTrend: number[];
}

interface StudyPattern {
  id: string;
  title: string;
  description: string;
  suggestion: string;
  icon: React.ReactNode;
}

const AISummaryComponent = ({ className }: AISummaryComponentProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({
    totalStudyHours: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    efficiencyScore: 0,
    averageFocusTime: 0,
    subjectDistribution: {},
    weeklyTrend: []
  });
  const [studyPatterns, setStudyPatterns] = useState<StudyPattern[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

  // 模拟获取学习数据和生成AI总结
  const generateSummary = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟学习数据
      const mockMetrics: Metrics = {
        totalStudyHours: 18.5,
        completedTasks: 12,
        upcomingDeadlines: 3,
        efficiencyScore: 78,
        averageFocusTime: 45,
        subjectDistribution: {
          '微积分III': 5.5,
          '有机化学': 4.2,
          '英语': 3.8,
          '物理': 2.5,
          '计算机科学': 2.5
        },
        weeklyTrend: [12, 15, 18, 16, 20, 18, 22]
      };

      // 模拟学习模式
      const mockPatterns: StudyPattern[] = [
        {
          id: '1',
          title: '高效学习时段',
          description: '您在上午9-11点和晚上7-9点的学习效率最高',
          suggestion: '建议在这些时段安排重要的学习任务',
          icon: <Zap size={16} />
        },
        {
          id: '2',
          title: '学习习惯',
          description: '您的平均专注时间为45分钟，符合科学学习方法',
          suggestion: '建议继续保持这种学习节奏，适当休息',
          icon: <Target size={16} />
        },
        {
          id: '3',
          title: '科目分布',
          description: '微积分III和有机化学的学习时间占比较高',
          suggestion: '建议平衡各科目学习时间，避免偏科',
          icon: <BarChart3 size={16} />
        }
      ];

      // 模拟AI生成的总结
      const mockSummary = `
        本周学习总结：
        - 总学习时间：${mockMetrics.totalStudyHours}小时
        - 完成任务数：${mockMetrics.completedTasks}个
        - 即将到来的截止日期：${mockMetrics.upcomingDeadlines}个
        - 学习效率评分：${mockMetrics.efficiencyScore}%
        - 平均专注时间：${mockMetrics.averageFocusTime}分钟

        学习趋势：
        - 本周学习时间比上周增加了15%
        - 效率评分比上周提高了8%
        - 完成任务数比上周增加了3个

        建议：
        1. 微积分III的学习时间不足，建议增加2小时/周
        2. 有机化学考试临近，建议优先复习
        3. 论文进度良好，但第3章需要加快完成
        4. 周末可以适当放松，保持学习动力
        5. 建议在上午9-11点安排重要的学习任务
      `;

      setMetrics(mockMetrics);
      setStudyPatterns(mockPatterns);
      setSummary(mockSummary);
    } catch (err) {
      setError('生成总结失败，请重试');
      console.error('生成总结错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件挂载时生成初始总结
  useEffect(() => {
    generateSummary();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // 计算学科分布的颜色
  const getSubjectColor = (index: number) => {
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return colors[index % colors.length];
  };

  return (
    <Card className={`${className}`} style={{ background: '#131929', border: '1px solid #1E2D45' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={18} color="#4F46E5" />
              AI 学习总结
            </CardTitle>
            <CardDescription>基于您的学习数据生成智能分析和建议</CardDescription>
          </div>
          <Button
            onClick={generateSummary}
            disabled={isLoading}
            className="flex items-center gap-2"
            style={{ background: '#4F46E5', color: 'white' }}
          >
            {isLoading ? '生成中...' : '刷新总结'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        ) : summary ? (
          <div className="space-y-6">
            {/* 关键指标 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} color="#4F46E5" />
                  <span className="text-xs font-medium">总学习时间</span>
                </div>
                <div className="text-lg font-bold">{metrics.totalStudyHours}小时</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={14} color="#10B981" />
                  <span className="text-xs font-medium">完成任务</span>
                </div>
                <div className="text-lg font-bold">{metrics.completedTasks}个</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} color="#F59E0B" />
                  <span className="text-xs font-medium">即将截止</span>
                </div>
                <div className="text-lg font-bold">{metrics.upcomingDeadlines}个</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} color="#06B6D4" />
                  <span className="text-xs font-medium">效率评分</span>
                </div>
                <div className="text-lg font-bold">{metrics.efficiencyScore}%</div>
              </div>
            </div>

            {/* 学习趋势 */}
            <div className="rounded-lg p-4" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleSection('trend')}
              >
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 size={16} color="#4F46E5" />
                  学习趋势
                </h4>
                {expandedSection === 'trend' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedSection === 'trend' && (
                <div className="mt-4">
                  <div className="h-40 w-full">
                    {/* 简单的趋势图 */}
                    <div className="flex items-end justify-between h-full">
                      {metrics.weeklyTrend.map((value, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 rounded-t-md" 
                            style={{ 
                              height: `${(value / Math.max(...metrics.weeklyTrend)) * 100}%`,
                              backgroundColor: '#4F46E5',
                              opacity: 0.7 + (index * 0.05)
                            }}
                          />
                          <span className="text-xs mt-1">{['周一', '周二', '周三', '周四', '周五', '周六', '周日'][index]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    <p>本周学习时间呈上升趋势，周末学习时间达到峰值</p>
                  </div>
                </div>
              )}
            </div>

            {/* 学科分布 */}
            <div className="rounded-lg p-4" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleSection('subjects')}
              >
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Brain size={16} color="#10B981" />
                  学科分布
                </h4>
                {expandedSection === 'subjects' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedSection === 'subjects' && (
                <div className="mt-4 space-y-2">
                  {Object.entries(metrics.subjectDistribution).map(([subject, hours], index) => (
                    <div key={subject} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getSubjectColor(index) }}
                      />
                      <span className="text-xs flex-1">{subject}</span>
                      <span className="text-xs font-medium">{hours}小时</span>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full ml-2">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${(hours / metrics.totalStudyHours) * 100}%`,
                            backgroundColor: getSubjectColor(index)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 学习模式 */}
            <div className="rounded-lg p-4" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleSection('patterns')}
              >
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb size={16} color="#F59E0B" />
                  学习模式分析
                </h4>
                {expandedSection === 'patterns' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedSection === 'patterns' && (
                <div className="mt-4 space-y-3">
                  {studyPatterns.map((pattern) => (
                    <div key={pattern.id} className="p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.2)' }}>
                          {pattern.icon}
                        </div>
                        <h5 className="text-xs font-medium">{pattern.title}</h5>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">{pattern.description}</p>
                      <p className="text-xs text-yellow-400">💡 {pattern.suggestion}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI 总结 */}
            <div className="rounded-lg p-4" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => toggleSection('summary')}
              >
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles size={16} color="#06B6D4" />
                  AI 分析与建议
                </h4>
                {expandedSection === 'summary' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedSection === 'summary' && (
                <pre className="mt-4 text-xs text-gray-300 whitespace-pre-wrap">{summary}</pre>
              )}
            </div>

            {/* 行动建议 */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">建议行动</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.3)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(79,70,229,0.2)' }}>
                    <Clock size={12} color="#4F46E5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">增加微积分III的学习时间</p>
                    <p className="text-xs text-gray-400">建议每天增加30分钟学习时间</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(6,182,212,0.2)' }}>
                    <Calendar size={12} color="#06B6D4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">优先复习有机化学</p>
                    <p className="text-xs text-gray-400">考试将在3天后进行</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(16,185,129,0.2)' }}>
                    <Target size={12} color="#10B981" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">提高论文写作效率</p>
                    <p className="text-xs text-gray-400">建议使用番茄工作法，每25分钟休息5分钟</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default AISummaryComponent;