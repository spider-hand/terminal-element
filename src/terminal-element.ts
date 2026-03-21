import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("terminal-element")
export class TerminalElement extends LitElement {
  @property({ type: String })
  name = "Terminal Element";

  render() {
    return html` <h1 data-testid="name">${this.name}</h1> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "terminal-element": TerminalElement;
  }
}
