import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const RecentView = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recently Updated</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search recent notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Clock size={48} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No recent notes.</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Notes you create or edit will appear here.
        </p>
      </div>
    </div>
  );
};

export default RecentView;