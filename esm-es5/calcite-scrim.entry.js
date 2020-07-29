import { r as registerInstance, h, H as Host } from './index-6a6cba1d.js';
var CSS = {
    scrim: "scrim",
    content: "content",
};
var calciteScrimCss = ":host([hidden]){display:none}:host{display:-ms-flexbox;display:flex;position:relative;pointer-events:none;--calcite-scrim-background:rgba(255, 255, 255, 0.75)}:host([theme=dark]){--calcite-scrim-background:rgba(0, 0, 0, 0.75)}@-webkit-keyframes calcite-scrim-fade-in{0%{opacity:0}100%{opacity:1}}@keyframes calcite-scrim-fade-in{0%{opacity:0}100%{opacity:1}}.scrim{-ms-flex-align:center;align-items:center;-webkit-animation:calcite-scrim-fade-in 250ms ease-in-out;animation:calcite-scrim-fade-in 250ms ease-in-out;background-color:var(--calcite-scrim-background);bottom:0;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;left:0;position:absolute;right:0;top:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:2}.content{position:relative;z-index:1;color:var(--calcite-ui-text-2)}";
var CalciteScrim = /** @class */ (function () {
    function CalciteScrim(hostRef) {
        registerInstance(this, hostRef);
        // --------------------------------------------------------------------------
        //
        //  Properties
        //
        // --------------------------------------------------------------------------
        /**
         * Determines if the component will have the loader overlay.
         * Otherwise, will render opaque disabled state.
         */
        this.loading = false;
    }
    // --------------------------------------------------------------------------
    //
    //  Render Method
    //
    // --------------------------------------------------------------------------
    CalciteScrim.prototype.render = function () {
        var loaderNode = this.loading ? (h("calcite-loader", { active: true })) : null;
        var scrimNode = h("div", { class: CSS.scrim }, loaderNode);
        var contentNode = (h("div", { class: CSS.content }, h("slot", null)));
        return (h(Host, null, scrimNode, contentNode));
    };
    return CalciteScrim;
}());
CalciteScrim.style = calciteScrimCss;
export { CalciteScrim as calcite_scrim };
