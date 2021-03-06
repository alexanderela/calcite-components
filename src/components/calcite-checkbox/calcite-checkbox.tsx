import {
  Component,
  h,
  Prop,
  Event,
  Element,
  Host,
  EventEmitter,
  Listen,
  Watch
} from "@stencil/core";
import { getKey } from "../../utils/key";
import { hasLabel } from "../../utils/dom";

@Component({
  tag: "calcite-checkbox",
  styleUrl: "calcite-checkbox.scss",
  shadow: true
})
export class CalciteCheckbox {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteCheckboxElement;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  /** The checked state of the checkbox. */
  @Prop({ reflect: true, mutable: true }) checked?: boolean = false;

  @Watch("checked") checkedWatcher(newChecked: boolean) {
    newChecked ? this.input.setAttribute("checked", "") : this.input.removeAttribute("checked");
    this.calciteCheckboxChange.emit();
  }

  /** The hovered state of the checkbox. */
  @Prop({ reflect: true, mutable: true }) hovered = false;

  /** The focused state of the checkbox. */
  @Prop({ mutable: true, reflect: true }) focused = false;

  @Watch("focused") focusedChanged(focused: boolean) {
    if (focused && !this.el.hasAttribute("hidden")) {
      this.input.focus();
    } else {
      this.input.blur();
    }
    this.calciteCheckboxFocusedChange.emit();
  }

  /**
   * True if the checkbox is initially indeterminate,
   * which is independent from its checked state
   * https://css-tricks.com/indeterminate-checkboxes/
   * */
  @Prop({ reflect: true, mutable: true }) indeterminate?: boolean = false;

  /** The name of the checkbox input */
  @Prop({ reflect: true }) name?: string = "";

  /** The value of the checkbox input */
  @Prop({ reflect: true }) value?: string;

  /** specify the scale of the checkbox, defaults to m */
  @Prop({ reflect: true, mutable: true }) scale: "s" | "m" | "l" = "m";

  /** True if the checkbox is disabled */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** Determines what theme to use */
  @Prop({ reflect: true }) theme: "light" | "dark";

  //--------------------------------------------------------------------------
  //
  //  Private Properties
  //
  //--------------------------------------------------------------------------

  private readonly checkedPath = "M12.753 3l-7.319 7.497L3.252 8.31 2 9.373l3.434 3.434L14 4.24z";

  private readonly indeterminatePath = "M4 7h8v2H4z";

  private input: HTMLInputElement;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private getPath = (): string =>
    this.indeterminate ? this.indeterminatePath : this.checked ? this.checkedPath : "";

  private toggle = () => {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.focused = true;
      this.indeterminate = false;
    }
  };

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /** Emitted when the checkbox checked status changes */
  @Event() calciteCheckboxChange: EventEmitter;

  /** Emitted when the checkbox focused state changes */
  @Event() calciteCheckboxFocusedChange: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("calciteLabelFocus", { target: "window" }) handleLabelFocus(e) {
    if (!this.el.contains(e.detail.interactedEl) && hasLabel(e.detail.labelEl, this.el)) {
      this.toggle();
      this.el.focus();
    }
  }

  @Listen("click") onClick({ currentTarget, target }: MouseEvent) {
    // prevent duplicate click events that occur
    // when the component is wrapped in a label and checkbox is clicked
    if (
      (this.el.closest("label") && target === this.input) ||
      (!this.el.closest("label") && currentTarget === this.el)
    ) {
      this.toggle();
    }
  }

  @Listen("keydown") keyDownHandler(e: KeyboardEvent) {
    const key = getKey(e.key);
    if (key === " ") {
      e.preventDefault();
      this.toggle();
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

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback() {
    this.renderHiddenCheckboxInput();
    const scale = ["s", "m", "l"];
    if (!scale.includes(this.scale)) this.scale = "m";
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  private renderHiddenCheckboxInput() {
    this.input = document.createElement("input");
    this.checked && this.input.setAttribute("checked", "");
    this.input.disabled = this.disabled;
    this.input.onblur = () => (this.focused = false);
    this.input.onfocus = () => (this.focused = true);
    this.input.name = this.name;
    this.input.type = "checkbox";
    if (this.value) {
      this.input.value = this.value;
    }
    this.el.appendChild(this.input);
  }

  render() {
    return (
      <Host role="checkbox" aria-checked={this.checked.toString()}>
        <svg class="check-svg" viewBox="0 0 16 16">
          <path d={this.getPath()} />
        </svg>
        <slot />
      </Host>
    );
  }
}
