import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

type ThemeType = "light" | "dark";

type AnsiColorType =
  | "black"
  | "black-bright"
  | "red"
  | "red-bright"
  | "green"
  | "green-bright"
  | "yellow"
  | "yellow-bright"
  | "blue"
  | "blue-bright"
  | "magenta"
  | "magenta-bright"
  | "cyan"
  | "cyan-bright"
  | "white"
  | "white-bright";

type Segment = {
  text: string;
  color?: AnsiColorType;
  bg?: AnsiColorType;
};

type InputLine = {
  type: "input";
  text: string;
};

type OutputLineText = {
  type: "output";
  text: string;
  delay?: number;
};

type OutputLineSegments = {
  type: "output";
  segments: Segment[];
  delay?: number;
};

type Line = InputLine | OutputLineText | OutputLineSegments;

export interface TerminalElementProps {
  width?: string;
  height?: string;
  theme?: ThemeType;
  currentDirectory?: string;
  prompt?: string;
  content?: Line[];
  animated?: boolean;
  typingSpeed?: number;
  loop?: boolean;
  delayAfterComplete?: number;
  delayBeforeRestart?: number;
}

@customElement("terminal-element")
export class TerminalElement extends LitElement {
  @property({ type: String }) width = "600px";
  @property({ type: String }) height = "360px";
  @property({ type: String, reflect: true }) theme: ThemeType = "dark";
  @property({ type: String }) currentDirectory = "";
  @property({ type: String }) prompt = "$";
  @property({ type: Array }) content: Line[] = [];
  @property({ type: Boolean }) animated = false;
  @property({ type: Number }) typingSpeed = 100;
  @property({ type: Boolean }) loop = false;
  @property({ type: Number }) delayAfterComplete = 4000;
  @property({ type: Number }) delayBeforeRestart = 1000;

  @state() private _currentLineIndex = 0;
  @state() private _currentCharInLine = 0;
  @state() private _isAnimating = false;
  @state() private _isWaitingToRestart = false;

  private _animationTimer: number | null = null;

  static styles = css`
    :host {
      display: block;
      width: fit-content;
      height: fit-content;

      --terminal-element-font-size: 14px;
      --terminal-element-box-shadow: rgb(0 0 0 / 56%) 0 22px 70px 4px;

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
      box-shadow: var(--terminal-element-box-shadow);
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
      font-size: var(--terminal-element-font-size);
      font-weight: 400;
      color: var(--terminal-element-body-content-color);
    }

    .terminal-element__body-line {
      word-break: break-all;
      white-space: pre-wrap;
    }

    .terminal-element__body-caret {
      display: inline-block;
      width: 8px;
      height: var(--terminal-element-font-size);
      vertical-align: bottom;
      background-color: var(--terminal-element-caret-color);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.animated) {
      this._startAnimation();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Restart the animation when content changes while animated
    if (
      changedProperties.has("content") &&
      this.animated &&
      changedProperties.get("content") !== undefined
    ) {
      this._stopAnimation();
      this._startAnimation();
    }
  }

  private _startAnimation() {
    this._currentLineIndex = 0;
    this._currentCharInLine = 0;
    this._isAnimating = true;
    this._isWaitingToRestart = false;
    this._processCurrentLine();
  }

  private _processCurrentLine() {
    if (this._currentLineIndex >= this.content.length) {
      if (this.loop) {
        // Wait delayAfterComplete with completed content visible
        this._animationTimer = setTimeout(() => {
          // Clear content and wait delayBeforeRestart
          this._isWaitingToRestart = true;
          this.requestUpdate();
          this._animationTimer = setTimeout(() => {
            this._startAnimation();
          }, this.delayBeforeRestart);
        }, this.delayAfterComplete);
      } else {
        // Animation complete
        this._isAnimating = false;
      }
      return;
    }

    const currentLine = this.content[this._currentLineIndex];

    if (currentLine.type === "input") {
      this._tickInputLine();
    } else {
      const delay = ("delay" in currentLine ? currentLine.delay : 0) ?? 0;
      if (delay > 0) {
        // Show the output line with a delay, then move to next line
        this._animationTimer = setTimeout(() => {
          this._moveToNextLine();
        }, delay);
      } else {
        // Show the output line immediately and move to next line
        this._moveToNextLine();
      }
    }
  }

  private _tickInputLine() {
    const line = this.content[this._currentLineIndex];
    if (line.type !== "input") return;

    const totalChars = line.text.length;

    if (this._currentCharInLine < totalChars) {
      this._currentCharInLine++;
      this._animationTimer = setTimeout(
        () => this._tickInputLine(),
        this.typingSpeed,
      );
    } else {
      this._moveToNextLine();
    }
  }

  private _moveToNextLine() {
    this._currentLineIndex++;
    this._currentCharInLine = 0;
    this._processCurrentLine();
  }

  private _stopAnimation() {
    if (this._animationTimer !== null) {
      clearTimeout(this._animationTimer);
      this._animationTimer = null;
    }
    this._isAnimating = false;
    this._isWaitingToRestart = false;
  }

  private _renderContent() {
    // If animation is disabled, render all content
    if (!this.animated) {
      return this._renderFullContent();
    }

    // If waiting to restart, render empty
    if (this._isWaitingToRestart) {
      return null;
    }

    // If animation is complete (non-loop), render full content
    if (!this._isAnimating && this._currentLineIndex >= this.content.length) {
      return this._renderFullContent();
    }

    return this._renderPartialContent();
  }

  private _renderFullContent() {
    return this.content.map((line) => {
      if (line.type === "input") {
        // prettier-ignore
        // to prevent the formatter from breaking the template literal
        return html`<div class="terminal-element__body-line"><span>${this.prompt}&nbsp;</span><span class="terminal-element__body-segment">${line.text}</span></div>`;
      } else if ("text" in line) {
        // prettier-ignore
        return html`<div class="terminal-element__body-line">${line.text !== "" ? line.text : html`&nbsp;`}</div>`;
      } else {
        // prettier-ignore
        return html`<div class="terminal-element__body-line">${line.segments.length === 0
          ? html`&nbsp;`
          : line.segments.map(
              (segment) =>
                html`<span style="color: ${segment.color ? `var(--terminal-element-ansi-${segment.color})` : "inherit"}; background-color: ${segment.bg ? `var(--terminal-element-ansi-${segment.bg})` : "inherit"};">${segment.text}</span>`,
            )}</div>`;
      }
    });
  }

  private _renderPartialContent() {
    const result: ReturnType<typeof html>[] = [];

    for (let i = 0; i < this.content.length; i++) {
      const line = this.content[i];

      if (i < this._currentLineIndex) {
        // Render the line if it's before the current animating line
        result.push(this._renderFullLine(line));
      } else if (i === this._currentLineIndex) {
        // Render the current animating line with typing effect
        if (line.type === "input") {
          result.push(this._renderPartialInputLine(line));
        }
      }
    }

    return result;
  }

  private _renderFullLine(line: Line) {
    if (line.type === "input") {
      // prettier-ignore
      return html`<div class="terminal-element__body-line"><span>${this.prompt}&nbsp;</span><span class="terminal-element__body-segment">${line.text}</span></div>`;
    } else if ("text" in line) {
      // prettier-ignore
      return html`<div class="terminal-element__body-line">${line.text !== "" ? line.text : html`&nbsp;`}</div>`;
    } else {
      // prettier-ignore
      return html`<div class="terminal-element__body-line">${line.segments.length === 0
        ? html`&nbsp;`
        : line.segments.map(
            (segment) =>
              html`<span style="color: ${segment.color ? `var(--terminal-element-ansi-${segment.color})` : "inherit"}; background-color: ${segment.bg ? `var(--terminal-element-ansi-${segment.bg})` : "inherit"};">${segment.text}</span>`,
          )}</div>`;
    }
  }

  private _renderPartialInputLine(line: InputLine) {
    const visibleText = line.text.slice(0, this._currentCharInLine);
    // prettier-ignore
    return html`<div class="terminal-element__body-line"><span>${this.prompt}&nbsp;</span><span class="terminal-element__body-segment">${visibleText}</span><span class="terminal-element__body-caret"></span></div>`;
  }

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
            ${this._renderContent()}
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
