import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { ArrowRight, Code2, Shield, Zap, BookOpen, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const [, setLocation] = useLocation();

  const agents = [
    {
      icon: Code2,
      name: 'Code Analysis Agent',
      description: 'Analyzes code structure, style, and best practices to identify structural issues and improvements.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Shield,
      name: 'Security Detection Agent',
      description: 'Detects security vulnerabilities including XSS, injection attacks, and sensitive data exposure.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Zap,
      name: 'Performance Optimization Agent',
      description: 'Identifies performance bottlenecks and suggests optimizations for better efficiency.',
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: BookOpen,
      name: 'Documentation Generation Agent',
      description: 'Evaluates code documentation and suggests improvements for clarity and completeness.',
      color: 'from-green-500 to-green-600',
    },
  ];

  const features = [
    {
      icon: Users,
      title: 'Multi-Agent Collaboration',
      description: 'Four specialized agents work together to provide comprehensive code analysis from different perspectives.',
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Track review statistics, issue trends, and improvement metrics over time.',
    },
    {
      icon: Code2,
      title: 'Multiple Languages',
      description: 'Support for JavaScript, TypeScript, Python, Java, C++, C#, Go, and Rust.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Intelligent Code Review Platform
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Powered by multi-agent AI collaboration to deliver comprehensive code analysis, security checks, performance optimization, and documentation improvement.
          </p>
          <Button
            onClick={() => setLocation('/workbench')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Reviewing
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Agents Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Specialized Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className={`bg-gradient-to-br ${agent.color} p-6 text-white border-0 hover:shadow-lg transition-shadow`}>
                    <Icon className="w-12 h-12 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                    <p className="text-sm opacity-90">{agent.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <Icon className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Architecture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-slate-800 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">System Architecture</h2>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Frontend</h3>
                <p>React 19 + Tailwind CSS 4 + Framer Motion - Elegant, responsive UI with smooth animations</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Backend</h3>
                <p>Express.js + tRPC + Drizzle ORM - Type-safe API with real-time data synchronization</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Database</h3>
                <p>MySQL/TiDB - Persistent storage for review tasks, issues, and agent logs</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Agent System</h3>
                <p>Multi-agent collaborative framework - Four specialized agents analyze code in parallel</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-slate-800 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['React 19', 'TypeScript', 'Tailwind CSS 4', 'Express.js', 'tRPC', 'Drizzle ORM', 'Framer Motion', 'Recharts', 'MySQL'].map((tech) => (
                <div key={tech} className="bg-slate-700 rounded px-4 py-2 text-center text-slate-200">
                  {tech}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Review Your Code?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Submit your code and let our intelligent agents provide comprehensive analysis
            </p>
            <Button
              onClick={() => setLocation('/workbench')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100"
            >
              Start Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
