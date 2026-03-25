# terminal-element

![demo](https://github.com/user-attachments/assets/7e96e50f-ca82-4bd5-a5e2-0a215ae30b12)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) [![codecov](https://codecov.io/gh/spider-hand/terminal-element/graph/badge.svg?token=3TNWF0ZMDS)](https://codecov.io/gh/spider-hand/terminal-element) ![Lit](https://img.shields.io/badge/lit-%23324FFF.svg?&logo=lit&logoColor=white)

A Web Component for rendering terminal-style previews - works with any framework (React, Vue, Angular, Svelte, etc.)

## Demo

📗 [Storybook](https://main--69c3d55e127974ed658d1728.chromatic.com)

## Installation

```
npm install terminal-element
```

## Usage

```html
<terminal-element></terminal-element>
```

## Props

| Name               | Type                | Required | Default   | Description                                          |
| ------------------ | ------------------- | -------- | --------- | ---------------------------------------------------- |
| width              | `string`            | No       | `"600px"` | Width of the terminal                                |
| height             | `string`            | No       | `"360px"` | Height of the terminal                               |
| theme              | `"light" \| "dark"` | No       | `"dark"`  | Theme of the terminal                                |
| currentDirectory   | `string`            | No       | `""`      | Current directory displayed in header                |
| prompt             | `string`            | No       | `"$"`     | Prompt symbol                                        |
| content            | `Line[]`            | No       | `[]`      | Content to display (see [Line](#line) section)       |
| animated           | `boolean`           | No       | `false`   | Enable typing animation                              |
| typingSpeed        | `number`            | No       | `100`     | Typing speed in ms per character                     |
| loop               | `boolean`           | No       | `false`   | Enable infinite loop animation                       |
| delayAfterComplete | `number`            | No       | `2000`    | Delay after animation completes before clearing (ms) |
| delayBeforeRestart | `number`            | No       | `1000`    | Delay showing empty screen before restart (ms)       |

### Line

The `content` prop accepts an array of `Line` objects. There are two types:

**InputLine** - Displays a command with prompt:

```typescript
type InputLine = {
  type: "input";
  text: string;
};
```

**OutputLine** - Displays output text (with optional delay for animation):

```typescript
// Simple text output
type OutputLineText = {
  type: "output";
  text: string;
  delay?: number; // Delay in ms before showing this line (animation only)
};

// Colored segments output
type OutputLineSegments = {
  type: "output";
  segments: Segment[];
  delay?: number;
};

type Segment = {
  text: string;
  color?: AnsiColorType; // "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" and their "-bright" variants
  bg?: AnsiColorType;
};
```

**Example:**

```javascript
content = [
  { type: "input", text: "npm install" },
  { type: "output", text: "" },
  { type: "output", text: "added 50 packages in 2s", delay: 500 },
  {
    type: "output",
    segments: [
      { text: "✓", color: "green" },
      { text: " Done!" },
    ],
  },
];
```

## Styling

| Variable                                    | Default                            |
| ------------------------------------------- | ---------------------------------- |
| `--terminal-element-font-size`              | `14px`                             |
| `--terminal-element-box-shadow`             | `rgb(0 0 0 / 56%) 0 22px 70px 4px` |
| `--terminal-element-border-color`           | `#070707`                          |
| `--terminal-element-header-bg`              | `#323232`                          |
| `--terminal-element-header-border`          | `#6a6a6a`                          |
| `--terminal-element-header-border-bottom`   | `#6a6a6a`                          |
| `--terminal-element-header-directory-color` | `#afafb4`                          |
| `--terminal-element-body-bg`                | `#101317`                          |
| `--terminal-element-body-border`            | `#606060`                          |
| `--terminal-element-body-content-color`     | `#d4d4d4`                          |
| `--terminal-element-caret-color`            | `#fff`                             |
| `--terminal-element-ansi-black`             | `#14191e`                          |
| `--terminal-element-ansi-black-bright`      | `#676767`                          |
| `--terminal-element-ansi-red`               | `#b43c29`                          |
| `--terminal-element-ansi-red-bright`        | `#dc7974`                          |
| `--terminal-element-ansi-green`             | `#00c200`                          |
| `--terminal-element-ansi-green-bright`      | `#57e690`                          |
| `--terminal-element-ansi-yellow`            | `#c7c400`                          |
| `--terminal-element-ansi-yellow-bright`     | `#ece100`                          |
| `--terminal-element-ansi-blue`              | `#2743c7`                          |
| `--terminal-element-ansi-blue-bright`       | `#a6aaf1`                          |
| `--terminal-element-ansi-magenta`           | `#bf3fbd`                          |
| `--terminal-element-ansi-magenta-bright`    | `#e07de0`                          |
| `--terminal-element-ansi-cyan`              | `#00c5c7`                          |
| `--terminal-element-ansi-cyan-bright`       | `#5ffdff`                          |
| `--terminal-element-ansi-white`             | `#c7c7c7`                          |
| `--terminal-element-ansi-white-bright`      | `#feffff`                          |

## Contributing

- Bug fix PRs are always welcome.
- UI changes or new features should not be submitted without prior discussion. Please open an issue first to propose and discuss them.

Thanks for your understanding and contributions.

## License

[MIT](./LICENSE)
