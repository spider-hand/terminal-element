import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('hello-world')
export class HelloWorld extends LitElement {
  @property({ type: String })
  name = 'World'

  render() {
    return html`<h1>Hello ${this.name}!</h1>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hello-world': HelloWorld
  }
}
