# MCP Mermaid Server

A Model Context Protocol (MCP) server that provides comprehensive Mermaid diagram generation, analysis, and visual intelligence capabilities.

## Features

### 🎨 **Visual Intelligence Tools**

- **`generate_diagram_from_code`** - Generate diagrams from code analysis (flowcharts, sequence diagrams, class diagrams)
- **`analyze_diagram_structure`** - Analyze existing diagram structures and provide insights
- **`suggest_diagram_improvements`** - AI-powered optimization suggestions
- **`create_workflow_diagram`** - Create workflow visualizations from descriptions
- **`export_diagram_formats`** - Export to multiple formats (SVG, PNG, PDF, HTML)
- **`validate_diagram_syntax`** - Validate Mermaid syntax with error details

### 🚀 **Integration with Serena**

This MCP server is designed to integrate seamlessly with Serena's development ecosystem, providing:

- **Code-to-Diagram Conversion** - Analyze codebases and generate architecture diagrams
- **Workflow Visualization** - Create sequence diagrams from Git/Linear workflows
- **Project Planning** - Gantt charts integrated with development cycles
- **Real-time Collaboration** - Live diagram editing capabilities

## Quick Start

### Installation

```bash
cd mcp-mermaid-server
npm install
npm run build
```

### Development

```bash
npm run dev  # Run with hot reload
```

### Testing

```bash
npm test              # Run tests
npm run test:coverage # Run with coverage
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "mcp-mermaid-server": {
      "command": "node",
      "args": ["/path/to/mcp-mermaid-server/dist/index.js"]
    }
  }
}
```

## Usage Examples

### Generate Diagram from Code

```typescript
// Input: JavaScript/TypeScript code
const result = await generateDiagramFromCode({
  code: `
    function processUser(user) {
      if (!user.isValid()) {
        throw new Error('Invalid user');
      }
      return user.save();
    }
  `,
  diagram_type: 'flowchart',
  language: 'javascript',
  include_details: true
});
```

### Create Workflow Diagram

```typescript
const workflow = await createWorkflowDiagram({
  workflow_description: 'CI/CD pipeline with testing, building, and deployment stages',
  workflow_type: 'cicd',
  include_decision_points: true,
  format: 'flowchart'
});
```

### Export Diagram

```typescript
const exported = await exportDiagramFormats({
  diagram_code: 'flowchart TD\n    A[Start] --> B[End]',
  format: 'svg',
  theme: 'dark',
  output_path: './diagrams/workflow.svg'
});
```

## Supported Diagram Types

- **Flowcharts** - Process flows, decision trees, system architecture
- **Sequence Diagrams** - API interactions, user journeys, system communications
- **State Diagrams** - State machines, UI workflows, system states
- **Class Diagrams** - Object relationships, database schemas
- **Gantt Charts** - Project timelines, task dependencies
- **Git Graphs** - Branch visualization, merge flows

## Themes

- `default` - Clean, minimal theme
- `dark` - Dark mode optimized
- `forest` - Green, nature-inspired
- `neutral` - Subtle, professional

## Export Formats

- **SVG** - Scalable vector graphics
- **PNG** - High-quality raster images
- **PDF** - Print-ready documents
- **HTML** - Interactive web pages with embedded diagrams

## Development Architecture

### Core Modules

- **`index.ts`** - MCP server entry point and tool registration
- **`tools.ts`** - Core visual intelligence tool implementations
- **`renderer.ts`** - Diagram rendering and export engine
- **`logger.ts`** - Logging utilities

### Integration Points

- **Serena Plugin System** - Seamless integration with coding workflows
- **Live Coding Interface** - Real-time preview and editing
- **Template System** - Pre-built diagram templates for common patterns
- **Intelligence Layer** - AI-powered analysis and suggestions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

Part of the [Lepion](../README.md) secret management and development ecosystem.