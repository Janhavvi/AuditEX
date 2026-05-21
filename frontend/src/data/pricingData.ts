import type { ToolName, ToolPricing } from '../types/audit';

export const supportedTools: ToolName[] = [
  'Cursor',
  'GitHub Copilot',
  'Claude',
  'ChatGPT',
  'Anthropic API direct',
  'NVIDIA NIM',
  'OpenAI API direct',
  'Gemini',
  'Windsurf',
  'v0',
];

export const pricingData: Record<ToolName, ToolPricing> = {
  Cursor: {
    tool: 'Cursor',
    category: 'coding',
    alternatives: ['GitHub Copilot', 'Windsurf'],
    plans: [
      { name: 'Hobby', monthlyPrice: 0, bestFor: ['coding'], notes: 'Light individual coding.' },
      { name: 'Pro', monthlyPrice: 20, bestFor: ['coding'], notes: 'Daily individual coding with included usage credits.' },
      { name: 'Business', monthlyPrice: 40, bestFor: ['coding'], notes: 'Team controls and admin; Cursor currently markets this as Teams.' },
      { name: 'Enterprise', monthlyPrice: 0, bestFor: ['coding'], notes: 'Custom governance; benchmark with entered spend because public pricing is custom.' },
    ],
  },
  'GitHub Copilot': {
    tool: 'GitHub Copilot',
    category: 'coding',
    alternatives: ['Cursor', 'Windsurf'],
    plans: [
      { name: 'Individual', monthlyPrice: 10, bestFor: ['coding'], notes: 'Individual developer coding assistant.' },
      { name: 'Business', monthlyPrice: 19, bestFor: ['coding'], notes: 'Organization license and policy controls.' },
      { name: 'Enterprise', monthlyPrice: 39, bestFor: ['coding'], notes: 'Enterprise controls and higher included usage.' },
    ],
  },
  Claude: {
    tool: 'Claude',
    category: 'assistant',
    alternatives: ['ChatGPT', 'Gemini'],
    plans: [
      { name: 'Free', monthlyPrice: 0, bestFor: ['writing', 'research'], notes: 'Light evaluation.' },
      { name: 'Pro', monthlyPrice: 20, bestFor: ['writing', 'research', 'mixed'], notes: 'Individual knowledge work.' },
      { name: 'Max', monthlyPrice: 100, bestFor: ['research', 'mixed'], notes: 'Heavy personal usage.' },
      { name: 'Team', monthlyPrice: 30, bestFor: ['writing', 'research', 'mixed'], notes: 'Team workspace.' },
      { name: 'Enterprise', monthlyPrice: 0, bestFor: ['mixed'], notes: 'Custom governance and security.' },
      { name: 'API direct', monthlyPrice: 0, bestFor: ['data', 'mixed'], notes: 'Usage-based model access; benchmark with entered spend.' },
    ],
  },
  ChatGPT: {
    tool: 'ChatGPT',
    category: 'assistant',
    alternatives: ['Claude', 'Gemini'],
    plans: [
      { name: 'Plus', monthlyPrice: 20, bestFor: ['writing', 'research', 'mixed'], notes: 'Individual AI assistant.' },
      { name: 'Team', monthlyPrice: 30, bestFor: ['mixed'], notes: 'Shared team workspace.' },
      { name: 'Enterprise', monthlyPrice: 0, bestFor: ['mixed', 'data'], notes: 'Custom enterprise controls.' },
      { name: 'API direct', monthlyPrice: 0, bestFor: ['data', 'mixed'], notes: 'Usage-based API spend; benchmark with entered spend.' },
    ],
  },
  Gemini: {
    tool: 'Gemini',
    category: 'assistant',
    alternatives: ['ChatGPT', 'Claude'],
    plans: [
      { name: 'Pro', monthlyPrice: 19.99, bestFor: ['writing', 'research'], notes: 'General productivity.' },
      { name: 'Ultra', monthlyPrice: 99.99, bestFor: ['mixed', 'data'], notes: 'Higher individual usage tier.' },
      { name: 'API', monthlyPrice: 0, bestFor: ['data', 'mixed'], notes: 'Usage-based model access; benchmark with entered spend.' },
    ],
  },
  'OpenAI API direct': {
    tool: 'OpenAI API direct',
    category: 'api',
    alternatives: ['Anthropic API direct', 'NVIDIA NIM', 'Gemini'],
    plans: [
      { name: 'API direct', monthlyPrice: 0, bestFor: ['data', 'mixed'], notes: 'Usage-based API spend; use dashboard spend as source of truth.' },
    ],
  },
  'Anthropic API direct': {
    tool: 'Anthropic API direct',
    category: 'api',
    alternatives: ['OpenAI API direct', 'NVIDIA NIM', 'Gemini'],
    plans: [
      { name: 'API direct', monthlyPrice: 0, bestFor: ['data', 'mixed'], notes: 'Usage-based API spend; use dashboard spend as source of truth.' },
    ],
  },
  'NVIDIA NIM': {
    tool: 'NVIDIA NIM',
    category: 'api',
    alternatives: ['OpenAI API direct', 'Anthropic API direct', 'Gemini'],
    plans: [
      { name: 'API direct', monthlyPrice: 0, bestFor: ['data', 'mixed'], notes: 'Usage-based or self-hosted NIM spend; use entered cloud, endpoint, or NVIDIA AI Enterprise cost as source of truth.' },
    ],
  },
  Windsurf: {
    tool: 'Windsurf',
    category: 'coding',
    alternatives: ['Cursor', 'GitHub Copilot'],
    plans: [
      { name: 'Free', monthlyPrice: 0, bestFor: ['coding'], notes: 'Starter coding usage.' },
      { name: 'Pro', monthlyPrice: 15, bestFor: ['coding'], notes: 'Individual coding assistant.' },
      { name: 'Team', monthlyPrice: 30, bestFor: ['coding'], notes: 'Team coding workflows.' },
      { name: 'Enterprise', monthlyPrice: 0, bestFor: ['coding'], notes: 'Enterprise coding controls; public pricing routes to sales.' },
    ],
  },
  v0: {
    tool: 'v0',
    category: 'builder',
    alternatives: ['Cursor', 'ChatGPT'],
    plans: [
      { name: 'Free', monthlyPrice: 0, bestFor: ['coding'], notes: 'Prototype generation with included monthly credits.' },
      { name: 'Pro', monthlyPrice: 20, bestFor: ['coding'], notes: 'Individual UI generation; verify live credit bundles.' },
      { name: 'Team', monthlyPrice: 30, bestFor: ['coding'], notes: 'Shared product workflows with included monthly credits.' },
      { name: 'Enterprise', monthlyPrice: 0, bestFor: ['coding'], notes: 'Governed product teams; contact sales.' },
    ],
  },
};

export const useCases = ['coding', 'writing', 'data', 'research', 'mixed'] as const;
