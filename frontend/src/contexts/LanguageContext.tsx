import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译文件
const translations = {
  en: {
    // Navigation
    features: 'Features',
    schedule: 'Schedule',
    analytics: 'Analytics',
    integrations: 'Integrations',
    login: 'Login',
    signUp: 'Sign Up',
    startFree: 'Start Free',
    
    // Hero section
    heroTitle: 'Say Goodbye to Last-Minute Cramming Start Mastering Your Studies',
    heroDescription: 'StudySync syncs your Canvas and Blackboard deadlines, builds AI-optimized study plans, and tracks your progress — letting you focus on learning, not logistics.',
    
    // Features section
    featuresTitle: 'Complete Toolkit to Excel in Your Semester',
    featuresSubtitle: 'Core Features',
    smartPlanningEngine: 'Smart Planning Engine',
    smartPlanningDescription: 'Drag and drop study sessions around your class schedule. When exam dates change, AI automatically adjusts your plan — no manual rescheduling needed.',
    gpaPredictor: 'GPA Predictor',
    gpaPredictorDescription: 'Forecast your semester GPA based on recorded study time. Adjust your effort early, before it\'s too late.',
    progressHeatmap: 'Progress Heatmap',
    progressHeatmapDescription: 'Visualize your workload distribution across the semester. Spot burnout risks before they happen.',
    collaborationHub: 'Collaboration Hub',
    collaborationHubDescription: 'Shared task boards for group projects with @ mention notifications. Real-time updates keep the team aligned on responsibilities and deadlines.',
    weeklyReports: 'Weekly Reports',
    weeklyReportsDescription: 'Compare planned vs. actual study time. Identify time management gaps and adjust early.',
    
    // Schedule section
    scheduleTitle: 'Your Week, Intelligently Planned.',
    scheduleDescription: 'StudySync analyzes your course difficulty, energy patterns, and existing commitments to recommend optimal study times. Drag and drop to finalize — AI handles the rest.',
    autoSync: 'Auto-sync Canvas and Blackboard',
    autoSyncDescription: 'All deadlines automatically centralized — no manual entry needed.',
    dynamicRescheduling: 'Dynamic rescheduling when exams change',
    dynamicReschedulingDescription: 'Professor changes a midterm date? Your plan updates instantly.',
    exportToGoogleCalendar: 'Export to Google Calendar',
    exportToGoogleCalendarDescription: 'Seamlessly view academic deadlines alongside personal events.',
    thisWeek: 'This Week — March 14-20',
    calculusStudySession: 'Calculus III — Study Session',
    organicChemistryReview: 'Organic Chemistry — Review',
    paperDraft: 'Paper — Chapter 3 Draft',
    groupProject: 'Group Project — Data Analysis',
    viewSchedule: 'View Schedule',
    openSchedule: 'Open Schedule',
    
    // Analytics section
    analyticsTitle: 'Data-Driven Insights for Every Student',
    studyTimeThisWeek: 'Study Time This Week',
    vsPlanned: 'vs. Planned 21h',
    deadlinesThisMonth: 'Deadlines This Month',
    organicChemistryMidterm: 'Organic Chemistry Midterm',
    paperChapterDraft: 'Paper Chapter 3 Draft',
    computerScienceProject: 'Computer Science Project Submission',
    paperProgress: 'Paper Progress',
    pagesDrafted: '42/62 pages drafted',
    
    // Integrations section
    integrationsTitle: 'Seamlessly Connect with Tools You Already Use',
    integrationsDescription: 'StudySync bi-directionally integrates with your university LMS and personal calendar — ensuring your academic life is always in sync.',
    canvasLMS: 'Canvas LMS',
    canvasLMSDescription: 'Auto-sync assignments, quizzes, and exam dates',
    blackboard: 'Blackboard',
    blackboardDescription: 'Pull course materials and deadline notifications',
    googleCalendar: 'Google Calendar',
    googleCalendarDescription: 'Export study sessions alongside personal events',
    advisorDashboard: 'Advisor Dashboard',
    advisorDashboardDescription: 'Advisors monitor at-risk students through LMS data',
    
    // CTA section
    ctaTitle: 'Your Best Semester Starts Here.',
    ctaDescription: 'Join thousands of students who have eliminated last-minute cramming and missed deadlines with StudySync.',
    ctaSubtitle: 'Free for students · Includes Canvas and Blackboard sync · No credit card required',
    startStudysync: 'Start StudySync for Free',
    
    // Footer
    footerDescription: 'AI-powered learning planning tool for modern students. Supports Canvas, Blackboard, and more.',
    product: 'Product',
    forStudents: 'For Students',
    company: 'Company',
    pricing: 'Pricing',
    changelog: 'Changelog',
    undergraduates: 'Undergraduates',
    graduates: 'Graduates',
    academicAdvisors: 'Academic Advisors',
    universities: 'Universities',
    aboutUs: 'About Us',
    blog: 'Blog',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    copyright: '© 2026 StudySync. Developed by Zhang BINGsi. All rights reserved.',
    designedFor: 'Designed for students who refuse to settle for average.',
    
    // App shell
    backToLanding: 'Back to Landing',
    dashboard: 'Dashboard',
    collab: 'Collab',
    gpa: 'GPA',
    
    // Theme selector
    selectTheme: 'Select Theme',
    selectLanguage: 'Select Language',
    defaultTheme: 'Default Theme',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
  },
  zh: {
    // 导航
    features: '功能',
    schedule: '日程',
    analytics: '分析',
    integrations: '集成',
    login: '登录',
    signUp: '注册',
    startFree: '免费开始',
    
    // 英雄区
    heroTitle: '告别临时抱佛脚，开始掌握你的学习',
    heroDescription: 'StudySync 同步你的 Canvas 和 Blackboard 截止日期，构建 AI 优化的学习计划，并跟踪你的进度 — 让你专注于学习，而非后勤工作。',
    
    // 功能区
    featuresTitle: '助您在学期中脱颖而出的全套工具',
    featuresSubtitle: '核心功能',
    smartPlanningEngine: '智能规划引擎',
    smartPlanningDescription: '围绕您的课程表拖放学习时段。当考试日期变更时，AI 会自动调整您的计划 — 无需手动重新安排。',
    gpaPredictor: 'GPA 预测器',
    gpaPredictorDescription: '根据记录的学习时间预测您的学期 GPA。及时调整努力程度，避免为时已晚。',
    progressHeatmap: '进度热图',
    progressHeatmapDescription: '可视化您整个学期的工作量分布。在倦怠风险发生前发现它们。',
    collaborationHub: '协作中心',
    collaborationHubDescription: '用于小组项目的共享任务板，带有 @ 提及通知。实时更新确保团队在责任和截止日期上保持一致。',
    weeklyReports: '周报告',
    weeklyReportsDescription: '比较计划与实际学习时间。识别时间管理差距并及早调整。',
    
    // 日程区
    scheduleTitle: '您的一周，智能规划。',
    scheduleDescription: 'StudySync 分析您的课程难度、能量模式和现有承诺，推荐最佳学习时段。拖放即可完成 — AI 处理其余部分。',
    autoSync: '自动同步 Canvas 和 Blackboard',
    autoSyncDescription: '所有截止日期自动集中管理 — 无需手动输入。',
    dynamicRescheduling: '考试变更时动态重新安排',
    dynamicReschedulingDescription: '教授更改期中考试时间？您的计划立即更新。',
    exportToGoogleCalendar: '导出到 Google 日历',
    exportToGoogleCalendarDescription: '无缝查看学术截止日期和个人事件。',
    thisWeek: '本周 — 3月14日至20日',
    calculusStudySession: '微积分 III — 学习时段',
    organicChemistryReview: '有机化学 — 复习',
    paperDraft: '论文 — 第3章草稿',
    groupProject: '小组项目 — 数据分析',
    viewSchedule: '查看日程',
    openSchedule: '打开日程',
    
    // 分析区
    analyticsTitle: '数据驱动的洞察为每位学生',
    studyTimeThisWeek: '本周学习时间',
    vsPlanned: 'vs. 计划 21小时',
    deadlinesThisMonth: '本月截止日期',
    organicChemistryMidterm: '有机化学期中考试',
    paperChapterDraft: '论文第3章草稿',
    computerScienceProject: '计算机科学项目提交',
    paperProgress: '论文进度',
    pagesDrafted: '已起草 42/62 页',
    
    // 集成区
    integrationsTitle: '与您已使用的工具无缝连接',
    integrationsDescription: 'StudySync 与您的大学 LMS 和个人日历双向集成 — 确保您的学术生活始终保持同步。',
    canvasLMS: 'Canvas LMS',
    canvasLMSDescription: '自动同步作业、测验和考试日期',
    blackboard: 'Blackboard',
    blackboardDescription: '拉取课程材料和截止日期通知',
    googleCalendar: 'Google 日历',
    googleCalendarDescription: '导出学习时段与个人事件一起',
    advisorDashboard: '顾问仪表板',
    advisorDashboardDescription: '顾问通过 LMS 数据监控有风险的学生',
    
    // CTA 区
    ctaTitle: '您的最佳学期从这里开始。',
    ctaDescription: '加入成千上万的学生，他们已经使用 StudySync 消除了临时抱佛脚和错过截止日期的问题。',
    ctaSubtitle: '学生免费使用 · 包含 Canvas 和 Blackboard 同步 · 无需信用卡',
    startStudysync: '免费启动 StudySync',
    
    // 页脚
    footerDescription: '为现代学生打造的 AI 驱动学习规划工具。支持 Canvas、Blackboard 等平台。',
    product: '产品',
    forStudents: '面向学生',
    company: '公司',
    pricing: '定价',
    changelog: '更新日志',
    undergraduates: '本科生',
    graduates: '研究生',
    academicAdvisors: '学术顾问',
    universities: '大学',
    aboutUs: '关于我们',
    blog: '博客',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
    copyright: '© 2026 StudySync. 由 Zhang BINGsi 开发。保留所有权利。',
    designedFor: '为拒绝平庸的学生设计。',
    
    // 应用外壳
    backToLanding: '返回首页',
    dashboard: '仪表板',
    collab: '协作',
    gpa: 'GPA',
    
    // 主题选择器
    selectTheme: '选择主题',
    selectLanguage: '选择语言',
    defaultTheme: '默认主题',
    lightTheme: '浅色主题',
    darkTheme: '深色主题',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('zh'); // 默认中文

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
