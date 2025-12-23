import { AIConnector, AIResponse, GraphAction } from '../../domain/ports/AIConnector';
import { GraphModel } from '../../domain/graph/GraphModel';
import OpenAI from 'openai';

export class GeminiConnector implements AIConnector {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      dangerouslyAllowBrowser: true
    });
  }

  private systemPrompt = `
    You are an AI assistant helping to build a Knowledge Graph.
    Instead of returning a full graph, you must propose atomic actions.

    Allowed Actions:
    1. ADD_NODE: Create a new node.
       Payload: { id: "uuid", type: "topic"|"action"|"note", data: { title: "string", body: "string" }, position: { x: number, y: number }, dimensions: { width: 200, height: 100 } }
    2. ADD_EDGE: Connect two nodes.
       Payload: { id: "uuid", sourceId: "node_id", targetId: "node_id", label: "string" }
    3. REMOVE_NODE: Remove a node.
       Payload: { id: "node_id" }
    4. UPDATE_NODE: Update node content.
       Payload: { id: "node_id", data: { title?: "string", body?: "string" } }

    Output JSON Format:
    {
      "actions": [
        { "type": "ADD_NODE", "payload": { ... } },
        ...
      ]
    }
  `;

  async generateGraph(prompt: string): Promise<GraphAction[]> {
    console.log('Gemini generating actions for:', prompt);
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: `Generate a graph for: ${prompt}` }
        ],
      });

      const content = completion.choices[0].message.content || '';
      return this.parseActions(content);
    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
    }
  }

  async refineGraph(currentGraph: GraphModel, command: string): Promise<AIResponse> {
    const classification = await this.classifyIntent(command);

    if (classification === 'CHAT') {
       const chatResponse = await this.client.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Answer concisely.' },
          { role: 'user', content: command }
        ],
      });
      return { type: 'text', content: chatResponse.choices[0].message.content || '...' };
    }

    // For REFINE, we provide context of existing nodes (lightweight)
    const context = {
      existingNodeIds: Object.keys(currentGraph.nodes),
      existingEdges: Object.values(currentGraph.edges).map(e => ({ source: e.sourceId, target: e.targetId }))
    };

    const refinePrompt = `
      Context: ${JSON.stringify(context)}
      User Command: "${command}"
      Propose actions to update the graph.
    `;

    try {
       const completion = await this.client.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: refinePrompt }
        ],
      });
      const actions = this.parseActions(completion.choices[0].message.content || '');
      return {
        type: 'proposal',
        content: actions,
        message: 'I have proposed some changes.'
      };
    } catch (error) {
       console.error('Gemini Refine Error:', error);
       throw error;
    }
  }

  private parseActions(content: string): GraphAction[] {
    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      const parsed = JSON.parse(cleanContent);
      return parsed.actions || [];
    } catch (e) {
      console.error('Failed to parse actions', e);
      return [];
    }
  }

  private async classifyIntent(command: string): Promise<'CHAT' | 'REFINE'> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
          {
            role: 'system',
            content: `Classify intent: CHAT (conversation) or REFINE (graph modification). Return only the word.`
          },
          { role: 'user', content: command }
        ],
      });
      const intent = completion.choices[0].message.content?.trim().toUpperCase();
      return intent === 'REFINE' ? 'REFINE' : 'CHAT';
    } catch {
      return 'REFINE';
    }
  }
}
