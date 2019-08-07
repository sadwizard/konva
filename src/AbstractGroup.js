(function(Konva) {
  'use strict';
  /**
     * AbstractGroup constructor.  AbstractGroup are used to contain shapes or other groups and doesn't draw them.
     * @constructor
     * @memberof Konva
     * @augments Konva.Container
     * @param {Object} config
     * @@nodeParams
     * @@containerParams
     */
  Konva.AbstractGroup = function(config) {
    this.___init(config);
  };

  Konva.Util.addMethods(Konva.AbstractGroup, {
    ___init: function(config) {
      this.linksChildren = new Konva.Collection();
      this.nodeType = 'AbstractGroup';
      Konva.Container.call(this, config);
      this.opacity(0);
    },
    _validateAdd: function(child) {
      var type = child.getType();
      if (type !== 'Group' && type !== 'Shape') {
        Konva.Util.throw('You may only add groups and shapes to groups.');
      }
    },
    add: function(child) {
      if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
          this.add(arguments[i]);
        }
        return this;
      }
      var ch = child.clone();

      if (ch.getParent()) {
        ch.moveTo(this);
        return this;
      }

      var children = this.children;
      this._validateAdd(ch);
      ch.index = children.length;
      ch.parent = this;
      child.abstractParent = this;
      children.push(ch);
      this.linksChildren.push(child);
      this._fire('add', {
        child: ch
      });

      // chainable
      return this;
    },
    /**
     * remove all children and links
     * @method
     * @name Konva.AbstractGroup#removeChildren
     */
    removeChildren: function() {
      Konva.Container.prototype.removeChildren.call(this);

      var child;
      for (var i = 0; i < this.linksChildren.length; i++) {
        child = this.linksChildren[i];
        // reset parent to prevent many _setChildrenIndices calls
        child.abstractParent = null;
      }

      this.linksChildren = new Konva.Collection();
      return this;
    },
    drawScene: function() {
      var self = this;
      this.children.each(function(item, i) {
        var at = item.getAbsoluteTransform().copy();
        var dec = Konva.Util._decompose2dMatrix(at.m);
        var r = dec.rotation * 180 / Math.PI;
        var c = self.linksChildren[i];

        c.x(dec.translation[0]);
        c.y(dec.translation[1]);
        c.width(item.width() * dec.scale[0]);
        c.height(item.height() * dec.scale[1]);
        c.rotation(r);
      });

      return this;
    },
    drawHit: function() {
      return this;
    },
    update: function() {
      return this;
    }
  });
  Konva.Util.extend(Konva.AbstractGroup, Konva.Container);

  // add getters and setters
  // Konva.Factory.addGetterSetter(Konva.AbstractGroup, 'visible', false);

  Konva.Collection.mapMethods(Konva.AbstractGroup);
})(Konva);