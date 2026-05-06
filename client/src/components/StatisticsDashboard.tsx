import { Card } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, AlertCircle, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

interface Statistics {
  totalReviews: number | null;
  totalIssuesFound: number | null;
  errorCount: number | null;
  warningCount: number | null;
  suggestionCount: number | null;
  fixedIssuesCount: number | null;
}

interface StatisticsDashboardProps {
  statistics: Statistics;
}

export function StatisticsDashboard({ statistics }: StatisticsDashboardProps) {
  const issueData = [
    { name: 'Errors', value: statistics.errorCount || 0, fill: '#ef4444' },
    { name: 'Warnings', value: statistics.warningCount || 0, fill: '#f59e0b' },
    { name: 'Suggestions', value: statistics.suggestionCount || 0, fill: '#3b82f6' },
  ];

  const fixRate = (statistics.totalIssuesFound || 0) > 0
    ? Math.round(((statistics.fixedIssuesCount || 0) / (statistics.totalIssuesFound || 0)) * 100)
    : 0;

  const statCards = [
    {
      icon: FileText,
      label: 'Total Reviews',
      value: statistics.totalReviews || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: AlertCircle,
      label: 'Issues Found',
      value: statistics.totalIssuesFound || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: TrendingUp,
      label: 'Fix Rate',
      value: `${fixRate}%`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`${stat.bgColor} border-0 p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`w-12 h-12 ${stat.color} opacity-20`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Distribution */}
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Issue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={issueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {issueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Issue Breakdown */}
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Issue Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-slate-700">Errors</span>
                </div>
                <span className="text-sm font-bold text-red-600">{statistics.errorCount || 0}</span>
              </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(statistics.totalIssuesFound || 0) > 0 ? ((statistics.errorCount || 0) / (statistics.totalIssuesFound || 0)) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-slate-700">Warnings</span>
                </div>
                <span className="text-sm font-bold text-amber-600">{statistics.warningCount || 0}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(statistics.totalIssuesFound || 0) > 0 ? ((statistics.warningCount || 0) / (statistics.totalIssuesFound || 0)) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Suggestions</span>
                </div>
                <span className="text-sm font-bold text-blue-600">{statistics.suggestionCount || 0}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(statistics.totalIssuesFound || 0) > 0 ? ((statistics.suggestionCount || 0) / (statistics.totalIssuesFound || 0)) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
