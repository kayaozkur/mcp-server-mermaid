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
export declare class MermaidTools {
    private logger;
    private renderer;
    constructor();
    generateDiagramFromCode(args: any): Promise<ToolResponse>;
    analyzeDiagramStructure(args: any): Promise<ToolResponse>;
    suggestDiagramImprovements(args: any): Promise<ToolResponse>;
    createWorkflowDiagram(args: any): Promise<ToolResponse>;
    exportDiagramFormats(args: any): Promise<ToolResponse>;
    validateDiagramSyntax(args: any): Promise<ToolResponse>;
    private analyzeCodeStructure;
    private generateDiagramCode;
    private performDiagramAnalysis;
    private generateImprovementSuggestions;
    private generateWorkflowDiagram;
    private performSyntaxValidation;
}
