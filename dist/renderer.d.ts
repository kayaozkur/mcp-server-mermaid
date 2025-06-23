export interface ExportOptions {
    diagramCode: string;
    format: 'svg' | 'png' | 'pdf' | 'html';
    theme?: 'default' | 'dark' | 'forest' | 'neutral';
    width?: number;
    height?: number;
    outputPath?: string;
}
export interface ExportResult {
    success: boolean;
    outputPath?: string;
    base64Data?: string;
    size: string;
    details: string;
}
export declare class MermaidRenderer {
    private logger;
    constructor();
    exportDiagram(options: ExportOptions): Promise<ExportResult>;
    private renderSVG;
    private renderPNG;
    private renderPDF;
    private renderHTML;
    private generateSVGTemplate;
    private generateHTMLTemplate;
    private getThemeColors;
    private ensureDirectoryExists;
}
