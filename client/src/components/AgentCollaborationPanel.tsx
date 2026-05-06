import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Agent {
  type: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  issuesFound?: number;
}

interface AgentCollaborationPanelProps {
  agents: Agent[];
  isProcessing?: boolean;
}

const AGENT_COLORS = {
  code_analysis: 'from-blue-500 to-blue-600',
  security_detection: 'from-red-500 to-red-600',
  performance_optimization: 'from-amber-500 to-amber-600',
  documentation_generation: 'from-green-500 to-green-600',
};

const AGENT_ICONS = {
  code_analysis: '🔍',
  security_detection: '🛡️',
  performance_optimization: '⚡',
  documentation_generation: '📚',
};

const AGENT_NAMES_CN = {
  code_analysis: '代码分析 Agent',
  security_detection: '安全检测 Agent',
  performance_optimization: '性能优化 Agent',
  documentation_generation: '文档生成 Agent',
};

export function AgentCollaborationPanel({ agents, isProcessing = false }: AgentCollaborationPanelProps) {
  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Multi-Agent Collaboration</h3>

      <div className="space-y-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className={`bg-gradient-to-r ${AGENT_COLORS[agent.type as keyof typeof AGENT_COLORS] || 'from-gray-500 to-gray-600'} rounded-lg p-4 text-white shadow-md hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{AGENT_ICONS[agent.type as keyof typeof AGENT_ICONS] || '🤖'}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{AGENT_NAMES_CN[agent.type as keyof typeof AGENT_NAMES_CN] || agent.name}</h4>
                    <p className="text-xs opacity-90">
                      {agent.status === 'pending' && 'Waiting to start...'}
                      {agent.status === 'running' && 'Analyzing code...'}
                      {agent.status === 'completed' && `Found ${agent.issuesFound || 0} issues`}
                      {agent.status === 'failed' && 'Analysis failed'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {agent.duration && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                      {agent.duration}ms
                    </span>
                  )}
                  {getStatusIcon(agent.status)}
                </div>
              </div>

              {agent.status === 'running' && (
                <div className="mt-3 w-full bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              )}
            </div>

            {/* Connection line */}
            {index < agents.length - 1 && (
              <div className="flex justify-center my-2">
                <div className="w-0.5 h-4 bg-gradient-to-b from-slate-300 to-transparent" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {isProcessing && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-4 h-4" />
            </motion.div>
            <span>Agents are collaborating to review your code...</span>
          </div>
        </div>
      )}
    </Card>
  );
}
