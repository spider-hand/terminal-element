import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./terminal-element";
import type { TerminalElementProps } from "./terminal-element";

const meta = {
  title: "TerminalElement",
  component: "terminal-element",
  tags: ["autodocs"],
  args: {
    width: "600px",
    height: "360px",
    theme: "dark",
    currentDirectory: "",
    prompt: "$",
    content: [],
    animated: true,
    typingSpeed: 100,
    loop: true,
    delayAfterComplete: 4000,
    delayBeforeRestart: 1000,
  },
  argTypes: {
    width: { control: "text" },
    height: { control: "text" },
    theme: { control: "select", options: ["dark", "light"] },
    currentDirectory: { control: "text" },
    prompt: { control: "text" },
    content: { control: "object" },
    animated: { control: "boolean" },
    typingSpeed: { control: "number" },
    loop: { control: "boolean" },
    delayAfterComplete: { control: "number" },
    delayBeforeRestart: { control: "number" },
  },
} satisfies Meta<TerminalElementProps>;

export default meta;

type Story = StoryObj<TerminalElementProps>;

export const Default: Story = {};

export const Dark: Story = {
  args: {
    theme: "dark",

    content: [
      { type: "input", text: "pnpm run test" },
      { type: "output", text: "" },
      {
        type: "output",
        delay: 500,
        segments: [
          { text: " RUN ", color: "black", bg: "cyan" },
          { text: " v4.1.0 ", color: "cyan" },
          { text: "/Users/terminal-element", color: "black-bright" },
        ],
      },
      { type: "output", text: "" },
      {
        type: "output",
        segments: [
          {
            text: "stderr | unknown test",
            color: "black-bright",
          },
        ],
      },
      {
        type: "output",
        text: "Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.",
      },
      {
        type: "output",
        delay: 500,
        segments: [
          { text: " ✓ ", color: "green" },
          { text: " chromium ", color: "black", bg: "yellow" },
          { text: " src/terminal-element.test.ts " },
          { text: "(2 tests | ", color: "black-bright" },
          { text: "1 skipped", color: "yellow" },
          { text: ") " },
          { text: "5ms", color: "green" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "   ✓ ", color: "green" },
          { text: "terminal-element (1)" },
        ],
      },
      {
        type: "output",
        delay: 100,
        segments: [
          { text: "     ✓ ", color: "green" },
          { text: "first " },
          { text: "6ms", color: "green" },
        ],
      },
      { type: "output", text: "     ↓ second" },
      { type: "output", text: "" },
      {
        type: "output",
        segments: [
          { text: " Test Files  ", color: "black-bright" },
          { text: "1 passed ", color: "green" },
          { text: "(1)", color: "black-bright" },
        ],
      },
      {
        type: "output",
        delay: 100,
        segments: [
          { text: "      Tests  ", color: "black-bright" },
          { text: "1 passed ", color: "green" },
          { text: "| ", color: "black-bright" },
          { text: "1 skipped ", color: "yellow" },
          { text: "(2)", color: "black-bright" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "   Start at  ", color: "black-bright" },
          { text: "01:23:45" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "   Duration  ", color: "black-bright" },
          { text: "1.23s" },
          {
            text: " (transform 0ms, setup 0ms, import 45ms, tests 6ms, environment 0ms)",
            color: "black-bright",
          },
        ],
      },
    ],

    delayAfterComplete: 4000,
    delayBeforeRestart: 1000,
  },
};

export const Light: Story = {
  args: {
    theme: "light",
    content: [
      { type: "input", text: "pnpm run test" },
      { type: "output", text: "" },
      {
        type: "output",
        delay: 500,
        segments: [
          { text: " RUN ", color: "black", bg: "cyan" },
          { text: " v4.1.0 ", color: "cyan" },
          { text: "/Users/terminal-element", color: "black-bright" },
        ],
      },
      { type: "output", text: "" },
      {
        type: "output",
        segments: [
          {
            text: "stderr | unknown test",
            color: "black-bright",
          },
        ],
      },
      {
        type: "output",
        text: "Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.",
      },
      {
        type: "output",
        delay: 500,
        segments: [
          { text: " ✓ ", color: "green" },
          { text: " chromium ", color: "black", bg: "yellow" },
          { text: " src/terminal-element.test.ts " },
          { text: "(2 tests | ", color: "black-bright" },
          { text: "1 skipped", color: "yellow" },
          { text: ") " },
          { text: "5ms", color: "green" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "   ✓ ", color: "green" },
          { text: "terminal-element (1)" },
        ],
      },
      {
        type: "output",
        delay: 100,
        segments: [
          { text: "     ✓ ", color: "green" },
          { text: "first " },
          { text: "6ms", color: "green" },
        ],
      },
      { type: "output", text: "     ↓ second" },
      { type: "output", text: "" },
      {
        type: "output",
        delay: 100,
        segments: [
          { text: " Test Files  ", color: "black-bright" },
          { text: "1 passed ", color: "green" },
          { text: "(1)", color: "black-bright" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "      Tests  ", color: "black-bright" },
          { text: "1 passed ", color: "green" },
          { text: "| ", color: "black-bright" },
          { text: "1 skipped ", color: "yellow" },
          { text: "(2)", color: "black-bright" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "   Start at  ", color: "black-bright" },
          { text: "01:23:45" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "   Duration  ", color: "black-bright" },
          { text: "1.23s" },
          {
            text: " (transform 0ms, setup 0ms, import 45ms, tests 6ms, environment 0ms)",
            color: "black-bright",
          },
        ],
      },
    ],
    animated: true,
    loop: true,
    delayAfterComplete: 4000,
    delayBeforeRestart: 1000,
  },
};

// Inspired by Bubble Tea demo:
// @see: https://github.com/charmbracelet/bubbletea
export const BubbleTea: Story = {
  args: {
    theme: "dark",
    prompt: [
      { text: "thunderclap:", color: "cyan" },
      { text: "~ ", color: "red" },
      { text: "christian ", color: "cyan" },
      { text: "$", color: "red" },
    ],
    content: [
      {
        type: "input",
        text: "./demo",
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        text: "  What to do today?",
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        color: "magenta-bright",
        text: "  [x] Plant carrots",
      },
      {
        type: "output",
        text: "  [ ] Go to the market",
      },
      {
        type: "output",
        text: "  [ ] Read something",
      },
      {
        type: "output",
        text: "  [ ] See friends",
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        segments: [
          {
            text: "  Program quits in ",
          },
          {
            text: "10 ",
            color: "green-bright",
          },
          {
            text: "seconds",
          },
        ],
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        text: "  j/k, up/down: select   enter: choice   q: esc: quit",
        color: "black-bright",
      },
      {
        type: "erase",
        count: 10,
        delay: 2000,
      },
      {
        type: "output",
        text: "  Carrot planting?",
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        segments: [
          {
            text: "  Cool, we'll need ",
          },
          {
            text: "libgarden ",
            color: "magenta-bright",
          },
          {
            text: "and ",
          },
          {
            text: "vegeutils",
            color: "magenta-bright",
          },
          {
            text: "...",
          },
        ],
      },
      {
        type: "output",
        text: "",
      },
      {
        type: "output",
        text: "  Downloading...",
      },
    ],
    animated: true,
    loop: true,
    delayAfterComplete: 4000,
    delayBeforeRestart: 1000,
  },
};
