import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Issue {
  id?: number;
  agentType: string;
  severity: 'error' | 'warning' | 'suggestion';
  title: string;
  description: string;
  lineNumber?: number;
  suggestion: string;
}

interface ReviewResultCardProps {
  issue: Issue;
}

const SEVERITY_CONFIG = {
  error: {
    icon: AlertCircle,
    color: 'bg-red-50 border-red-200',
    badge: 'destructive',
    textColor: 'text-red-700',
  },
  warning: {
    icon: AlertTriangle,
    color: 'bg-amber-50 border-amber-200',
    badge: 'secondary',
    textColor: 'text-amber-700',
  },
  suggestion: {
    icon: Lightbulb,
    color: 'bg-blue-50 border-blue-200',
    badge: 'outline',
    textColor: 'text-blue-700',
  },
};

const AGENT_COLORS = {
  code_analysis: 'bg-blue-100 text-blue-800',
  security_detection: 'bg-red-100 text-red-800',
  performance_optimization: 'bg-amber-100 text-amber-800',
  documentation_generation: 'bg-green-100 text-green-800',
};

export function ReviewResultCard({ issue }: ReviewResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = SEVERITY_CONFIG[issue.severity];
  const Icon = config.icon;

  const agentLabel = {
    code_analysis: 'Code Analysis',
    security_detection: 'Security',
    performance_optimization: 'Performance',
    documentation_generation: 'Documentation',
  }[issue.agentType] || issue.agentType;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${config.color} border-2 overflow-hidden hover:shadow-md transition-shadow`}>
        <div
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.textColor}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className={`font-semibold text-sm ${config.textColor}`}>{issue.title}</h4>
                  <Badge variant={config.badge as any} className="text-xs">
                    {issue.severity === 'error' ? '错误' : issue.severity === 'warning' ? '警告' : '建议'}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${AGENT_COLORS[issue.agentType as keyof typeof AGENT_COLORS] || ''}`}>
                    {agentLabel}
                  </Badge>
                </div>
                <p className={`text-sm ${config.textColor} opacity-80`}>{issue.description}</p>
              </div>
            </div>
            <button className="flex-shrink-0 text-slate-500 hover:text-slate-700 transition-colors">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t-2 border-inherit bg-white bg-opacity-50"
          >
            <div className="p-4 space-y-3">
              {issue.lineNumber && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Line Number</p>
                  <p className="text-sm font-mono text-slate-700">{issue.lineNumber}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">Suggested Fix</p>
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700 font-mono">
                  {issue.suggestion}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Detected by: <span className="font-semibold">{agentLabel} Agent</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
