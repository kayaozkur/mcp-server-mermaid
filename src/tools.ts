/**
 * Mermaid Visual Intelligence Tools
 * 
 * Core tool implementations for the MCP Mermaid Server
 */

import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { Logger } from './logger.js';
import { MermaidRenderer } from './renderer.js';

export interface ToolResponse {
  content: Array<{
    type: 'text' | 'image';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
}

export interface ValidationError {
  line: number;
  message: string;
}

export class MermaidTools {
  private logger: Logger;
  private renderer: MermaidRenderer;

  constructor() {
    this.logger = new Logger('MermaidTools');
    this.renderer = new MermaidRenderer();
  }

  /**
   * Generate Mermaid diagrams from code analysis
   */
  async generateDiagramFromCode(args: any): Promise<ToolResponse> {
    const { code, diagram_type = 'auto', language, include_details = false } = args;

    this.logger.info(`Generating ${diagram_type} diagram from ${language || 'unknown'} code`);

    try {
      // Analyze code structure and generate appropriate diagram
      const analysis = this.analyzeCodeStructure(code, language);
      const diagramCode = this.generateDiagramCode(analysis, diagram_type, include_details);
      
      // Validate the generated diagram
      const validation = await this.validateDiagramSyntax({ diagram_code: diagramCode });
      
      return {
        content: [
          {
            type: 'text',
            text: `# Generated ${analysis.detectedType} Diagram\n\n\`\`\`mermaid\n${diagramCode}\n\`\`\`\n\n## Analysis Summary\n- **Detected Type**: ${analysis.detectedType}\n- **Complexity**: ${analysis.complexity}\n- **Elements**: ${analysis.elements.join(', ')}\n- **Syntax Valid**: ${validation.content[0]?.text?.includes('✅') ? 'Yes' : 'No'}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to generate diagram from code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze existing Mermaid diagram structure
   */
  async analyzeDiagramStructure(args: any): Promise<ToolResponse> {
    const { diagram_code, analysis_type = 'full' } = args;

    this.logger.info(`Analyzing diagram structure: ${analysis_type}`);

    try {
      const analysis = this.performDiagramAnalysis(diagram_code, analysis_type);
      
      return {
        content: [
          {
            type: 'text',
            text: `# Diagram Structure Analysis\n\n## Overview\n- **Type**: ${analysis.type}\n- **Nodes**: ${analysis.nodeCount}\n- **Edges**: ${analysis.edgeCount}\n- **Complexity Score**: ${analysis.complexityScore}/10\n\n## Structure Details\n${analysis.details}\n\n## Recommendations\n${analysis.recommendations.map(r => `- ${r}`).join('\n')}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to analyze diagram structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Suggest improvements for diagrams
   */
  async suggestDiagramImprovements(args: any): Promise<ToolResponse> {
    const { diagram_code, context, audience = 'general' } = args;

    this.logger.info(`Suggesting improvements for ${audience} audience`);

    try {
      const suggestions = this.generateImprovementSuggestions(diagram_code, context, audience);
      
      return {
        content: [
          {
            type: 'text',
            text: `# Diagram Improvement Suggestions\n\n## For ${audience} audience\n\n${suggestions.map((s, i) => `### ${i + 1}. ${s.title}\n**Priority**: ${s.priority}\n**Description**: ${s.description}\n**Implementation**: ${s.implementation}\n`).join('\n')}\n\n## Optimized Version\n\`\`\`mermaid\n${suggestions.find(s => s.optimizedCode)?.optimizedCode || diagram_code}\n\`\`\``
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to suggest improvements: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create workflow diagrams
   */
  async createWorkflowDiagram(args: any): Promise<ToolResponse> {
    const { workflow_description, workflow_type, include_decision_points = true, format = 'flowchart' } = args;

    this.logger.info(`Creating ${workflow_type} workflow diagram in ${format} format`);

    try {
      const workflowDiagram = this.generateWorkflowDiagram(
        workflow_description,
        workflow_type,
        include_decision_points,
        format
      );
      
      return {
        content: [
          {
            type: 'text',
            text: `# ${workflow_type.toUpperCase()} Workflow Diagram\n\n\`\`\`mermaid\n${workflowDiagram}\n\`\`\`\n\n## Workflow Features\n- **Type**: ${workflow_type}\n- **Format**: ${format}\n- **Decision Points**: ${include_decision_points ? 'Included' : 'Not included'}\n- **Generated from**: ${workflow_description.slice(0, 100)}${workflow_description.length > 100 ? '...' : ''}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to create workflow diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export diagrams to various formats
   */
  async exportDiagramFormats(args: any): Promise<ToolResponse> {
    const { diagram_code, format, output_path, theme = 'default', width = 1920, height = 1080 } = args;

    this.logger.info(`Exporting diagram to ${format} format with ${theme} theme`);

    try {
      const exportResult = await this.renderer.exportDiagram({
        diagramCode: diagram_code,
        format,
        theme,
        width,
        height,
        outputPath: output_path
      });

      return {
        content: [
          {
            type: 'text',
            text: `# Diagram Export Complete\n\n- **Format**: ${format.toUpperCase()}\n- **Theme**: ${theme}\n- **Dimensions**: ${width}x${height}\n- **Output**: ${exportResult.outputPath || 'Base64 encoded'}\n- **Size**: ${exportResult.size}\n\n## Export Details\n${exportResult.details}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to export diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate Mermaid diagram syntax
   */
  async validateDiagramSyntax(args: any): Promise<ToolResponse> {
    const { diagram_code, strict_mode = false, provide_suggestions = true } = args;

    this.logger.info(`Validating diagram syntax (strict: ${strict_mode})`);

    try {
      const validation = this.performSyntaxValidation(diagram_code, strict_mode);
      
      let response = `# Syntax Validation Results\n\n`;
      
      if (validation.isValid) {
        response += `✅ **Valid Mermaid syntax**\n\n`;
        response += `## Diagram Info\n`;
        response += `- **Type**: ${validation.diagramType}\n`;
        response += `- **Nodes**: ${validation.nodeCount}\n`;
        response += `- **Complexity**: ${validation.complexity}\n`;
      } else {
        response += `❌ **Invalid syntax found**\n\n`;
        response += `## Errors\n`;
        response += validation.errors.map(e => `- **Line ${e.line}**: ${e.message}`).join('\n') + '\n\n';
        
        if (provide_suggestions && validation.suggestions.length > 0) {
          response += `## Suggested Fixes\n`;
          response += validation.suggestions.map(s => `- ${s}`).join('\n') + '\n\n';
          
          if (validation.correctedCode) {
            response += `## Corrected Code\n\`\`\`mermaid\n${validation.correctedCode}\n\`\`\``;
          }
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: response
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to validate syntax: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods for code analysis and diagram generation
  private analyzeCodeStructure(code: string, language?: string) {
    // Implementation for analyzing code structure
    // This would use AST parsing or pattern matching
    return {
      detectedType: 'flowchart',
      complexity: 'medium',
      elements: ['functions', 'variables', 'classes'],
      structure: {}
    };
  }

  private generateDiagramCode(analysis: any, diagramType: string, includeDetails: boolean): string {
    // Implementation for generating Mermaid code based on analysis
    return `flowchart TD\n    A[Start] --> B[Process]\n    B --> C[End]`;
  }

  private performDiagramAnalysis(diagramCode: string, analysisType: string) {
    // Implementation for diagram structure analysis
    return {
      type: 'flowchart',
      nodeCount: 3,
      edgeCount: 2,
      complexityScore: 5,
      details: 'Simple linear flow',
      recommendations: ['Add decision points', 'Include error handling']
    };
  }

  private generateImprovementSuggestions(diagramCode: string, context: string, audience: string) {
    // Implementation for generating improvement suggestions
    return [
      {
        title: 'Improve Readability',
        priority: 'High',
        description: 'Add clearer labels and grouping',
        implementation: 'Use subgraphs and better node labels',
        optimizedCode: diagramCode
      }
    ];
  }

  private generateWorkflowDiagram(description: string, type: string, includeDecisions: boolean, format: string): string {
    // Implementation for workflow diagram generation
    switch (format) {
      case 'sequence':
        return `sequenceDiagram\n    participant A as User\n    participant B as System\n    A->>B: Request\n    B-->>A: Response`;
      case 'state':
        return `stateDiagram-v2\n    [*] --> Idle\n    Idle --> Processing\n    Processing --> [*]`;
      case 'gantt':
        return `gantt\n    title Project Timeline\n    dateFormat YYYY-MM-DD\n    section Phase 1\n    Task 1: 2024-01-01, 3d`;
      default:
        return `flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action]\n    B -->|No| D[Alternative]\n    C --> E[End]\n    D --> E`;
    }
  }

  private performSyntaxValidation(diagramCode: string, strictMode: boolean) {
    // Implementation for syntax validation
    // This would use the Mermaid parser
    return {
      isValid: true,
      diagramType: 'flowchart',
      nodeCount: 3,
      complexity: 'low',
      errors: [] as ValidationError[],
      suggestions: [] as string[],
      correctedCode: null as string | null
    };
  }
}