import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { CodeEditor } from '@/components/CodeEditor';
import { AgentCollaborationPanel } from '@/components/AgentCollaborationPanel';
import { ReviewResultCard } from '@/components/ReviewResultCard';
import { StatisticsDashboard } from '@/components/StatisticsDashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function ReviewWorkbench() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);

  const submitReview = trpc.review.submit.useMutation();
  const getStatistics = trpc.review.getStatistics.useQuery();
  const getAgents = trpc.review.getAgents.useQuery();

  const handleSubmitCode = async (code: string, language: string) => {
    setIsReviewing(true);
    setAgents([
      { type: 'code_analysis', name: 'Code Analysis Agent', status: 'running' },
      { type: 'security_detection', name: 'Security Detection Agent', status: 'pending' },
      { type: 'performance_optimization', name: 'Performance Optimization Agent', status: 'pending' },
      { type: 'documentation_generation', name: 'Documentation Generation Agent', status: 'pending' },
    ]);

    try {
      const result = await submitReview.mutateAsync({
        code,
        language,
        title: `Code Review - ${new Date().toLocaleString()}`,
      });

      // Simulate agent execution
      const agentSequence = [
        { type: 'code_analysis', name: 'Code Analysis Agent' },
        { type: 'security_detection', name: 'Security Detection Agent' },
        { type: 'performance_optimization', name: 'Performance Optimization Agent' },
        { type: 'documentation_generation', name: 'Documentation Generation Agent' },
      ];

      for (let i = 0; i < agentSequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setAgents(prev =>
          prev.map((agent, idx) => {
            if (idx === i) return { ...agent, status: 'completed', duration: Math.random() * 1000 + 500, issuesFound: Math.floor(Math.random() * 5) };
            if (idx === i + 1) return { ...agent, status: 'running' };
            return agent;
          })
        );
      }

      setReviewResult(result);
      setIsReviewing(false);
      toast.success('Code review completed!');
      getStatistics.refetch();
    } catch (error) {
      setIsReviewing(false);
      toast.error('Review failed. Please try again.');
      console.error(error);
    }
  };

  const statistics = getStatistics.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="mb-4 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white mb-2">Code Review Workbench</h1>
          <p className="text-slate-400">Submit your code for intelligent multi-agent analysis</p>
        </div>

        <Tabs defaultValue="review" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="review" className="data-[state=active]:bg-slate-700">
              Review
            </TabsTrigger>
            <TabsTrigger value="statistics" className="data-[state=active]:bg-slate-700">
              Statistics
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-slate-700">
              History
            </TabsTrigger>
          </TabsList>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CodeEditor onSubmit={handleSubmitCode} isLoading={isReviewing} />
            </motion.div>

            {agents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <AgentCollaborationPanel agents={agents} isProcessing={isReviewing} />
              </motion.div>
            )}

            {reviewResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Review Results</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">Total Issues</p>
                      <p className="text-3xl font-bold text-slate-900">{reviewResult.issuesCount}</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">Errors</p>
                      <p className="text-3xl font-bold text-red-600">
                        {reviewResult.issues.filter((i: any) => i.severity === 'error').length}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">Warnings</p>
                      <p className="text-3xl font-bold text-amber-600">
                        {reviewResult.issues.filter((i: any) => i.severity === 'warning').length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {reviewResult.issues.map((issue: any, index: number) => (
                      <ReviewResultCard key={index} issue={issue} />
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            {statistics ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StatisticsDashboard statistics={statistics} />
              </motion.div>
            ) : (
              <Card className="p-8 text-center bg-slate-50">
                <p className="text-slate-600">No statistics available yet. Start reviewing code to see data.</p>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="p-8 text-center bg-slate-50">
              <p className="text-slate-600">History feature coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
