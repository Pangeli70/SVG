/** -----------------------------------------------------------------------
 * @module [SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.5.1 [APG 2021/02/21]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/24] Github beta
 * -----------------------------------------------------------------------
 */

import { A2D } from "../../deps.ts";

import { eApgSvgCoordType } from "../enums/eApgSvgCoordType.ts";
import { eApgSvgNodeTypes } from "../enums/eApgSvgNodeTypes.ts";
import { ApgSvgNode } from "./ApgSvgNode.ts";
import { ApgSvgStyle } from "./ApgSvgStyle.ts";


const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = DEFAULT_WIDTH / 16 * 9;

const DEFAULT_VIEWBOX_WIDTH = 10000;
const DEFAULT_VIEWBOX_HEIGHT = DEFAULT_VIEWBOX_WIDTH / 16 * 9;

export class ApgSvgDoc {

  private _width: number = DEFAULT_WIDTH;
  private _height: number = DEFAULT_HEIGHT;

  private _viewBoxX = 0;
  private _viewBoxY = 0;

  private _viewBoxWidth = DEFAULT_VIEWBOX_WIDTH;
  private _viewBoxHeight = DEFAULT_VIEWBOX_HEIGHT;

  public title = "ApgSvgDoc";
  public description = "Default description";

  private _rootNode: ApgSvgNode;
  private _nodes: Map<string, ApgSvgNode> = new Map();
  private _defs: Map<string, ApgSvgNode> = new Map();
  private _styles: Map<string, ApgSvgStyle> = new Map();

  private _idCounter = 1;

  private _viewBoxHasBackground = false;

  constructor(
    aw: number = DEFAULT_WIDTH,
    ah: number = DEFAULT_HEIGHT,
    aviewBoxHasBackground = true,
  ) {
    const NODE_ID = "Apg_Svg_Root_Node"

    this._width = aw;
    this._height = ah;
    this._viewBoxHasBackground = aviewBoxHasBackground;
    this._rootNode = this.group(NODE_ID);
  }

  setViewbox(ax: number, ay: number, aw: number, ah: number) {
    this._viewBoxX = ax;
    this._viewBoxY = ay;
    this._viewBoxWidth = aw;
    this._viewBoxHeight = ah;
    this._rootNode.move(0, -this._viewBoxY);
    this.#viewBoxBackground();
  }

  #y(ay: number): number {
    //return this.viewboxHeight - ay;
    return -ay;
  }

  #nextID(aid: string, atype: string): string {
    let r = aid;
    let noID = false;
    if (aid === "") {
      noID = true;
    } else if (this._nodes.has(aid)) {
      noID = true;
    }
    if (noID) {
      r = atype + "-" + this._idCounter.toString();
    }
    return r;
  }

  #addNode(anode: ApgSvgNode) {
    this._idCounter++;
    this._nodes.set(anode.ID, anode);
  }

  #coordFromViewBoxPerc(aperc: number, atype: eApgSvgCoordType) {
    if (aperc < 0 || aperc > 1) {
      throw new Error(`Percentage out of range ${aperc}`);
    }
    switch (atype) {
      case eApgSvgCoordType.x:
        return this._viewBoxWidth * aperc + this._viewBoxX;
      case eApgSvgCoordType.y:
        return this._viewBoxHeight * aperc + this._viewBoxY;
      case eApgSvgCoordType.w:
        return this._viewBoxWidth * aperc;
      case eApgSvgCoordType.h:
        return this._viewBoxHeight * aperc;
    }
  }

  group(aid = ""): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.Group;
    r.tag = "g";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    this.#addNode(r);
    return r;
  }

  addToRoot(anode: ApgSvgNode) {
    this._rootNode.addChild(anode);
  }

  addToDefs(anode: ApgSvgNode) {
    this._defs.set(anode.ID, anode);
  }

  addToStyles(astyle: ApgSvgStyle) {
    this._styles.set(astyle.ID, astyle);
  }


  #viewBoxBackground() {
    const ID = "APG_SVG_DOC_VIEWBOX_BACKGROUND";

    if (this._viewBoxHasBackground) {

      const background = this.rect(
        this._viewBoxX,
        this._viewBoxY,
        this._viewBoxWidth,
        this._viewBoxHeight,
        ID,
      );
      background.fill('#FFFFFF');
      background.stroke('black', 1);
      background.attrib('opacity', '0.5');
      background.childOfRoot(this);

    }
  }


  public line(
    ax1: number,
    ay1: number,
    ax2: number,
    ay2: number,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.LINE;
    r.tag = "line";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    r.addParam(`x1="${ax1}"`);
    r.addParam(`y1="${this.#y(ay1)}"`);
    r.addParam(`x2="${ax2}"`);
    r.addParam(`y2="${this.#y(ay2)}"`);
    this.#addNode(r);
    return r;
  }


  polyline(
    apoints: A2D.Apg2DPoint[],
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.POLYLINE;
    r.tag = "polyline";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    let pointsSeq = "";
    apoints.forEach((point) => {
      pointsSeq += ` ${point.x},${this.#y(point.y)}`;
    });
    r.addParam(`points="${pointsSeq}"`);

    this.#addNode(r);
    return r;
  }


  polygon(
    apoints: A2D.Apg2DPoint[],
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.POLYGON;
    r.tag = "polygon";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    let pointsSeq = "";
    apoints.forEach((element) => {
      pointsSeq += ` ${element.x},${this.#y(element.y)}`;
    });
    r.addParam(`points="${pointsSeq}"`);

    this.#addNode(r);
    return r;
  }

  rect(
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.RECT;
    r.tag = "rect";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    r.addParam(`x="${ax}"`);
    const y = this.#y(ay + ah);
    r.addParam(`y="${y}"`);
    r.addParam(`width="${aw}"`);
    r.addParam(`height="${ah}"`);
    this.#addNode(r);
    return r;
  }

  circle(
    acx: number,
    acy: number,
    ar: number,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.CIRCLE;
    r.tag = "circle";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    r.addParam(`cx="${acx}"`);
    r.addParam(`cy="${this.#y(acy)}"`);
    r.addParam(`r="${ar}"`);
    this.#addNode(r);
    return r;
  }

  arc(
    acenterX: number,
    acenterY: number,
    aradious: number,
    astartAngleDeg: number,
    aendAngleDeg: number,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.ARC;
    r.tag = "path";

    const startAngleRad = A2D.Apg2DUtility.degToRad(astartAngleDeg);
    const endAngleRad = A2D.Apg2DUtility.degToRad(aendAngleDeg);
    const startX = Math.cos(startAngleRad) * aradious + acenterX;
    const startY = Math.sin(startAngleRad) * aradious + this.#y(acenterY);
    const endX = Math.cos(endAngleRad) * aradious + acenterX;
    const endY = Math.sin(endAngleRad) * aradious + this.#y(acenterY);

    const largeArcFlag = (astartAngleDeg - aendAngleDeg) > 180 ? 1 : 0;
    const sweepFlag = astartAngleDeg > aendAngleDeg ? 1 : 0;

    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    // Example "M87,189 A92,129 0 1 0 557,101"
    r.addParam(`d="M${startX},${startY} A${aradious},${aradious} 0 ${largeArcFlag} ${sweepFlag} ${endX},${endY}"`);
    this.#addNode(r);
    return r;
  }

  image(
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    ahref: string,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.IMAGE;
    r.tag = "image";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    r.addParam(`x="${ax}"`);
    r.addParam(`y="${this.#y(ay + ah)}"`);
    r.addParam(`width="${aw}"`);
    r.addParam(`height="${ah}"`);
    r.addParam(`href="${ahref}"`);
    this.#addNode(r);
    return r;
  }

  imagePerc(
    axPerc: number,
    ayPerc: number,
    awPerc: number,
    ahPerc: number,
    ahref: string,
    aid = "",
  ): ApgSvgNode {
    return this.image(
      this.#coordFromViewBoxPerc(axPerc, eApgSvgCoordType.x),
      this.#coordFromViewBoxPerc(ayPerc, eApgSvgCoordType.y),
      this.#coordFromViewBoxPerc(awPerc, eApgSvgCoordType.w),
      this.#coordFromViewBoxPerc(ahPerc, eApgSvgCoordType.h),
      ahref,
      aid,
    );
  }

  text(
    ax: number,
    ay: number,
    atext: string,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.TEXT;
    r.tag = "text";
    r.innerContent.push(atext);
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    r.addParam(`x="${ax}"`);
    r.addParam(`y="${this.#y(ay)}"`);
    this.#addNode(r);
    return r;
  }

  use(
    ax: number,
    ay: number,
    aid: string,
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.USE;
    r.tag = "use";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    r.addParam(`x="${ax}"`);
    r.addParam(`y="${this.#y(ay)}"`);
    r.addParam(`xlink:href="#${aid}"`);
    this.#addNode(r);
    return r;
  }

  linearGradient(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    aid: string,
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.LINEAR_GRADIENT;
    r.tag = "linearGradient";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    r.addParam(`x1="${x1}"`);
    r.addParam(`y1="${this.#y(y1)}"`);
    r.addParam(`x2="${x2}"`);
    r.addParam(`y2="${y2}"`);
    this.#addNode(r);
    return r;
  }

  radialGradient(
    cx: number,
    cy: number,
    rad: number,
    aid: string,
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.RADIAL_GRADIENT;
    r.tag = "radialGradient";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    r.addParam(`cx="${cx}"`);
    r.addParam(`cy="${this.#y(cy)}"`);
    r.addParam(`rad="${rad}"`);
    this.#addNode(r);
    return r;
  }

  pattern(
    x: number,
    y: number,
    w: number,
    h: number,
    aid: string,
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.PATTERN;
    r.tag = "pattern";
    r.ID = this.#nextID(aid, r.type);
    r.addParam(`id="${r.ID}"`);
    r.addParam(`x="${x}"`);
    r.addParam(`y="${this.#y(y)}"`);
    r.addParam(`width="${w}"`);
    r.addParam(`height="${h}"`);
    this.#addNode(r);
    return r;
  }

  render(): string {

    const r: string[] = [];

    r.push(`
<svg
    width="${this._width}px"
    height="${this._height}px"
    viewBox="${this.renderedViewBox()}"
    version="2.0"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    >
    <!-- Generator: APG - DENO - ApgSvgDoc Renderer -->
    <title>${this.title}</title>
    <desc>${this.description}</desc>\n\n`
    );
    const INDENTING_SPACE = 2;

    r.push('    <defs>\n');
    if (this._defs.size > 0) {
      for (const [_key, blockDef] of this._defs.entries()) {
        r.push(`${blockDef.render(INDENTING_SPACE)}`);
      }
    }
    r.push('    </defs>\n');

    r.push('    <style>\n');
    if (this._styles.size > 0) {
      for (const [_key, style] of this._styles.entries()) {
        r.push(`${style.Render(INDENTING_SPACE)}`);
      }
    }
    r.push('    </style>\n\n');

    if (this._rootNode) {
      r.push(...this._rootNode?.render(1));
    }

    r.push(`
</svg>\n`
    );

    return r.join("");
  }

  protected renderedViewBox(): string {
    const vby = -this._viewBoxHeight; // - this.viewboxY;
    return `${this._viewBoxX} ${vby} ${this._viewBoxWidth} ${this._viewBoxHeight} `;
  }
}
