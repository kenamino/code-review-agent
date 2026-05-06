import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Code2, Shield, Zap, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { getLoginUrl } from '@/const';

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Code2,
      title: 'Code Analysis',
      description: 'Intelligent code structure and style analysis',
    },
    {
      icon: Shield,
      title: 'Security Detection',
      description: 'Identify vulnerabilities and security risks',
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Find and fix performance bottlenecks',
    },
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Improve code documentation quality',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900 bg-opacity-50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold text-white">CodeReview AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/about')}
              className="text-slate-300 hover:text-white"
            >
              About
            </Button>
            {user ? (
              <Button
                onClick={() => setLocation('/workbench')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Go to Workbench
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Intelligent Code Review<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Powered by AI Agents
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Four specialized AI agents work together to analyze your code from multiple perspectives: structure, security, performance, and documentation.
          </p>
          {user ? (
            <Button
              onClick={() => setLocation('/workbench')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
            >
              Start Reviewing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500 transition-colors">
                  <Icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-0 p-8 text-center">
            <p className="text-4xl font-bold text-blue-200 mb-2">4</p>
            <p className="text-blue-100">Specialized Agents</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-0 p-8 text-center">
            <p className="text-4xl font-bold text-purple-200 mb-2">8+</p>
            <p className="text-purple-100">Languages Supported</p>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-900 to-cyan-800 border-0 p-8 text-center">
            <p className="text-4xl font-bold text-cyan-200 mb-2">100%</p>
            <p className="text-cyan-100">Type-Safe Analysis</p>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Improve Your Code?</h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Submit your code snippet and let our AI agents provide comprehensive analysis in seconds.
            </p>
            {user ? (
              <Button
                onClick={() => setLocation('/workbench')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-slate-100"
              >
                Start Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                size="lg"
                className="bg-white text-blue-600 hover:bg-slate-100"
              >
                Sign In to Start
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
