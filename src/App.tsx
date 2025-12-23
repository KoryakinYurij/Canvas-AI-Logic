import { useGraphStore } from '@domain/graph/useGraphStore';
import { PromptInput } from '@presentation/organisms/PromptInput';
import { ChatSidebar } from '@presentation/organisms/ChatSidebar';
import { CanvasWidget } from '@widget/canvas/CanvasWidget';
import { ToastContainer } from '@presentation/atoms/Toast';
import { ProposalReview } from '@presentation/organisms/ProposalReview';

function App() {
  const { nodes } = useGraphStore();
  const hasNodes = Object.keys(nodes).length > 0;

  return (
    <div className="min-h-screen bg-background font-sans text-slate-900">
      {hasNodes ? (
        <>
          <CanvasWidget />
          <ChatSidebar />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <PromptInput />
        </div>
      )}
      <ProposalReview />
      <ToastContainer />
    </div>
  )
}

export default App
