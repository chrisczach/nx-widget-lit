import { SharedWidgetState, System } from 'dashboard-widget-state'
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
@customElement('nx-lit-widget')
export class NxLitWidget extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
    .systems-list {
      border: 1px solid blue;
      padding: 0px 4px 24px 4px;
    }
    .system-tile {
      padding: 8px 16px;
      margin: 4px;
      border: 1px solid black;
      cursor: pointer;
    }
  `

  @property()
  name = 'Lit Elements Starter'

  @property({ type: SharedWidgetState })
  sharedState: SharedWidgetState | null = null;

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  @property()
  systems = [] as System[]

  @property()
  navigatingMessage = ''

  subscriptions = [] as any[]
  editMode = (window as any).editMode

  async connectedCallback() {
    super.connectedCallback()
    const getState = () =>
      new Promise<SharedWidgetState>((resolve) => {
        const stateChecker = setInterval(() => {
          const stateObject = (window as any).sharedState as SharedWidgetState;
          if (stateObject) {
            resolve(stateObject)
            clearInterval(stateChecker);
            this.subscriptions.push(stateObject.state$.subscribe((val: number) => {
              this.count = val;
            }));
            this.subscriptions.push(stateObject.systems$.subscribe((val: System[]) => {
              this.systems = val;
            }));
            resolve(stateObject);
          }
        }, 10);
      })
    this.sharedState = await getState()
    console.log('connected')
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  navigateSystem = (system: System) => () => {
    this.sharedState?.navigateByUrl(`/systems/${system.id}`)
    this.navigatingMessage = `Navigating to "${system.name}" system`
  }


  render() {
    const isIframe = window.location !== window.parent.location

    const widget = this.sharedState ? html`
      <h1>Nx Widget ${this.name}!</h1>
      <h2>${this.editMode ? 'Edit Mode' : 'Widget Mode'}</h2>
      <button @click=${() => this.sharedState?.increment()} part="button">Increment</button>
      <button @click=${() => this.sharedState?.decrement()} part="button">Decrement</button>
      <h2>Shared state from cloud portal: ${this.count}</h2>
      <div class="systems-list">
      <h2>Systems from cloud portal</h2>
      ${this.navigatingMessage ? html`<h3>${this.navigatingMessage}</h3>` : this.systems.map((system) => html`<a class="system-tile" @click=${this.navigateSystem(system)}>${system.name}</a>`)}
      </div>
    ` : html`<h1>Loading</h1>`

    const previewLink = html`
      <h1>Widget Running</h1>
      <a href=${dashboardPath} target="_widget_preview">
        Open Live Preview
      </a>
    `

    return isIframe ? widget : previewLink
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': NxLitWidget
  }
}
