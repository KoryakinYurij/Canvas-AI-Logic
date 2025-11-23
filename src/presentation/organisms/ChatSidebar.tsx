import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { refineGraphUseCase } from '../../di';
import { useGraphStore } from '@domain/graph/useGraphStore';
import { Trash2, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useToastStore } from '@presentation/stores/useToastStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I can help you refine your graph. What would you like to change?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { clearGraph } = useGraphStore();
  const { addToast } = useToastStore();

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
      clearGraph();
      setMessages([{ id: Date.now().toString(), role: 'assistant', content: 'Canvas cleared. What would you like to create next?' }]);
      setIsOpen(false);
    }
  };

  const handleExportJSON = () => {
    const state = useGraphStore.getState();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes: state.nodes, edges: state.edges }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "canvas-ai-graph.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportPNG = async () => {
    const node = document.getElementById('canvas-export-root');
    if (node) {
      try {
        const dataUrl = await toPng(node, { backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = 'canvas-ai-graph.png';
        link.href = dataUrl;
        link.click();
        addToast('Graph exported successfully!', 'success');
      } catch (err) {
        console.error('Failed to export PNG', err);
        addToast('Failed to export PNG. See console for details.', 'error');
      }
    } else {
      addToast('Could not find canvas element to export.', 'error');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await refineGraphUseCase.execute(userMessage.content);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I have updated the graph based on your request.'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while updating the graph.'
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Open Chat"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Bot size={20} className="text-blue-600" />
          AI Assistant
        </h2>
        <div className="flex gap-1">
          <button
            onClick={handleExportJSON}
            className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
            title="Export JSON"
          >
            <span className="text-xs font-bold">JSON</span>
          </button>
          <button
            onClick={handleExportPNG}
            className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
            title="Export PNG"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handleClear}
            className="p-1 hover:bg-red-100 hover:text-red-600 rounded text-slate-500 transition-colors"
            title="Clear Canvas"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"
            )}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={clsx(
              "p-3 rounded-lg text-sm",
              msg.role === 'user'
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[90%]">
             <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0">
               <Bot size={14} />
             </div>
             <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-tl-none shadow-sm">
               <div className="flex gap-1">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your request..."
            className="flex-1 resize-none border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 h-10 w-10 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
