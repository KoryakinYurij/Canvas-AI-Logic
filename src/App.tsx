import { useGraphStore } from '@domain/graph/useGraphStore';
import { PromptInput } from '@presentation/organisms/PromptInput';
import { CanvasWidget } from '@widget/canvas/CanvasWidget';

function App() {
  const { nodes } = useGraphStore();
  const hasNodes = Object.keys(nodes).length > 0;

  return (
    <div className="min-h-screen bg-background font-sans text-slate-900">
      {hasNodes ? (
        <CanvasWidget />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <PromptInput />
        </div>
      )}
    </div>
  )
}

export default App
