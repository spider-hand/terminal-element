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

  it("renders the prompt and the content for input type line", async () => {
    const screen = render(
      html`<terminal-element
        .content=${[{ type: "input", text: "Hello, World!" }] as const}
      ></terminal-element>`,
    );

    const element = screen.getByTestId("content");

    await expect.element(element).toHaveTextContent("$ Hello, World!");
  });

  it("renders the content for output type line", async () => {
    const screen = render(
      html`<terminal-element
        .content=${[
          { type: "output", segments: [{ text: "Output text" }] },
        ] as const}
      ></terminal-element>`,
    );

    const element = screen.getByTestId("content");

    await expect.element(element).toHaveTextContent("Output text");
  });

  it("renders the line break for empty output line", async () => {
    const screen = render(
      html`<terminal-element
        .content=${[
          { type: "output", segments: [{ text: "Line 1" }] },
          { type: "output", segments: [] },
          { type: "output", segments: [{ text: "Line 3" }] },
        ] as const}
      ></terminal-element>`,
    );

    const element = screen.getByTestId("content");
    await expect.element(element).toBeInTheDocument();

    const lines = element
      .element()
      .querySelectorAll(".terminal-element__body-line");

    expect(lines.length).toBe(3);
    await expect.element(element).toHaveTextContent("Line 1");
    await expect.element(element).toHaveTextContent("Line 3");
  });

  it("renders the content with color and highlight", async () => {
    const screen = render(
      html`<terminal-element
        .content=${[
          {
            type: "output",
            segments: [
              { text: "colored", color: "var(--terminal-element-ansi-red)" },
              { text: "bold", highlight: true },
            ],
          },
        ] as const}
      ></terminal-element>`,
    );

    const element = screen.getByTestId("content");
    await expect.element(element).toBeInTheDocument();

    const spans = element.element().querySelectorAll("span");

    expect(spans[0]).not.toHaveStyle({ color: "inherit" });
    expect(spans[1]).toHaveStyle({ fontWeight: "700" });
  });
});
