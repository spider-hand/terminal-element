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
    currentDirectory: "~/project",
    prompt: "$",
    content: [],
    animated: true,
    typingSpeed: 100,
    loop: true,
    delayAfterComplete: 2000,
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
      { type: "input", text: "pnpm run dev" },
      { type: "output", text: "" },
      {
        type: "output",
        text: "> terminal-element@0.0.0 dev /Users/...",
        delay: 500,
      },
      { type: "output", text: "> vite" },
      { type: "output", text: "" },
      {
        type: "output",
        text: "Port 5173 is in use, trying another one...",
        delay: 50,
      },
      { type: "output", text: "" },
      {
        type: "output",
        segments: [
          { text: "  VITE v8.0.1", color: "green-bright" },
          { text: "  ready in", color: "black-bright" },
          { text: " 100 ms" },
        ],
        delay: 300,
      },
      {
        type: "output",
        segments: [
          { text: "  ➜", color: "green-bright" },
          { text: "  Local:" },
          { text: "   http://localhost:5174/", color: "cyan-bright" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "  ➜", color: "green-bright" },
          { text: "  Network: use", color: "black-bright" },
          { text: " --host" },
          { text: " to expose", color: "black-bright" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "  ➜", color: "green-bright" },
          { text: "  press", color: "black-bright" },
          { text: " h + enter" },
          { text: " to show help", color: "black-bright" },
        ],
      },
    ],

    delayBeforeRestart: 2000,
    delayAfterComplete: 1000,
  },
};

export const Light: Story = {
  args: {
    theme: "light",

    content: [
      { type: "input", text: "pnpm run dev" },
      { type: "output", text: "" },
      {
        type: "output",
        text: "> terminal-element@0.0.0 dev /Users/...",
        delay: 500,
      },
      { type: "output", text: "> vite" },
      { type: "output", text: "" },
      {
        type: "output",
        text: "Port 5173 is in use, trying another one...",
        delay: 50,
      },
      { type: "output", text: "" },
      {
        type: "output",
        segments: [
          { text: "  VITE v8.0.1", color: "green" },
          { text: "  ready in", color: "black-bright" },
          { text: " 100 ms" },
        ],
        delay: 300,
      },
      {
        type: "output",
        segments: [
          { text: "  ➜", color: "green" },
          { text: "  Local:" },
          { text: "   http://localhost:5174/", color: "cyan" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "  ➜", color: "green" },
          { text: "  Network: use", color: "black-bright" },
          { text: " --host" },
          { text: " to expose", color: "black-bright" },
        ],
      },
      {
        type: "output",
        segments: [
          { text: "  ➜", color: "green" },
          { text: "  press", color: "black-bright" },
          { text: " h + enter" },
          { text: " to show help", color: "black-bright" },
        ],
      },
    ],

    animated: true,
    loop: true,
    delayAfterComplete: 2000,
    delayBeforeRestart: 1000,
  },
};
