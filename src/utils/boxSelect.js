class BoxSelect {
  constructor(el, options) {
    this.el = el;
    this.options = options;
  }

  getParentElement() {
    this.parentEl = this.el.parentNode;
    this.parentElData = {
      width: this.parentEl.clientWidth,
      height: this.parentEl.clientHeight,
    };
  }

  initBox() {
    this.boxHtml = `
    <div class="box-select-content">
      <span class="box-select-view" />
      <span class="box-select-move" />
      <span class="box-select-line line-l" />
      <span class="box-select-line line-r" />
      <span class="box-select-line line-t" />
      <span class="box-select-line line-b" />
      <span class="box-select-point point-l" />
      <span class="box-select-point point-r" />
      <span class="box-select-point point-t" />
      <span class="box-select-point point-b" />
      <span class="box-select-point point-lt" />
      <span class="box-select-point point-rt" />
      <span class="box-select-point point-lb" />
      <span class="box-select-point point-rb" />
    </div>
    `;
  }
}
