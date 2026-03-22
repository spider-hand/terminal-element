import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "./terminal-element";

describe("terminal-element", () => {
  it("renders with default width and height", async () => {
    const screen = render(html`<terminal-element></terminal-element>`);

    const element = screen.getByTestId("terminal-element");

    await expect.element(element).toHaveStyle({
      width: "600px",
      height: "360px",
    });
  });

  it("renders with the specified width and height", async () => {
    const screen = render(
      html`<terminal-element width="400px" height="300px"></terminal-element>`,
    );

    const element = screen.getByTestId("terminal-element");

    await expect.element(element).toHaveStyle({
      width: "400px",
      height: "300px",
    });
  });

  it("renders the current directory", async () => {
    const screen = render(
      html`<terminal-element currentDirectory="~/project"></terminal-element>`,
    );

    const element = screen.getByTestId("current-directory");

    await expect.element(element).toHaveTextContent("~/project");
  });

  it("renders the prompt and the content", async () => {
    const screen = render(
      html`<terminal-element content="Hello, World!"></terminal-element>`,
    );

    const element = screen.getByTestId("content");

    await expect.element(element).toHaveTextContent("$ Hello, World!");
  });
});
