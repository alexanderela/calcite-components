import {
  Component,
  Host,
  h,
  Listen,
  Prop,
  Element,
  Watch,
  Event,
  EventEmitter
} from "@stencil/core";
import { guid } from "../../utils/guid";

@Component({
  tag: "calcite-radio-button",
  styleUrl: "calcite-radio-button.scss",
  shadow: true
})
export class CalciteRadioButton {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteRadioButtonElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** The checked state of the radio button. */
  @Prop({ mutable: true, reflect: true }) checked = false;

  @Watch("checked")
  checkedChanged(newChecked: boolean, oldChecked: boolean) {
    if (newChecked === true && oldChecked === false) {
      this.uncheckOtherRadioButtonsInGroup();
    }
    this.input.checked = newChecked;
    this.calciteRadioButtonChange.emit();
  }

  /** The disabled state of the radio button. */
  @Prop({ reflect: true }) disabled?: boolean = false;

  @Watch("disabled")
  disabledChanged(disabled: boolean) {
    this.input.disabled = disabled;
  }

  /** The focused state of the radio button. */
  @Prop({ mutable: true, reflect: true }) focused = false;

  @Watch("focused")
  focusedChanged(focused: boolean) {
    if (focused && !this.el.hasAttribute("hidden")) {
      this.input.focus();
    } else {
      this.input.blur();
    }
    this.calciteRadioButtonFocusedChange.emit();
  }

  /** The id attribute of the radio button.  When omitted, a globally unique identifier is used. */
  @Prop({ reflect: true }) guid: string = this.el.id || `calcite-radio-button-${guid()}`;

  /** The radio button's hidden status.  When a radio button is hidden it is not focusable or checkable. */
  @Prop({ reflect: true }) hidden = false;

  @Watch("hidden")
  hiddenChanged(newHidden: boolean) {
    this.input.hidden = newHidden;
  }

  /** The hovered state of the radio button. */
  @Prop({ reflect: true, mutable: true }) hovered = false;

  /** The name of the radio button.  <code>name</code> is passed as a property automatically from <code>calcite-radio-button-group</code>. */
  @Prop({ reflect: true }) name!: string;

  @Watch("name")
  nameChanged(newName: string) {
    this.input.name = newName;
  }

  /** Requires that a value is selected for the radio button group before the parent form will submit. */
  @Prop({ reflect: true }) required = false;

  @Watch("required")
  requiredChanged(required: boolean) {
    this.input.required = required;
  }

  /** The scale (size) of the radio button.  <code>scale</code> is passed as a property automatically from <code>calcite-radio-button-group</code>. */
  @Prop({ mutable: true, reflect: true }) scale: "s" | "m" | "l" = "m";

  @Watch("scale")
  validateScale(newScale: string) {
    const scales = ["s", "m", "l"];
    if (!scales.includes(newScale)) this.scale = "m";
  }

  /** The color theme of the radio button, <code>theme</code> is passed as a property automatically from <code>calcite-radio-button-group</code>. */
  @Prop({ mutable: true, reflect: true }) theme: "light" | "dark" = "light";

  @Watch("theme")
  validateTheme(newTheme: string) {
    const themes = ["light", "dark"];
    if (!themes.includes(newTheme)) this.theme = "light";
  }

  /** The value of the radio button. */
  @Prop({ reflect: true }) value!: string;

  //--------------------------------------------------------------------------
  //
  //  Private Properties
  //
  //--------------------------------------------------------------------------

  private input: HTMLInputElement;

  private titleAttributeObserver: MutationObserver;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private checkFirstRadioButton() {
    const radioButtons = document.querySelectorAll(`calcite-radio-button[name=${this.name}]`);
    let firstCheckedRadioButton: HTMLCalciteRadioButtonElement;
    if (radioButtons && radioButtons.length > 0) {
      radioButtons.forEach((radioButton: HTMLCalciteRadioButtonElement) => {
        if (firstCheckedRadioButton) {
          radioButton.checked = false;
        } else if (radioButton.checked) {
          firstCheckedRadioButton = radioButton;
        }
        return radioButton;
      });
    }
  }

  private setupTitleAttributeObserver() {
    this.titleAttributeObserver = new MutationObserver(() => {
      this.input.title = this.el.getAttribute("title");
    });
    this.titleAttributeObserver.observe(this.el, {
      attributes: true,
      attributeFilter: ["title"]
    });
  }

  private uncheckOtherRadioButtonsInGroup() {
    const otherRadioButtons = document.querySelectorAll(
      `calcite-radio-button[name=${this.name}]:not([guid="${this.guid}"])`
    );
    otherRadioButtons.forEach((otherRadioButton: HTMLCalciteRadioButtonElement) => {
      if (otherRadioButton.checked) {
        otherRadioButton.checked = false;
      }
    });
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  @Event()
  calciteRadioButtonChange: EventEmitter;

  @Event()
  calciteRadioButtonFocusedChange: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("click")
  check() {
    if (!this.disabled && !this.hidden) {
      this.uncheckOtherRadioButtonsInGroup();
      this.focused = true;
      this.checked = true;
    }
  }

  @Listen("mouseenter")
  mouseenter() {
    this.hovered = true;
  }

  @Listen("mouseleave")
  mouseleave() {
    this.hovered = false;
  }

  onInputBlur() {
    this.focused = false;
  }

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback() {
    this.renderHiddenRadioInput();
    this.setupTitleAttributeObserver();
  }

  componentWillLoad() {
    this.validateScale(this.scale);
    this.validateTheme(this.theme);
    if (this.name) {
      this.checkFirstRadioButton();
    }
  }

  componentDidLoad() {
    if (this.name) {
      this.checkFirstRadioButton();
    }
  }

  disconnectedCallback() {
    this.input.parentNode.removeChild(this.input);
    this.titleAttributeObserver.disconnect();
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  private renderHiddenRadioInput() {
    // Rendering a hidden radio input outside Shadow DOM so it can participate in form submissions
    // @link https://www.hjorthhansen.dev/shadow-dom-form-participation/
    this.input = this.el.ownerDocument.createElement("input");
    this.input.setAttribute("aria-label", this.value || this.guid);
    this.input.checked = this.checked;
    this.input.disabled = this.disabled;
    this.input.hidden = this.hidden;
    this.input.id = this.guid;
    if (this.name) {
      this.input.name = this.name;
    }
    this.input.onfocus = this.check.bind(this);
    this.input.onblur = this.onInputBlur.bind(this);

    // We're using option #3 explained here to hide the radio input without compromising accessibility
    // @link https://blog.bitsrc.io/customise-radio-buttons-without-compromising-accessibility-b03061b5ba93
    // The only difference is we're using "fixed" instead of "absolute" positioning thanks to this StackOverflow:
    // @link https://stackoverflow.com/questions/24299567/radio-button-causes-browser-to-jump-to-the-top/24323870
    this.input.style.opacity = "0";
    this.input.style.position = "fixed";
    this.input.style.zIndex = "-1";

    if (this.value) {
      this.input.value = this.value;
    }
    this.input.required = this.required;

    if (this.el.getAttribute("title")) {
      this.input.title = this.el.getAttribute("title");
    } else if (this.name && this.value) {
      this.input.title = `Radio button with name of ${this.name} and value of ${this.value}`;
    } else {
      this.input.title = this.guid;
    }

    this.input.type = "radio";
    this.el.insertAdjacentElement("beforeend", this.input);
  }

  render() {
    const hasLabel = this.el.textContent ? true : false;
    return (
      <Host
        aria-checked={this.checked.toString()}
        aria-disabled={this.disabled}
        class={{ hasLabel }}
      >
        <div class="radio"></div>
        {hasLabel ? (
          <calcite-label dir={document.documentElement.getAttribute("dir")} scale={this.scale}>
            <slot />
          </calcite-label>
        ) : (
          <slot />
        )}
      </Host>
    );
  }
}
