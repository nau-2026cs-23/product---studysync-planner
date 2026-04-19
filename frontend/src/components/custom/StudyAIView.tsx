import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, FileText, Brain, BookOpen, Lightbulb, MessageCircle, PenTool, FilePen, Send, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const StudyAIView = () => {
  const { t } = useLanguage();
  const [chatInput, setChatInput] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    { id: 1, title: 'Summarize note', description: 'Requires note', icon: <FileText size={16} /> },
    { id: 2, title: 'Generate flashcards', description: 'Requires note', icon: <Brain size={16} /> },
    { id: 3, title: 'Quiz me', description: 'Requires note', icon: <MessageSquare size={16} /> },
    { id: 4, title: 'Explain concepts', description: 'Requires note', icon: <Lightbulb size={16} /> },
    { id: 5, title: 'Study tips', description: '', icon: <BookOpen size={16} /> },
    { id: 6, title: 'Key takeaways', description: 'Requires note', icon: <MessageCircle size={16} /> },
    { id: 7, title: 'Simplify for me', description: 'Requires note', icon: <PenTool size={16} /> },
    { id: 8, title: 'Essay outline', description: 'Requires note', icon: <FilePen size={16} /> },
  ];

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === '' || !activeChat) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: chatInput,
      role: 'user',
      timestamp: new Date()
    };

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, userMessage],
      title: activeChat.title === 'New Chat' ? chatInput.substring(0, 30) : activeChat.title
    };

    setActiveChat(updatedChat);
    setChats(chats.map(chat => chat.id === activeChat.id ? updatedChat : chat));
    setChatInput('');
    setIsLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: `I understand your question about "${chatInput}". Here's what I can help you with:\n\n1. I can provide detailed explanations\n2. I can help you study more effectively\n3. I can answer specific questions about your notes\n\nHow would you like me to assist you further?`,
        role: 'assistant',
        timestamp: new Date()
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMessage]
      };

      setActiveChat(finalChat);
      setChats(chats.map(chat => chat.id === activeChat.id ? finalChat : chat));
      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteChat = (id: string) => {
    setChats(chats.filter(chat => chat.id !== id));
    if (activeChat?.id === id) {
      setActiveChat(chats.length > 1 ? chats.find(chat => chat.id !== id) || null : null);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (!activeChat) {
      handleNewChat();
    }
    setChatInput(`I want to ${action.title.toLowerCase()}.`);
  };

  return (
    <div className="flex h-full">
      {/* 左侧聊天列表 */}
      <div className="w-64 border-r p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold flex items-center gap-2">
            <Brain size={16} className="text-green-500" />
            Study AI
          </h2>
        </div>
        
        <Button className="bg-green-500 hover:bg-green-600 text-white mb-4" onClick={handleNewChat}>
          + New Chat
        </Button>
        
        <div className="flex-1 space-y-2">
          {chats.length === 0 ? (
            <p className="text-center text-muted-foreground mt-8">
              No chats yet. Start a conversation!
            </p>
          ) : (
            chats.map((chat) => (
              <div 
                key={chat.id}
                className={`p-2 rounded-md cursor-pointer ${activeChat?.id === chat.id ? 'bg-accent' : 'hover:bg-muted'}`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{chat.title}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    className="p-1 hover:bg-accent rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : 'No messages yet'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {chat.createdAt.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 右侧聊天界面 */}
      <div className="flex-1 flex flex-col p-6">
        {activeChat ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{activeChat.title}</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
              {activeChat.messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-lg ${message.role === 'user' ? 'bg-green-100' : 'bg-muted'}`}>
                    <p>{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-lg bg-muted">
                    <p>AI is thinking...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ask anything..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="pr-12"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-accent"
                >
                  <Send size={16} className="text-green-500" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Enter to send • Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Study AI</h1>
              <p className="text-muted-foreground text-center mt-2">
                Ask me anything, attach a note for context, or use a quick action.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {quickActions.map((action) => (
                <Card 
                  key={action.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleQuickAction(action)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        {action.icon}
                      </div>
                      <h3 className="font-medium">{action.title}</h3>
                    </div>
                    {action.description && (
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudyAIView;