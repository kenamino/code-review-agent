import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
  onSubmit: (code: string, language: string) => Promise<void>;
  isLoading?: boolean;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

export function CodeEditor({ onSubmit, isLoading = false }: CodeEditorProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);
      toast.success('Code loaded successfully');
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setCode('');
    toast.success('Code cleared');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to review');
      return;
    }
    await onSubmit(code, language);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Code Submission</h3>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Code Content</label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here or upload a file..."
            className="font-mono text-sm min-h-80 resize-none"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <label>
            <input
              type="file"
              accept=".js,.ts,.py,.java,.cpp,.cs,.go,.rs,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" asChild className="cursor-pointer">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </span>
            </Button>
          </label>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!code}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!code}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!code.trim() || isLoading}
            className="ml-auto"
          >
            {isLoading ? 'Reviewing...' : 'Start Review'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
