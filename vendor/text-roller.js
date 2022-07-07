/* eslint-disable */
window.TextRoller = (function () {
  // Helper functions
  function TextRoller (wrapper) {
    if (wrapper.children.length === 0) throw new Error('No child node found');

    this.wrapper = wrapper;
    this.element = wrapper.children[0];

    this.position = 0;
    this.speed = 50;

    this.element.style.position = 'relative';

    _refreshWidths.call(this);
    _setupChildren.call(this);
  }

  function getWidth (element) {
    var rect = element.getBoundingClientRect();
    return rect.right - rect.left;
  }

  // Private functions
  function _refreshWidths () {
    this.wrapperWidth = getWidth(this.wrapper);
    this.elementWidth = getWidth(this.wrapper.children[0]);
  }

  function _calculateNumElements () {
    return Math.ceil(this.wrapperWidth / this.elementWidth) + 1;
  }

  function _setupChildren () {
    var qty = _calculateNumElements.call(this);
    if (qty > this.wrapper.children.length) {
      for (var i = this.wrapper.children.length; i < qty; i++) {
        this.wrapper.appendChild(this.element.cloneNode(true));
      }
    } else if (qty < this.wrapper.children.length) {
      for (var i = qty; i < this.wrapper.children.length; i++) {
        this.wrapper.removeChild(this.wrapper.lastChild);
      }
    }
  }

  function _nextFrame (delta) {
    _refreshWidths.call(this);
    _setupChildren.call(this);

    var self = this;
    Array.prototype.forEach.call(this.wrapper.children, function (el) {
      el.style.left = -self.position + 'px';
    });

    this.position += this.speed * delta / 1000;

    if (this.position >= this.elementWidth) {
      this.position = this.position % this.elementWidth;
    }
  }

  TextRoller.prototype = {
    start: function () {
      this._running = true;
      var self = this;
      var last = null;
      var looper = function () {
        if (!self._running) return;
        var now = Date.now();
        var delta = last === null ? 0 : now - last;
        _nextFrame.call(self, delta);
        last = now;
        window.requestAnimationFrame(looper);
      };
      window.requestAnimationFrame(looper);
    },
    stop: function () {
      this._running = false;
    }
  };

  return TextRoller;
})();
