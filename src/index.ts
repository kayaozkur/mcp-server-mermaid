#!/usr/bin/env node

/**
 * MCP Mermaid Server - Visual Intelligence and Diagram Generation
 * 
 * Provides comprehensive Mermaid diagram generation, analysis, and intelligence
 * capabilities through the Model Context Protocol (MCP).
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { MermaidTools } from './tools.js';
import { Logger } from './logger.js';

/**
 * MCP Mermaid Server
 * 
 * Features:
 * - generate_diagram_from_code: Generate diagrams from code analysis
 * - analyze_diagram_structure: Analyze existing diagram structures
 * - suggest_diagram_improvements: AI-powered optimization suggestions
 * - create_workflow_diagram: Create workflow visualizations
 * - export_diagram_formats: Export to multiple formats (SVG, PNG, PDF)
 * - validate_diagram_syntax: Validate Mermaid syntax
 */
class MermaidServer {
  private server: Server;
  private tools: MermaidTools;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('MermaidServer');
    this.tools = new MermaidTools();
    
    this.server = new Server(
      {
        name: 'mcp-mermaid-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    // Server initialized - no logging to avoid stdout pollution
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate_diagram_from_code',
            description: 'Generate Mermaid diagrams from code analysis (flowcharts, sequence diagrams, class diagrams)',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Source code to analyze and generate diagram from'
                },
                diagram_type: {
                  type: 'string',
                  enum: ['flowchart', 'sequence', 'class', 'state', 'auto'],
                  description: 'Type of diagram to generate (auto for intelligent detection)'
                },
                language: {
                  type: 'string',
                  description: 'Programming language of the source code'
                },
                include_details: {
                  type: 'boolean',
                  description: 'Include detailed annotations and comments',
                  default: false
                }
              },
              required: ['code']
            }
          },
          {
            name: 'analyze_diagram_structure',
            description: 'Analyze existing Mermaid diagram structure and provide insights',
            inputSchema: {
              type: 'object',
              properties: {
                diagram_code: {
                  type: 'string',
                  description: 'Mermaid diagram code to analyze'
                },
                analysis_type: {
                  type: 'string',
                  enum: ['structure', 'complexity', 'optimization', 'full'],
                  description: 'Type of analysis to perform',
                  default: 'full'
                }
              },
              required: ['diagram_code']
            }
          },
          {
            name: 'suggest_diagram_improvements',
            description: 'AI-powered suggestions for improving diagram clarity and effectiveness',
            inputSchema: {
              type: 'object',
              properties: {
                diagram_code: {
                  type: 'string',
                  description: 'Mermaid diagram code to improve'
                },
                context: {
                  type: 'string',
                  description: 'Context or purpose of the diagram for targeted suggestions'
                },
                audience: {
                  type: 'string',
                  enum: ['technical', 'business', 'general', 'documentation'],
                  description: 'Target audience for optimization',
                  default: 'general'
                }
              },
              required: ['diagram_code']
            }
          },
          {
            name: 'create_workflow_diagram',
            description: 'Create workflow diagrams from process descriptions or Git history',
            inputSchema: {
              type: 'object',
              properties: {
                workflow_description: {
                  type: 'string',
                  description: 'Description of the workflow or process'
                },
                workflow_type: {
                  type: 'string',
                  enum: ['git', 'cicd', 'business', 'development', 'deployment'],
                  description: 'Type of workflow to create'
                },
                include_decision_points: {
                  type: 'boolean',
                  description: 'Include decision points and branching logic',
                  default: true
                },
                format: {
                  type: 'string',
                  enum: ['flowchart', 'sequence', 'state', 'gantt'],
                  description: 'Diagram format for the workflow',
                  default: 'flowchart'
                }
              },
              required: ['workflow_description', 'workflow_type']
            }
          },
          {
            name: 'export_diagram_formats',
            description: 'Export Mermaid diagrams to various formats (SVG, PNG, PDF)',
            inputSchema: {
              type: 'object',
              properties: {
                diagram_code: {
                  type: 'string',
                  description: 'Mermaid diagram code to export'
                },
                format: {
                  type: 'string',
                  enum: ['svg', 'png', 'pdf', 'html'],
                  description: 'Export format'
                },
                output_path: {
                  type: 'string',
                  description: 'Optional output file path'
                },
                theme: {
                  type: 'string',
                  enum: ['default', 'dark', 'forest', 'neutral'],
                  description: 'Diagram theme',
                  default: 'default'
                },
                width: {
                  type: 'number',
                  description: 'Width for raster formats (PNG)',
                  default: 1920
                },
                height: {
                  type: 'number',
                  description: 'Height for raster formats (PNG)',
                  default: 1080
                }
              },
              required: ['diagram_code', 'format']
            }
          },
          {
            name: 'validate_diagram_syntax',
            description: 'Validate Mermaid diagram syntax and provide error details',
            inputSchema: {
              type: 'object',
              properties: {
                diagram_code: {
                  type: 'string',
                  description: 'Mermaid diagram code to validate'
                },
                strict_mode: {
                  type: 'boolean',
                  description: 'Enable strict validation mode',
                  default: false
                },
                provide_suggestions: {
                  type: 'boolean',
                  description: 'Provide syntax correction suggestions',
                  default: true
                }
              },
              required: ['diagram_code']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: any;
        switch (name) {
          case 'generate_diagram_from_code':
            result = await this.tools.generateDiagramFromCode(args);
            break;
          
          case 'analyze_diagram_structure':
            result = await this.tools.analyzeDiagramStructure(args);
            break;
          
          case 'suggest_diagram_improvements':
            result = await this.tools.suggestDiagramImprovements(args);
            break;
          
          case 'create_workflow_diagram':
            result = await this.tools.createWorkflowDiagram(args);
            break;
          
          case 'export_diagram_formats':
            result = await this.tools.exportDiagramFormats(args);
            break;
          
          case 'validate_diagram_syntax':
            result = await this.tools.validateDiagramSyntax(args);
            break;
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
        
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        this.logger.error(`Tool execution failed for ${name}:`, error);
        
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${errorMessage}`
            }
          ]
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // Server started - no logging to avoid stdout pollution
  }
}

// Start the server
const server = new MermaidServer();
server.run().catch((error) => {
  console.error('Failed to start MCP Mermaid Server:', error);
  process.exit(1);
});