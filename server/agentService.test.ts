import { describe, it, expect } from 'vitest';
import { performCodeReview, getAgentNames } from './agentService';

describe('Agent Service', () => {
  describe('performCodeReview', () => {
    it('should detect var usage as warning', async () => {
      const code = 'var x = 10;';
      const issues = await performCodeReview(code, 'javascript');
      
      const varIssue = issues.find(i => i.title.includes('var'));
      expect(varIssue).toBeDefined();
      expect(varIssue?.severity).toBe('warning');
    });

    it('should detect console.log as warning', async () => {
      const code = 'console.log("debug");';
      const issues = await performCodeReview(code, 'javascript');
      
      const consoleIssue = issues.find(i => i.title.includes('Debug'));
      expect(consoleIssue).toBeDefined();
      expect(consoleIssue?.severity).toBe('warning');
    });

    it('should detect eval as error', async () => {
      const code = 'eval("malicious code");';
      const issues = await performCodeReview(code, 'javascript');
      
      const evalIssue = issues.find(i => i.title.includes('dynamic code'));
      expect(evalIssue).toBeDefined();
      expect(evalIssue?.severity).toBe('error');
    });

    it('should detect innerHTML as error', async () => {
      const code = 'element.innerHTML = userInput;';
      const issues = await performCodeReview(code, 'javascript');
      
      const xssIssue = issues.find(i => i.title.includes('XSS'));
      expect(xssIssue).toBeDefined();
      expect(xssIssue?.severity).toBe('error');
    });

    it('should detect HTTP as warning', async () => {
      const code = 'fetch("http://example.com");';
      const issues = await performCodeReview(code, 'javascript');
      
      const httpIssue = issues.find(i => i.title.includes('HTTP'));
      expect(httpIssue).toBeDefined();
      expect(httpIssue?.severity).toBe('warning');
    });

    it('should return issues sorted by severity', async () => {
      const code = 'eval("x"); var y = 1; console.log(y);';
      const issues = await performCodeReview(code, 'javascript');
      
      // Check that errors come before warnings
      let lastSeverityIndex = -1;
      const severityOrder = { error: 0, warning: 1, suggestion: 2 };
      
      for (const issue of issues) {
        const currentIndex = severityOrder[issue.severity];
        expect(currentIndex).toBeGreaterThanOrEqual(lastSeverityIndex);
        lastSeverityIndex = currentIndex;
      }
    });

    it('should remove duplicate issues', async () => {
      const code = 'console.log("x"); console.log("y");';
      const issues = await performCodeReview(code, 'javascript');
      
      const debugIssues = issues.filter(i => i.title.includes('Debug'));
      expect(debugIssues.length).toBeLessThanOrEqual(1);
    });

    it('should handle empty code', async () => {
      const code = '';
      const issues = await performCodeReview(code, 'javascript');
      
      expect(Array.isArray(issues)).toBe(true);
    });

    it('should support multiple languages', async () => {
      const languages = ['javascript', 'typescript', 'python', 'java'];
      
      for (const lang of languages) {
        const issues = await performCodeReview('var x = 1;', lang);
        expect(Array.isArray(issues)).toBe(true);
      }
    }, { timeout: 10000 });
  });

  describe('getAgentNames', () => {
    it('should return 4 agents', () => {
      const agents = getAgentNames();
      expect(agents).toHaveLength(4);
    });

    it('should include Code Analysis Agent', () => {
      const agents = getAgentNames();
      const codeAnalysis = agents.find(a => a.type === 'code_analysis');
      expect(codeAnalysis).toBeDefined();
      expect(codeAnalysis?.name).toBe('代码分析 Agent');
    });

    it('should include Security Detection Agent', () => {
      const agents = getAgentNames();
      const security = agents.find(a => a.type === 'security_detection');
      expect(security).toBeDefined();
      expect(security?.name).toBe('安全检测 Agent');
    });

    it('should include Performance Optimization Agent', () => {
      const agents = getAgentNames();
      const performance = agents.find(a => a.type === 'performance_optimization');
      expect(performance).toBeDefined();
      expect(performance?.name).toBe('性能优化 Agent');
    });

    it('should include Documentation Generation Agent', () => {
      const agents = getAgentNames();
      const documentation = agents.find(a => a.type === 'documentation_generation');
      expect(documentation).toBeDefined();
      expect(documentation?.name).toBe('文档生成 Agent');
    });
  });
});
