import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "./terminal-element";

describe("terminal-element", () => {
  it("renders the default name", async () => {
    const screen = render(html`<terminal-element></terminal-element>`);

    const element = screen.getByTestId("name");

    await expect.element(element).toHaveTextContent("Terminal Element");
  });
});
