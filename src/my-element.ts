import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const cloudInstance = 'https://cloud-test.hdw.mx'
const dashboardPath = `${cloudInstance}/dashboard?devServer=http://localhost:3000/widget`

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'Lit Elements Starter'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    const isIframe = window.location !== window.parent.location

    const widget = html`
      <h1>Nx Widget ${this.name}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `

    const previewLink = html`
      <h1>Widget Running</h1>
      <a href=${dashboardPath} target="_widget_preview">
        Open Live Preview
      </a>
    `

    return isIframe ? widget : previewLink
  }

  private _onClick() {
    this.count++
  }

  foo(): string {
    return 'foo'
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
