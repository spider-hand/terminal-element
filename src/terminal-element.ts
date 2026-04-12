import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import chroma from "chroma-js";

export type ThemeType = "light" | "dark";

export type AnsiColorType =
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

export type Segment = {
  text: string;
  color?: AnsiColorType;
  bg?: AnsiColorType;
};

export type Prompt = string | Segment[];

export type InputLine = {
  type: "input";
  id?: string;
  text: string;
};

export type OutputLineText = {
  type: "output";
  id?: string;
  text: string;
  color?: AnsiColorType;
  delay?: number;
};

export type OutputLineSegments = {
  type: "output";
  id?: string;
  segments: Segment[];
  delay?: number;
};

export type EraseLine = {
  type: "erase";
  count: number;
  delay?: number;
};

export type ProgressBarLine = {
  type: "progress";
  id?: string;
  length: number;
  completeIn: number;
  startColor?: AnsiColorType;
  endColor?: AnsiColorType;
  indent?: number;
  completeChar?: string;
  incompleteChar?: string;
  delay?: number;
};

export type LineUpdateText = {
  type: "update";
  targetId: string;
  text: string;
  color?: AnsiColorType;
  delay?: number;
};

export type LineUpdateSegments = {
  type: "update";
  targetId: string;
  segments: Segment[];
  delay?: number;
};

export type LineUpdate = LineUpdateText | LineUpdateSegments;

export type VisibleLine =
  | InputLine
  | OutputLineText
  | OutputLineSegments
  | ProgressBarLine;

export type Line = VisibleLine | EraseLine | LineUpdate;

export interface TerminalElementProps {
  width?: string;
  height?: string;
  theme?: ThemeType;
  currentDirectory?: string;
  prompt?: Prompt;
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
  @property({ type: String }) prompt: Prompt = "$";
  @property({ type: Array }) content: Line[] = [];
  @property({ type: Boolean }) animated = false;
  @property({ type: Number }) typingSpeed = 100;
  @property({ type: Boolean }) loop = false;
  @property({ type: Number }) delayAfterComplete = 4000;
  @property({ type: Number }) delayBeforeRestart = 1000;

  @state() private _currentLineIndex = 0;
  @state() private _currentCharInLine = 0;
  @state() private _currentProgressRatio = 0;
  @state() private _isProgressLineVisible = false;
  @state() private _isAnimating = false;
  @state() private _isWaitingToRestart = false;

  private _animationTimer: number | null = null;
  private _currentProgressElapsed = 0;
  private readonly _progressTickInterval = 50;

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
    this._currentProgressElapsed = 0;
    this._currentProgressRatio = 0;
    this._isProgressLineVisible = false;
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
    } else if (currentLine.type === "progress") {
      const delay = currentLine.delay ?? 0;
      if (delay > 0) {
        this._isProgressLineVisible = false;
        this._animationTimer = setTimeout(() => {
          this._startProgressLine();
        }, delay);
      } else {
        this._startProgressLine();
      }
    } else {
      const delay = currentLine.delay ?? 0;
      if (delay > 0) {
        // Apply the line after a delay, then move to next line
        this._animationTimer = setTimeout(() => {
          this._moveToNextLine();
        }, delay);
      } else {
        // Apply the line immediately and move to next line
        this._moveToNextLine();
      }
    }
  }

  private _startProgressLine() {
    const line = this.content[this._currentLineIndex];
    if (line.type !== "progress") return;

    this._currentProgressElapsed = 0;
    this._currentProgressRatio = line.completeIn <= 0 ? 1 : 0;
    this._isProgressLineVisible = true;
    this.requestUpdate();

    if (line.completeIn <= 0) {
      this._moveToNextLine();
      return;
    }

    this._animationTimer = setTimeout(
      () => this._tickProgressLine(),
      this._progressTickInterval,
    );
  }

  private _tickProgressLine() {
    const line = this.content[this._currentLineIndex];
    if (line.type !== "progress") return;

    this._currentProgressElapsed = Math.min(
      line.completeIn,
      this._currentProgressElapsed + this._progressTickInterval,
    );
    this._currentProgressRatio = this._currentProgressElapsed / line.completeIn;
    this.requestUpdate();

    if (this._currentProgressRatio >= 1) {
      this._moveToNextLine();
      return;
    }

    this._animationTimer = setTimeout(
      () => this._tickProgressLine(),
      this._progressTickInterval,
    );
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
    this._currentProgressElapsed = 0;
    this._currentProgressRatio = 0;
    this._isProgressLineVisible = false;
    this._processCurrentLine();
  }

  private _stopAnimation() {
    if (this._animationTimer !== null) {
      clearTimeout(this._animationTimer);
      this._animationTimer = null;
    }
    this._currentProgressElapsed = 0;
    this._currentProgressRatio = 0;
    this._isProgressLineVisible = false;
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
    return this._getVisibleLines(this.content.length).map((line) =>
      this._renderFullLine(line),
    );
  }

  private _renderPartialContent() {
    const result = this._getVisibleLines(this._currentLineIndex).map((line) =>
      this._renderFullLine(line),
    );

    const line = this.content[this._currentLineIndex];

    if (line?.type === "input") {
      // Render the current animating line with typing effect
      result.push(this._renderPartialInputLine(line));
    } else if (line?.type === "progress" && this._isProgressLineVisible) {
      // Render the current animating progress line with the current progress ratio
      result.push(this._renderProgressLine(line, this._currentProgressRatio));
    }

    return result;
  }

  private _getVisibleLines(endIndex: number) {
    const visibleLines: VisibleLine[] = [];

    for (const line of this.content.slice(0, endIndex)) {
      if (line.type === "erase") {
        const count = Math.max(0, line.count);
        visibleLines.splice(Math.max(0, visibleLines.length - count), count);
      } else if (line.type === "update") {
        const targetIndex = visibleLines.findIndex(
          (visibleLine) => visibleLine.id === line.targetId,
        );

        if (targetIndex !== -1) {
          visibleLines[targetIndex] = this._buildUpdatedLine(line);
        }
      } else {
        visibleLines.push(line);
      }
    }

    return visibleLines;
  }

  private _buildUpdatedLine(
    line: LineUpdate,
  ): OutputLineText | OutputLineSegments {
    if ("text" in line) {
      return {
        type: "output",
        id: line.targetId,
        text: line.text,
        color: line.color,
      };
    }

    return {
      type: "output",
      id: line.targetId,
      segments: line.segments,
    };
  }

  private _renderFullLine(line: VisibleLine) {
    if (line.type === "input") {
      // prettier-ignore
      return html`<div class="terminal-element__body-line">${this._renderPrompt()}<span class="terminal-element__body-segment">${line.text}</span></div>`;
    } else if ("text" in line) {
      // prettier-ignore
      return html`<div class="terminal-element__body-line">${this._renderOutputLine(line)}</div>`;
    } else if (line.type === "progress") {
      return this._renderProgressLine(line, 1);
    } else {
      // prettier-ignore
      return html`<div class="terminal-element__body-line">${line.segments.length === 0
        ? html`&nbsp;`
        : line.segments.map((segment) => this._renderSegment(segment))}</div>`;
    }
  }

  private _renderPartialInputLine(line: InputLine) {
    const visibleText = line.text.slice(0, this._currentCharInLine);
    // prettier-ignore
    return html`<div class="terminal-element__body-line">${this._renderPrompt()}<span class="terminal-element__body-segment">${visibleText}</span><span class="terminal-element__body-caret"></span></div>`;
  }

  private _renderPrompt() {
    const segments =
      typeof this.prompt === "string" ? [{ text: this.prompt }] : this.prompt;

    return html`${segments.map((segment) => this._renderSegment(segment))}&nbsp;`;
  }

  private _renderOutputLine(line: OutputLineText) {
    if (line.text === "") {
      return html`&nbsp;`;
    }

    return html`<span
      style="color: ${line.color
        ? `var(--terminal-element-ansi-${line.color})`
        : "inherit"};"
      >${line.text}</span
    >`;
  }

  private _renderProgressLine(line: ProgressBarLine, ratio: number) {
    // prettier-ignore
    return html`<div class="terminal-element__body-line">${this._buildProgressSegments(line, ratio).map((segment) => this._renderProgressSegment(segment))}</div>`;
  }

  private _buildProgressSegments(line: ProgressBarLine, ratio: number) {
    // Build the progress bar which completed the animation
    const length = Math.max(0, Math.floor(line.length));
    const progressRatio = Math.min(1, Math.max(0, ratio));
    const completedLength =
      progressRatio >= 1 ? length : Math.floor(length * progressRatio);
    const incompleteLength = length - completedLength;
    const indent = Math.max(0, Math.floor(line.indent ?? 0));
    const completeChar = line.completeChar ?? "█";
    const incompleteChar = line.incompleteChar ?? "";
    const startColor = this._resolveProgressColor(line.startColor ?? "green");
    const endColor = this._resolveProgressColor(line.endColor ?? "green");
    const colorScale = chroma.scale([startColor, endColor]);
    const segments: { text: string; color?: string }[] = [];

    if (indent > 0) {
      segments.push({ text: " ".repeat(indent) });
    }

    for (let index = 0; index < completedLength; index++) {
      segments.push({
        text: completeChar,
        color: colorScale(length <= 1 ? 1 : index / (length - 1)).hex(),
      });
    }

    if (incompleteLength > 0 && incompleteChar !== "") {
      segments.push({ text: incompleteChar.repeat(incompleteLength) });
    }

    return segments;
  }

  private _renderProgressSegment(segment: { text: string; color?: string }) {
    // Render a segment of the progress bar
    // prettier-ignore
    return html`<span style="color: ${segment.color ?? "inherit"};"
      >${segment.text}</span
    >`;
  }

  private _resolveProgressColor(color: AnsiColorType) {
    const computedColor = getComputedStyle(this)
      .getPropertyValue(`--terminal-element-ansi-${color}`)
      .trim();
    return computedColor;
  }

  private _renderSegment(segment: Segment) {
    return html`<span
      style="color: ${segment.color
        ? `var(--terminal-element-ansi-${segment.color})`
        : "inherit"}; background-color: ${segment.bg
        ? `var(--terminal-element-ansi-${segment.bg})`
        : "inherit"};"
      >${segment.text}</span
    >`;
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
