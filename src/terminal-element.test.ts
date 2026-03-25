import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "./terminal-element";
import type { TerminalElement } from "./terminal-element";

describe("terminal-element", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

  it("renders the content for output type line with text field", async () => {
    const screen = render(
      html`<terminal-element
        .content=${[{ type: "output", text: "Plain output text" }] as const}
      ></terminal-element>`,
    );

    const element = screen.getByTestId("content");

    await expect.element(element).toHaveTextContent("Plain output text");
  });

  it("renders the line break for empty output line with segments", async () => {
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

  it("renders the line break for empty output line with text field", async () => {
    const screen = render(
      html`<terminal-element
        .content=${[
          { type: "output", text: "Line 1" },
          { type: "output", text: "" },
          { type: "output", text: "Line 3" },
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

  it("renders the content with color", async () => {
    const screen = render(
      html`<terminal-element
        .content=${[
          {
            type: "output",
            segments: [{ text: "colored", color: "red" }, { text: "normal" }],
          },
        ] as const}
      ></terminal-element>`,
    );

    const element = screen.getByTestId("content");
    await expect.element(element).toBeInTheDocument();

    const spans = element.element().querySelectorAll("span");

    expect(spans[0]).toHaveStyle({ color: "rgb(180, 60, 41)" });
    expect(spans[1]).toHaveStyle({ color: "rgb(212, 212, 212)" });
  });

  it("renders the content with background color", async () => {
    const screen = render(
      html`<terminal-element
        .content=${[
          {
            type: "output",
            segments: [{ text: "colored", bg: "red" }, { text: "normal" }],
          },
        ] as const}
      ></terminal-element>`,
    );

    const element = screen.getByTestId("content");
    await expect.element(element).toBeInTheDocument();

    const spans = element.element().querySelectorAll("span");

    expect(spans[0]).toHaveStyle({
      backgroundColor: "rgb(180, 60, 41)",
    });
    expect(spans[1]).toHaveStyle({ backgroundColor: "inherit" });
  });

  describe("updated", () => {
    it("restarts animation when content changes", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[{ type: "input", text: "1234567890" }] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      // Wait for animation to complete
      vi.advanceTimersByTime(1000);
      await el.updateComplete;

      // Verify first content is fully rendered
      const contentBefore = screen.getByTestId("content");
      await expect.element(contentBefore).toHaveTextContent("$ 1234567890");

      // Update content to trigger animation restart
      el.content = [{ type: "input", text: "0987654321" }];
      await el.updateComplete;

      // Run all pending timers to complete new animation
      vi.runAllTimers();
      await el.updateComplete;

      const content = screen.getByTestId("content");

      // Old content should be gone, new content should be fully rendered
      const text = content.element().textContent || "";
      expect(text).not.toContain("1234567890");
      await expect.element(content).toHaveTextContent("$ 0987654321");
    });

    it("does not restart animation when animation is disabled", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${false}
          .content=${[{ type: "input", text: "1234567890" }] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;

      // Update content
      el.content = [{ type: "input", text: "0987654321" }];
      await el.updateComplete;

      // Full content should be visible immediately
      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("$ 0987654321");
    });

    it("does not restart animation when content is not included in the changed properties", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[{ type: "input", text: "1234567890" }] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;

      // Advance animation to type some characters
      vi.advanceTimersByTime(200);
      await el.updateComplete;

      const contentBefore = screen
        .getByTestId("content")
        .element()
        .textContent?.trim();

      // Change a property
      el.theme = "light";
      await el.updateComplete;

      const contentAfter = screen
        .getByTestId("content")
        .element()
        .textContent?.trim();

      // Content should be the same before and after
      expect(contentAfter).toBe(contentBefore);
    });
  });

  describe("renderContent", () => {
    it("renders all content when animation is disabled", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${false}
          .content=${[
            { type: "input", text: "1234567890" },
            { type: "output", text: "0987654321" },
          ] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("$ 1234567890");
      await expect.element(content).toHaveTextContent("0987654321");
    });

    it("renders all content when animation is already completed", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[{ type: "input", text: "1234567890" }] as const}
        ></terminal-element>`,
      );

      // Wait for animation to complete
      vi.advanceTimersByTime(1000);
      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("$ 1234567890");

      // No caret after animation completes
      const caret = content
        .element()
        .querySelector(".terminal-element__body-caret");
      expect(caret).toBeNull();
    });

    it("renders only the visible content when animation is in progress", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[
            { type: "input", text: "1234567890" },
            { type: "output", text: "0987654321" },
          ] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      // Advance timers to show partial content
      vi.advanceTimersByTime(200);
      await el.updateComplete;

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("$ 123");

      // Should not show full content yet
      const text = content.element().textContent || "";
      expect(text).not.toContain("1234567890");
      expect(text).not.toContain("0987654321");

      // Should have caret (animation in progress)
      const caret = content
        .element()
        .querySelector(".terminal-element__body-caret");
      expect(caret).not.toBeNull();
    });
  });

  describe("renderFullContent", () => {
    it("renders input line with prompt and content", async () => {
      const screen = render(
        html`<terminal-element
          .content=${[{ type: "input", text: "echo hello" }] as const}
        ></terminal-element>`,
      );

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("$ echo hello");
    });

    it("renders output line with text", async () => {
      const screen = render(
        html`<terminal-element
          .content=${[{ type: "output", text: "Hello World" }] as const}
        ></terminal-element>`,
      );

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("Hello World");
    });

    it("renders output line with segments", async () => {
      const screen = render(
        html`<terminal-element
          .content=${[
            {
              type: "output",
              segments: [
                { text: "colored", color: "green" },
                { text: " normal" },
              ],
            },
          ] as const}
        ></terminal-element>`,
      );

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("colored normal");
    });
  });

  describe("renderPartialContent", () => {
    it("renders the line if it's before the current animated line", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[
            { type: "input", text: "1234567890" },
            { type: "input", text: "0987654321" },
          ] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      // Complete first line animation
      vi.advanceTimersByTime(1000);
      await el.updateComplete;

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("$ 1234567890");
    });

    it("renders the current animated line with typing effect", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[{ type: "input", text: "1234567890" }] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      const content = screen.getByTestId("content");
      const text = content.element().textContent || "";

      // Should not show full text yet as the animation just started
      expect(text).not.toContain("1234567890");
      // Should have caret
      const caret = content
        .element()
        .querySelector(".terminal-element__body-caret");
      expect(caret).not.toBeNull();
    });

    it("renders output line with delay immediately", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[
            { type: "input", text: "1234567890" },
            { type: "output", text: "0987654321", delay: 0 },
          ] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;

      // Complete input animation
      vi.advanceTimersByTime(1000);
      await el.updateComplete;

      // The next line should also be rendered immediately
      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("0987654321");
    });

    it("does not render output line while waiting for delay", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[
            { type: "input", text: "1234567890" },
            { type: "output", text: "0987654321", delay: 500 },
          ] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;

      // Complete input animation
      vi.advanceTimersByTime(1000);
      await el.updateComplete;

      const content = screen.getByTestId("content");
      const text = content.element().textContent?.trim();
      expect(text).not.toContain("0987654321");

      // Complete the delay for the output line
      vi.advanceTimersByTime(500);
      await el.updateComplete;

      await expect.element(content).toHaveTextContent("0987654321");
    });

    it("doesn't render the line if it's after the current animated line", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[
            { type: "input", text: "1234567890" },
            { type: "output", text: "0987654321" },
          ] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      // Second line should still not be rendered while the first line is animating
      const content = screen.getByTestId("content");
      const text = content.element().textContent?.trim();

      expect(text).not.toContain("0987654321");
    });
  });

  describe("renderFullLine", () => {
    it("renders input line with prompt and content", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[
            { type: "input", text: "1234567890" },
            { type: "input", text: "0987654321" },
          ] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      // Complete first line animation
      vi.advanceTimersByTime(1000);
      await el.updateComplete;

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("$ 1234567890");
    });

    it("renders output line with text", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[
            { type: "input", text: "1234567890" },
            { type: "output", text: "0987654321" },
            { type: "input", text: "1234567890" },
          ] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      // Complete first line animation
      vi.advanceTimersByTime(1000);
      await el.updateComplete;

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("0987654321");
    });

    it("renders output line with segments", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[
            { type: "input", text: "1234567890" },
            {
              type: "output",
              segments: [
                { text: "1234567890" },
                { text: "0987654321", color: "red" },
              ],
            },
            { type: "input", text: "1234567890" },
          ] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      // Complete first line animation
      vi.advanceTimersByTime(1000);
      await el.updateComplete;

      const content = screen.getByTestId("content");
      await expect.element(content).toHaveTextContent("1234567890");
      await expect.element(content).toHaveTextContent("0987654321");
    });
  });

  describe("renderPartialInputLine", () => {
    it("renders the visible part of the input line with prompt", async () => {
      const screen = render(
        html`<terminal-element
          .animated=${true}
          .typingSpeed=${100}
          .content=${[{ type: "input", text: "1234567890" }] as const}
        ></terminal-element>`,
      );

      const el = screen.container.querySelector(
        "terminal-element",
      ) as TerminalElement;
      await el.updateComplete;

      const content = screen.getByTestId("content");

      // Advance timers to show partial content
      vi.advanceTimersByTime(200);
      await el.updateComplete;

      // Should show prompt and partial text "123"
      await expect.element(content).toHaveTextContent("$ 123");

      // Should not show full text yet
      const text = content.element().textContent || "";
      expect(text).not.toContain("1234567890");

      // Should have caret
      const caret = content
        .element()
        .querySelector(".terminal-element__body-caret");
      expect(caret).not.toBeNull();
    });
  });

  it("restarts animation after delayAfterComplete and delayBeforeRestart", async () => {
    vi.useFakeTimers();

    const screen = render(
      html`<terminal-element
        .animated=${true}
        .typingSpeed=${100}
        .loop=${true}
        .delayAfterComplete=${500}
        .delayBeforeRestart=${300}
        .content=${[{ type: "input", text: "1234567890" }] as const}
      ></terminal-element>`,
    );

    const el = screen.container.querySelector(
      "terminal-element",
    ) as TerminalElement;
    await el.updateComplete;

    // Complete first animation
    vi.advanceTimersByTime(1000);
    await el.updateComplete;

    const content = screen.getByTestId("content");
    await expect.element(content).toHaveTextContent("$ 1234567890");

    // Wait for delayAfterComplete
    vi.advanceTimersByTime(500);
    await el.updateComplete;

    // Content should be empty during delayBeforeRestart
    const textDuringWait = content.element().textContent?.trim();
    expect(textDuringWait).toBe("");

    // Wait for delayBeforeRestart
    vi.advanceTimersByTime(300);
    await el.updateComplete;

    // Advance some time to show partial content of the restarted animation
    vi.advanceTimersByTime(200);
    await el.updateComplete;

    await expect.element(content).toHaveTextContent("$ 123");
  });

  it("keeps completed content visible during delayAfterComplete", async () => {
    vi.useFakeTimers();

    const screen = render(
      html`<terminal-element
        .animated=${true}
        .typingSpeed=${100}
        .loop=${true}
        .delayAfterComplete=${1000}
        .delayBeforeRestart=${500}
        .content=${[{ type: "input", text: "1234567890" }] as const}
      ></terminal-element>`,
    );

    const el = screen.container.querySelector(
      "terminal-element",
    ) as TerminalElement;
    await el.updateComplete;

    // Complete first animation
    vi.advanceTimersByTime(1000);
    await el.updateComplete;

    const content = screen.getByTestId("content");
    await expect.element(content).toHaveTextContent("$ 1234567890");

    // Advance some time during delayAfterComplete
    vi.advanceTimersByTime(500);
    await el.updateComplete;

    await expect.element(content).toHaveTextContent("$ 1234567890");
  });

  it("shows empty screen during delayBeforeRestart", async () => {
    vi.useFakeTimers();

    const screen = render(
      html`<terminal-element
        .animated=${true}
        .typingSpeed=${100}
        .loop=${true}
        .delayAfterComplete=${500}
        .delayBeforeRestart=${1000}
        .content=${[{ type: "input", text: "1234567890" }] as const}
      ></terminal-element>`,
    );

    const el = screen.container.querySelector(
      "terminal-element",
    ) as TerminalElement;
    await el.updateComplete;

    // Complete animation + delayAfterComplete
    vi.advanceTimersByTime(1000 + 500);
    await el.updateComplete;

    const content = screen.getByTestId("content");

    // Content should be empty
    const textDuringWait = content.element().textContent?.trim();
    expect(textDuringWait).toBe("");

    // Advance some time during delayBeforeRestart
    vi.advanceTimersByTime(500);
    await el.updateComplete;

    const textStillWaiting = content.element().textContent?.trim();
    expect(textStillWaiting).toBe("");
  });

  it("does not restart animation when loop is disabled", async () => {
    vi.useFakeTimers();

    const screen = render(
      html`<terminal-element
        .animated=${true}
        .typingSpeed=${100}
        .loop=${false}
        .content=${[{ type: "input", text: "1234567890" }] as const}
      ></terminal-element>`,
    );

    const el = screen.container.querySelector(
      "terminal-element",
    ) as TerminalElement;
    await el.updateComplete;

    // Complete animation
    vi.advanceTimersByTime(1000);
    await el.updateComplete;

    const content = screen.getByTestId("content");
    await expect.element(content).toHaveTextContent("$ 1234567890");

    // Wait additional time
    vi.advanceTimersByTime(5000);
    await el.updateComplete;

    // Content should remain complete
    await expect.element(content).toHaveTextContent("$ 1234567890");

    // No caret
    const caret = content
      .element()
      .querySelector(".terminal-element__body-caret");
    expect(caret).toBeNull();
  });
});
