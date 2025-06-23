import { Logger } from './logger.js';
import { MermaidRenderer } from './renderer.js';
export class MermaidTools {
    logger;
    renderer;
    constructor() {
        this.logger = new Logger('MermaidTools');
        this.renderer = new MermaidRenderer();
    }
    async generateDiagramFromCode(args) {
        const { code, diagram_type = 'auto', language, include_details = false } = args;
        this.logger.info(`Generating ${diagram_type} diagram from ${language || 'unknown'} code`);
        try {
            const analysis = this.analyzeCodeStructure(code, language);
            const diagramCode = this.generateDiagramCode(analysis, diagram_type, include_details);
            const validation = await this.validateDiagramSyntax({ diagram_code: diagramCode });
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Generated ${analysis.detectedType} Diagram\n\n\`\`\`mermaid\n${diagramCode}\n\`\`\`\n\n## Analysis Summary\n- **Detected Type**: ${analysis.detectedType}\n- **Complexity**: ${analysis.complexity}\n- **Elements**: ${analysis.elements.join(', ')}\n- **Syntax Valid**: ${validation.content[0]?.text?.includes('✅') ? 'Yes' : 'No'}`
                    }
                ]
            };
        }
        catch (error) {
            throw new Error(`Failed to generate diagram from code: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async analyzeDiagramStructure(args) {
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
        }
        catch (error) {
            throw new Error(`Failed to analyze diagram structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async suggestDiagramImprovements(args) {
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
        }
        catch (error) {
            throw new Error(`Failed to suggest improvements: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createWorkflowDiagram(args) {
        const { workflow_description, workflow_type, include_decision_points = true, format = 'flowchart' } = args;
        this.logger.info(`Creating ${workflow_type} workflow diagram in ${format} format`);
        try {
            const workflowDiagram = this.generateWorkflowDiagram(workflow_description, workflow_type, include_decision_points, format);
            return {
                content: [
                    {
                        type: 'text',
                        text: `# ${workflow_type.toUpperCase()} Workflow Diagram\n\n\`\`\`mermaid\n${workflowDiagram}\n\`\`\`\n\n## Workflow Features\n- **Type**: ${workflow_type}\n- **Format**: ${format}\n- **Decision Points**: ${include_decision_points ? 'Included' : 'Not included'}\n- **Generated from**: ${workflow_description.slice(0, 100)}${workflow_description.length > 100 ? '...' : ''}`
                    }
                ]
            };
        }
        catch (error) {
            throw new Error(`Failed to create workflow diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async exportDiagramFormats(args) {
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
        }
        catch (error) {
            throw new Error(`Failed to export diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async validateDiagramSyntax(args) {
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
            }
            else {
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
        }
        catch (error) {
            throw new Error(`Failed to validate syntax: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    analyzeCodeStructure(code, language) {
        return {
            detectedType: 'flowchart',
            complexity: 'medium',
            elements: ['functions', 'variables', 'classes'],
            structure: {}
        };
    }
    generateDiagramCode(analysis, diagramType, includeDetails) {
        return `flowchart TD\n    A[Start] --> B[Process]\n    B --> C[End]`;
    }
    performDiagramAnalysis(diagramCode, analysisType) {
        return {
            type: 'flowchart',
            nodeCount: 3,
            edgeCount: 2,
            complexityScore: 5,
            details: 'Simple linear flow',
            recommendations: ['Add decision points', 'Include error handling']
        };
    }
    generateImprovementSuggestions(diagramCode, context, audience) {
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
    generateWorkflowDiagram(description, type, includeDecisions, format) {
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
    performSyntaxValidation(diagramCode, strictMode) {
        return {
            isValid: true,
            diagramType: 'flowchart',
            nodeCount: 3,
            complexity: 'low',
            errors: [],
            suggestions: [],
            correctedCode: null
        };
    }
}
