import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

type ThemeType = "light" | "dark";

@customElement("terminal-element")
export class TerminalElement extends LitElement {
  @property({ type: String }) width = "600px";
  @property({ type: String }) height = "360px";
  @property({ type: String }) theme: ThemeType = "dark";
  @property({ type: String }) currentDirectory = "";
  @property({ type: String }) content = "";

  static styles = css`
    :host {
      display: block;
      width: fit-content;
      height: fit-content;
    }

    * {
      box-sizing: border-box;
      margin: 0;
    }

    .terminal-element {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #070707;
      border-radius: 10px;
      box-shadow: rgb(0 0 0 / 56%) 0 22px 70px 4px;
    }

    .terminal-element__header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      padding: 0 16px;
      background-color: #323232;
      border-top: 1px solid #6a6a6a;
      border-right: 1px solid #6a6a6a;
      border-left: 1px solid #6a6a6a;
    }

    .terminal-element__header-controls {
      position: absolute;
      left: 8px;
      display: flex;
      flex-direction: row;
      gap: 8px;
    }

    .terminal-element__header-button {
      width: 12px;
      height: 12px;
      border-radius: 999px;
    }

    .terminal-element__header-button--red {
      background-color: #fb4646;
    }

    .terminal-element__header-button--yellow {
      background-color: #fcae24;
    }

    .terminal-element__header-button--green {
      background-color: #28c132;
    }

    .terminal-element__header-directory {
      font-size: 12px;
      font-weight: 600;
      color: #afafb4;
    }

    .terminal-element__body {
      flex: 1;
      padding: 4px;
      background-color: #101317;
      border-right: solid 1px #606060;
      border-bottom: solid 1px #606060;
      border-left: solid 1px #606060;
    }

    .terminal-element__body-content {
      font-size: 12px;
      font-weight: 400;
      color: #d4d4d4;
    }
  `;

  render() {
    return html`
      <div
        class="terminal-element"
        style="width: ${this.width}; height: ${this.height};"
        data-testid="terminal-element"
      >
        <div class="terminal-element__header">
          <div class="terminal-element__header-controls">
            <div
              class="terminal-element__header-button terminal-element__header-button--red"
            ></div>
            <div
              class="terminal-element__header-button terminal-element__header-button--yellow"
            ></div>
            <div
              class="terminal-element__header-button terminal-element__header-button--green"
            ></div>
          </div>
          <div
            class="terminal-element__header-directory"
            data-testid="current-directory"
          >
            ${this.currentDirectory}
          </div>
        </div>
        <div class="terminal-element__body">
          <div class="terminal-element__body-content" data-testid="content">
            ${this.content}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "terminal-element": TerminalElement;
  }
}
