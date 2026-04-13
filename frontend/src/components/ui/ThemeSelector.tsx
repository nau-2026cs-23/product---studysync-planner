import { useTheme, themes } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ThemeSelector = () => {
  const { themeName, setThemeName } = useTheme();
  return (
    <Select value={themeName} onValueChange={setThemeName}>
      <SelectTrigger className="w-[180px] h-9 text-xs">
        <SelectValue placeholder="选择主题" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">默认主题</SelectItem>
        <SelectItem value="light">浅色主题</SelectItem>
        <SelectItem value="dark">深色主题</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ThemeSelector;
