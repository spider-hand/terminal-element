import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

type ThemeType = "light" | "dark";

type Segment = {
  text: string;
  color?: string;
};

type Line =
  | {
      type: "input";
      text: string;
    }
  | {
      type: "output";
      segments: Segment[];
    };

export interface TerminalElementProps {
  width?: string;
  height?: string;
  theme?: ThemeType;
  currentDirectory?: string;
  prompt?: string;
  content?: Line[];
}

@customElement("terminal-element")
export class TerminalElement extends LitElement {
  @property({ type: String }) width = "600px";
  @property({ type: String }) height = "360px";
  @property({ type: String, reflect: true }) theme: ThemeType = "dark";
  @property({ type: String }) currentDirectory = "";
  @property({ type: String }) prompt = "$";
  @property({ type: Array }) content: Line[] = [];

  static styles = css`
    :host {
      display: block;
      width: fit-content;
      height: fit-content;

      /** UI colors */
      --terminal-element-border-color: #070707;
      --terminal-element-header-bg: #323232;
      --terminal-element-header-border: #6a6a6a;
      --terminal-element-header-border-bottom: #6a6a6a;
      --terminal-element-header-directory-color: #afafb4;
      --terminal-element-body-bg: #101317;
      --terminal-element-body-border: #606060;
      --terminal-element-body-content-color: #d4d4d4;
      --terminal-element-caret-color: #fff;

      /** ANSI colors */
      --terminal-element-ansi-black: #14191e;
      --terminal-element-ansi-black-bright: #676767;
      --terminal-element-ansi-red: #b43c29;
      --terminal-element-ansi-red-bright: #dc7974;
      --terminal-element-ansi-green: #00c200;
      --terminal-element-ansi-green-bright: #57e690;
      --terminal-element-ansi-yellow: #c7c400;
      --terminal-element-ansi-yellow-bright: #ece100;
      --terminal-element-ansi-blue: #2743c7;
      --terminal-element-ansi-blue-bright: #a6aaf1;
      --terminal-element-ansi-magenta: #bf3fbd;
      --terminal-element-ansi-magenta-bright: #e07de0;
      --terminal-element-ansi-cyan: #00c5c7;
      --terminal-element-ansi-cyan-bright: #5ffdff;
      --terminal-element-ansi-white: #c7c7c7;
      --terminal-element-ansi-white-bright: #feffff;
    }

    :host([theme="light"]) {
      /** UI colors */
      --terminal-element-border-color: #cdcdcd;
      --terminal-element-header-bg: #f4f4f8;
      --terminal-element-header-border: #f1f1f4;
      --terminal-element-header-border-bottom: #dfdfdf;
      --terminal-element-header-directory-color: #393939;
      --terminal-element-body-bg: #fff;
      --terminal-element-body-border: transparent;
      --terminal-element-body-content-color: #0c0c0c;
      --terminal-element-caret-color: #808080;

      /** ANSI colors */
      --terminal-element-ansi-black: #000;
      --terminal-element-ansi-black-bright: #808080;
      --terminal-element-ansi-red: #900;
      --terminal-element-ansi-red-bright: #e60000;
      --terminal-element-ansi-green: #00a600;
      --terminal-element-ansi-green-bright: #00d900;
      --terminal-element-ansi-yellow: #990;
      --terminal-element-ansi-yellow-bright: #e6e600;
      --terminal-element-ansi-blue: #0000b2;
      --terminal-element-ansi-blue-bright: #00f;
      --terminal-element-ansi-magenta: #b200b2;
      --terminal-element-ansi-magenta-bright: #e600e6;
      --terminal-element-ansi-cyan: #00a6b2;
      --terminal-element-ansi-cyan-bright: #00e6e6;
      --terminal-element-ansi-white: #bfbfbf;
      --terminal-element-ansi-white-bright: #e6e6e6;
    }

    * {
      box-sizing: border-box;
      margin: 0;
    }

    .terminal-element {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--terminal-element-border-color);
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
      background-color: var(--terminal-element-header-bg);
      border-top: 1px solid var(--terminal-element-header-border);
      border-right: 1px solid var(--terminal-element-header-border);
      border-bottom: 1px solid var(--terminal-element-header-border-bottom);
      border-left: 1px solid var(--terminal-element-header-border);
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
      color: var(--terminal-element-header-directory-color);
    }

    .terminal-element__body {
      flex: 1;
      padding: 4px;
      background-color: var(--terminal-element-body-bg);
      border-right: solid 1px var(--terminal-element-body-border);
      border-bottom: solid 1px var(--terminal-element-body-border);
      border-left: solid 1px var(--terminal-element-body-border);
    }

    .terminal-element__body-content {
      font-family: monospace;
      font-size: 14px;
      font-weight: 400;
      color: var(--terminal-element-body-content-color);
    }

    .terminal-element__body-line {
      white-space: pre;
    }

    .terminal-element__body-caret {
      background-color: var(--terminal-element-caret-color);
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
            ${this.content.map((line) => {
              if (line.type === "input") {
                // prettier-ignore
                // to prevent the formatter from breaking the template literal
                return html`<div class="terminal-element__body-line"><span>${this.prompt}&nbsp;</span><span class="terminal-element__body-segment">${line.text}</span></div>`;
              } else if (line.type === "output") {
                // prettier-ignore
                // to prevent the formatter from breaking the template literal
                return html`<div class="terminal-element__body-line">${line.segments.length === 0
                    ? html`&nbsp;`
                    : line.segments.map(
                        (segment) =>
                          html`<span style="color: ${segment.color ?? "inherit"};">${segment.text}</span>`,
                      )}</div>`;
              }
            })}
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
