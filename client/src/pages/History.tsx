import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Loader2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function History() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: tasks, isLoading, error } = trpc.review.listTasks.useQuery(
    { limit: 50 },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">请先登录</h1>
          <p className="text-slate-400">登录后查看审查历史</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>加载历史记录失败</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">审查历史</h1>
              <p className="text-slate-400 text-sm mt-1">
                共 {tasks?.length || 0} 条记录
              </p>
            </div>
            <Button
              onClick={() => navigate("/workbench")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              新建审查
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              暂无审查记录
            </h2>
            <p className="text-slate-400 mb-6">开始审查代码，记录将显示在这里</p>
            <Button
              onClick={() => navigate("/workbench")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              开始审查
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="bg-slate-800/50 border-slate-700/50 hover:border-blue-600/50 transition-all cursor-pointer p-6"
                onClick={() => navigate(`/workbench`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {task.title || `审查任务 #${task.id}`}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>
                        {formatDistanceToNow(new Date(task.createdAt), {
                          locale: zhCN,
                          addSuffix: true,
                        })}
                      </span>
                      <Badge className="bg-slate-700 text-slate-200">
                        {task.language}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
