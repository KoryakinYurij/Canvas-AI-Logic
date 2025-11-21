import { AIConnector } from '../../domain/ports/AIConnector';
import { GraphModel } from '../../domain/graph/GraphModel';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

export class GeminiConnector implements AIConnector {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      dangerouslyAllowBrowser: true // Safe for this demo/MVP
    });
  }

  private systemPrompt = `
    You are an AI expert in Knowledge Graphs.
    Your task is to generate a structured JSON knowledge graph based on the user's input.

    The JSON schema is:
    {
      "nodes": {
        "[uuid]": {
          "id": "[uuid]",
          "type": "topic" | "action" | "note",
          "data": {
            "title": "string",
            "body": "string"
          },
          "position": { "x": 0, "y": 0 },
          "dimensions": { "width": 200, "height": 100 }
        }
      },
      "edges": {
        "[uuid]": {
          "id": "[uuid]",
          "sourceId": "node_id",
          "targetId": "node_id",
          "label": "string (optional)"
        }
      },
      "metadata": {
        "version": "1.0.0",
        "created": "ISO date string"
      }
    }

    Rules:
    1. Generate sensible nodes and edges.
    2. Use 'topic' for main concepts, 'action' for steps/tasks, 'note' for extra info.
    3. Keep descriptions concise.
    4. Return ONLY the JSON, no markdown code blocks.
  `;

  async generateGraph(prompt: string): Promise<GraphModel> {
    console.log('Gemini generating graph for:', prompt);

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: `Generate a graph for: ${prompt}` }
        ],
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('No content received from Gemini');

      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const graph = JSON.parse(cleanContent);

      // Ensure required fields
      if (!graph.nodes || !graph.edges) throw new Error('Invalid graph structure');

      return graph as GraphModel;

    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
    }
  }

  async refineGraph(currentGraph: GraphModel, command: string): Promise<GraphModel> {
    console.log('Gemini refining graph with:', command);

    const refinePrompt = `
      You are modifying an existing graph.

      Current Graph JSON:
      ${JSON.stringify({ nodes: currentGraph.nodes, edges: currentGraph.edges })}

      User Command: "${command}"

      Instructions:
      1. detailed analysis of the command and the current graph.
      2. Return the UPDATED graph JSON in the same format.
      3. Maintain existing IDs for unchanged nodes.
      4. Generate new UUIDs for new nodes/edges.
      5. Return ONLY the JSON.
    `;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: refinePrompt }
        ],
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error('No content received from Gemini');

      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const graph = JSON.parse(cleanContent);

      return {
        ...graph,
        metadata: currentGraph.metadata
      } as GraphModel;

    } catch (error) {
      console.error('Gemini Refine Error:', error);
      throw error;
    }
  }
}
