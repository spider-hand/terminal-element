import { expect, test } from 'vitest'
import { render } from 'vitest-browser-lit'
import { html } from 'lit'
import './HelloWorld.js'

test('renders name', async () => {
  const screen = render(html`<hello-world name="Vitest"></hello-world>`)
  const element = screen.getByText('Hello Vitest!')
  await expect.element(element).toBeInTheDocument()
})
