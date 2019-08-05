import { Util, Collection } from './Util';
import { Container, ContainerConfig } from './Container';
import { _registerNode } from './Global';
import { Node, NodeConfig } from './Node';
import { Shape } from './Shape';
import { Factory } from './Factory';

/**
 * AbstractGroup constructor.  AbstractGroup are used to contain shapes or other groups and doesn't draw them.
 * @constructor
 * @memberof Konva
 * @augments Konva.Container
 * @param {Object} config
 * @@nodeParams
 * @@containerParams
 * @example
 * var group = new Konva.AbstractGroup();
 */
export class AbstractGroup extends Container<Node> {
  // linksChildren?: Array<Node>;
  linksChildren = new Collection<Node>();

  constructor(attrs) {
  	super(attrs);
  }

  _validateAdd(child: Node) {
    var type = child.getType();
    if (type !== 'Group' && type !== 'Shape') {
      Util.throw('You may only add groups and shapes to groups.');
    }
  }

  /**
   * add a child and children into AbstractGroup
   * @name Konva.AbstractGroup#add
   * @method
   * @param {...Konva.Node} child
   * @returns {AbstractGroup}
   * @example
   * layer.add(rect);
   * layer.add(shape1, shape2, shape3);
   * // remember to redraw layer if you changed something
   * layer.draw();
   */
  add(child: Node) {
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
  }

  /**
   * remove all children and links
   * @method
   * @name Konva.AbstractGroup#removeChildren
   */
  removeChildren() {
  	return this;
  }

  drawScene() {
	var self = this;
	this.children.each(function(item, i) {
		var at = item.getAbsoluteTransform().copy();
		var dec = Util._decompose2dMatrix(at.m);
		var r = dec.rotation * 180 / Math.PI;
		var c = self.linksChildren[i];

		c.x(dec.translation[0]);
		c.y(dec.translation[1]);
		c.width(item.width() * dec.scale[0]);
		c.height(item.height() * dec.scale[1]);
		c.rotation(r);
	});

    return this;
  }

  drawHit() {
    return this;
  }
}

AbstractGroup.prototype.nodeType = 'AbstractGroup';
_registerNode(AbstractGroup);

/**
 * get/set fill linear gradient start point y
 * @name Konva.Shape#fillLinearGradientStartPointY
 * @method
 * @param {Number} y
 * @returns {Number}
 * @example
 * // get fill linear gradient start point y
 * var startPointY = shape.fillLinearGradientStartPointY();
 *
 * // set fill linear gradient start point y
 * shape.fillLinearGradientStartPointY(20);
 */

Factory.addGetterSetter(AbstractGroup, 'visible', false);

Collection.mapMethods(AbstractGroup);
