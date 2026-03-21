import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

import "./terminal-element";

const meta = {
  title: "Components/TerminalElement",
  tags: ["autodocs"],
  render: () => html`<terminal-element></terminal-element>`,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
