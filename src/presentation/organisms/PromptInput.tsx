import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { TextArea } from '../atoms/Input';
import { generateGraphUseCase } from '../../di';
import { useToastStore } from '@presentation/stores/useToastStore';

export const PromptInput: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const actions = await generateGraphUseCase.execute(prompt);
      console.log('Proposed actions:', actions);
      addToast(`Received ${actions.length} proposed actions. Approval UI coming soon.`, 'success');
    } catch (error) {
      console.error(error);
      addToast(error instanceof Error ? error.message : 'Failed to generate graph', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
        What do you want to map?
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A sales funnel for a SaaS product..."
          className="text-lg p-4"
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? 'Generating...' : 'Generate Graph'}
          </Button>
        </div>
      </form>
    </div>
  );
};
