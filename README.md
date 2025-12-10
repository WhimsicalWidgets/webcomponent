# Digital Wisdom Chat Web Components

This project provides embeddable chat widgets as custom web components. It includes two main components:

1. **Digital Wisdom Chat** - An iframe-based chat interface
2. **Browser AI Chat** - A fully embedded AI chat interface using @mlc-ai/web-llm

## Components

### Digital Wisdom Chat (`digital-wisdom-chat`)
An embeddable chat widget that loads an external chat interface via iframe.

**Usage:**
```html
<digital-wisdom-chat source="https://your-chat-url.com"></digital-wisdom-chat>
```

**Attributes:**
- `source` (required): URL of the chat interface to embed

### Browser AI Chat (`browser-ai-chat`)
A fully embedded AI chat interface that runs locally in the browser using WebGPU and the @mlc-ai/web-llm library.

**Usage:**
```html
<browser-ai-chat></browser-ai-chat>
```

**Attributes:**
- `model` (optional): The model to use for AI generation (default: "Phi-3-mini-4k-instruct-q4f16_1")

## Features

- **No Dependencies**: Both components work as standalone custom elements
- **Responsive Design**: Built with Material-UI for a consistent look and feel
- **Local AI**: The Browser AI component runs entirely in the browser using WebGPU
- **Customizable**: Both components support theming and can be styled via CSS

## Browser Compatibility

The Browser AI component requires:
- WebGPU support (Chrome 113+, Edge 113+)
- Modern browser with JavaScript enabled

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```
