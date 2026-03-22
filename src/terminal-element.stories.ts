import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

import "./terminal-element";

interface Args {
  width: string;
  height: string;
  theme: "dark" | "light";
  currentDirectory: string;
  prompt: string;
  content: string;
}

const meta = {
  title: "Components/TerminalElement",
  tags: ["autodocs"],
  render: (args: Args) => html`
    <terminal-element
      width=${args.width}
      height=${args.height}
      theme=${args.theme}
      currentDirectory=${args.currentDirectory}
      prompt=${args.prompt}
      content=${args.content}
    ></terminal-element>
  `,
  args: {
    width: "600px",
    height: "360px",
    theme: "dark",
    currentDirectory: "~/project",
    prompt: "$",
    content: "Hello, world!",
  },
  argTypes: {
    width: { control: "text" },
    height: { control: "text" },
    theme: { control: "select", options: ["dark", "light"] },
    currentDirectory: { control: "text" },
    prompt: { control: "text" },
    content: { control: "text" },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const Light: Story = {
  args: {
    theme: "light",
  },
};
