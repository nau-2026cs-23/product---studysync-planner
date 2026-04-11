import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Clock, TrendingUp, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface AISummaryComponentProps {
  className?: string;
}

const AISummaryComponent = ({ className }: AISummaryComponentProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    totalStudyHours: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    efficiencyScore: 0,
  });

  // 模拟获取学习数据和生成AI总结
  const generateSummary = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟学习数据
      const mockMetrics = {
        totalStudyHours: 18.5,
        completedTasks: 12,
        upcomingDeadlines: 3,
        efficiencyScore: 78,
      };

      // 模拟AI生成的总结
      const mockSummary = `
        本周学习总结：
        - 总学习时间：${mockMetrics.totalStudyHours}小时
        - 完成任务数：${mockMetrics.completedTasks}个
        - 即将到来的截止日期：${mockMetrics.upcomingDeadlines}个
        - 学习效率评分：${mockMetrics.efficiencyScore}%

        建议：
        1. 微积分III的学习时间不足，建议增加2小时/周
        2. 有机化学考试临近，建议优先复习
        3. 论文进度良好，但第3章需要加快完成
        4. 周末可以适当放松，保持学习动力
      `;

      setMetrics(mockMetrics);
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

            {/* AI 总结 */}
            <div className="rounded-lg p-4" style={{ background: '#0B0F1A', border: '1px solid #1E2D45' }}>
              <h4 className="text-sm font-semibold mb-2">AI 分析与建议</h4>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">{summary}</pre>
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
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default AISummaryComponent;