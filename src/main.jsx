import { createRoot } from 'react-dom/client'
import ChatWidget from './components/ChatWidget'
import BrowserAI from './components/BrowserAI'

class ChatWidgetElement extends HTMLElement {
  connectedCallback() {
    const root = document.createElement('div')
    this.appendChild(root)
    const reactRoot = createRoot(root)

    // Get the source attribute from the custom element
    const source = this.getAttribute('source') || ''

    // Pass the source as a prop to the ChatWidget component
    reactRoot.render(<ChatWidget source={source} />)
  }
}

class BrowserAIElement extends HTMLElement {
  connectedCallback() {
    const root = document.createElement('div')
    this.appendChild(root)
    const reactRoot = createRoot(root)

    // Get the model attribute from the custom element (optional)
    const model = this.getAttribute('model') || 'Phi-3-mini-4k-instruct-q4f16_1'

    // Pass the model as a prop to the BrowserAI component
    reactRoot.render(<BrowserAI model={model} />)
  }
}

customElements.define('digital-wisdom-chat', ChatWidgetElement)
customElements.define('browser-ai-chat', BrowserAIElement)
