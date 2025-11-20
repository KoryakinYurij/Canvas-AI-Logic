import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CanvasWidget } from './widgets/CanvasWidget';
import { GraphModel } from './domain/Graph';
import { generateGraphFromText } from './infrastructure/AIConnector.mock';

const App = () => {
  const [graph, setGraph] = useState<GraphModel | null>(null);

  useEffect(() => {
    generateGraphFromText("Initial graph").then(setGraph);
  }, []);

  if (!graph) {
    return <div>Loading...</div>;
  }

  return <CanvasWidget graph={graph} />;
};

ReactDOM.render(<App />, document.getElementById('root'));
