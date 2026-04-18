# terminal-element

![demo1](https://github.com/user-attachments/assets/7e96e50f-ca82-4bd5-a5e2-0a215ae30b12)

![demo2](https://github.com/user-attachments/assets/2bbdac1f-e8a5-4da7-a046-28a63d7fe85f)

![npm version](https://img.shields.io/npm/v/terminal-element) ![npm downloads](https://img.shields.io/npm/dm/terminal-element) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/terminal-element) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) [![codecov](https://codecov.io/gh/spider-hand/terminal-element/graph/badge.svg?token=3TNWF0ZMDS)](https://codecov.io/gh/spider-hand/terminal-element) ![Lit](https://img.shields.io/badge/lit-%23324FFF.svg?&logo=lit&logoColor=white)

A Web Component for rendering terminal-style previews - works with any framework (React, Vue, Angular, Svelte, etc.)

## Demo

📗 [Storybook](https://main--69c3d55e127974ed658d1728.chromatic.com)

🔗 [Demo](https://terminal-element-demo.pages.dev)

## Installation

```
npm install terminal-element
```

## Usage

```html
<terminal-element></terminal-element>
```

## Props

| Name               | Type                  | Required | Default   | Description                                          |
| ------------------ | --------------------- | -------- | --------- | ---------------------------------------------------- |
| width              | `string`              | No       | `"600px"` | Width of the terminal                                |
| height             | `string`              | No       | `"360px"` | Height of the terminal                               |
| theme              | `"light" \| "dark"`   | No       | `"dark"`  | Theme of the terminal                                |
| currentDirectory   | `string`              | No       | `""`      | Current directory displayed in header                |
| prompt             | `string \| Segment[]` | No       | `"$"`     | Prompt symbol or styled prompt segments              |
| content            | `Line[]`              | No       | `[]`      | Content to display (see [Line](#line) section)       |
| animated           | `boolean`             | No       | `false`   | Enable typing animation                              |
| typingSpeed        | `number`              | No       | `100`     | Typing speed in ms per character                     |
| loop               | `boolean`             | No       | `false`   | Enable infinite loop animation                       |
| delayAfterComplete | `number`              | No       | `4000`    | Delay after animation completes before clearing (ms) |
| delayBeforeRestart | `number`              | No       | `1000`    | Delay showing empty screen before restart (ms)       |

### Prompt

**Prompt** - Displays before input lines:

```typescript
type Prompt = string | Segment[];
```

String prompt:

```javascript
prompt = "$";
```

Styled prompt:

```javascript
prompt = [
  { text: "main", color: "green" },
  { text: " $", color: "cyan", bg: "black" },
];
```

### Line

The `content` prop accepts an array of `Line` objects. Lines can render visible content or update previously rendered content.

**InputLine** - Displays a command with prompt:

```typescript
type InputLine = {
  type: "input";
  id?: string;
  text: string;
};
```

**OutputLine** - Displays output text (with optional delay for animation):

```typescript
// Simple text output
type OutputLineText = {
  type: "output";
  id?: string;
  text: string;
  color?: AnsiColorType;
  delay?: number; // Delay in ms before showing this line (animation only)
};

// Colored segments output
type OutputLineSegments = {
  type: "output";
  id?: string;
  segments: Segment[];
  delay?: number;
};

type Segment = {
  text: string;
  color?: AnsiColorType; // "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" and their "-bright" variants
  bg?: AnsiColorType;
};

// Remove previously rendered lines
type EraseLine = {
  type: "erase";
  count: number;
  delay?: number;
};

// String-based progress bar output
type ProgressBarLine = {
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

// Update a previously rendered line by id
type LineUpdateText = {
  type: "update";
  targetId: string;
  text: string;
  color?: AnsiColorType;
  delay?: number;
};

type LineUpdateSegments = {
  type: "update";
  targetId: string;
  segments: Segment[];
  delay?: number;
};
```

**Example:**

```javascript
content = [
  { type: "input", text: "npm install" },
  { type: "output", text: "" },
  { type: "output", id: "install-status", text: "Installing..." },
  {
    type: "update",
    targetId: "install-status",
    text: "Resolving packages...",
    color: "yellow",
    delay: 800,
  },
  {
    type: "progress",
    length: 24,
    completeIn: 1500,
    startColor: "cyan",
    endColor: "green-bright",
    indent: 2,
  },
  { type: "erase", count: 1, delay: 800 },
  {
    type: "output",
    text: "added 50 packages in 2s",
    color: "green",
    delay: 500,
  },
  {
    type: "output",
    segments: [{ text: "✓", color: "green" }, { text: " Done!" }],
  },
];
```

## Styling

| Variable                                 | Default                                  |
| ---------------------------------------- | ---------------------------------------- |
| `--terminal-element-font-family`         | `monospace`                              |
| `--terminal-element-border-radius`       | `10px`                                   |
| `--terminal-element-border-color`        | Generate based on background dynamically |
| `--terminal-element-font-size`           | `14px`                                   |
| `--terminal-element-box-shadow`          | `rgb(0 0 0 / 56%) 0 22px 70px 4px`       |
| `--terminal-element-background`          | `#000000`                                |
| `--terminal-element-foreground`          | `#bbbbbb`                                |
| `--terminal-element-caret-color`         | `#bbbbbb`                                |
| `--terminal-element-ansi-black`          | `#000000`                                |
| `--terminal-element-ansi-black-bright`   | `#555555`                                |
| `--terminal-element-ansi-red`            | `#bb0000`                                |
| `--terminal-element-ansi-red-bright`     | `#ff5555`                                |
| `--terminal-element-ansi-green`          | `#00bb00`                                |
| `--terminal-element-ansi-green-bright`   | `#55ff55`                                |
| `--terminal-element-ansi-yellow`         | `#bbbb00`                                |
| `--terminal-element-ansi-yellow-bright`  | `#ffff55`                                |
| `--terminal-element-ansi-blue`           | `#0d0dc8`                                |
| `--terminal-element-ansi-blue-bright`    | `#5555ff`                                |
| `--terminal-element-ansi-magenta`        | `#bb00bb`                                |
| `--terminal-element-ansi-magenta-bright` | `#ff55ff`                                |
| `--terminal-element-ansi-cyan`           | `#00bbbb`                                |
| `--terminal-element-ansi-cyan-bright`    | `#55ffff`                                |
| `--terminal-element-ansi-white`          | `#bbbbbb`                                |
| `--terminal-element-ansi-white-bright`   | `#ffffff`                                |

## Contributing

- Bug fix PRs are always welcome.
- UI changes or new features should not be submitted without prior discussion. Please open an issue first to propose and discuss them.

Thanks for your understanding and contributions.

## License

[MIT](./LICENSE)
