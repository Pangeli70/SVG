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
import { IApgSvgTransforms } from "../interfaces/IApgSvgTransforms.ts";
import { ApgSvgNode } from "./ApgSvgNode.ts";
import { ApgSvgStyle } from "./ApgSvgStyle.ts";


const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = DEFAULT_WIDTH / 16 * 9;

const DEFAULT_VIEWBOX_WIDTH = 10000;
const DEFAULT_VIEWBOX_HEIGHT = DEFAULT_VIEWBOX_WIDTH / 16 * 9;


export class ApgSvgDoc {

  private _width: number = DEFAULT_WIDTH;
  private _height: number = DEFAULT_HEIGHT;

  private readonly _rootNodeID = "Apg_Svg_Root_Node";

  private _viewBoxX = 0;
  private _viewBoxY = 0;

  private _viewBoxWidth = DEFAULT_VIEWBOX_WIDTH;
  private _viewBoxHeight = DEFAULT_VIEWBOX_HEIGHT;

  public title = "ApgSvgDoc";
  public description = "Default description";
  public id = "APG_SVG_DOC";

  private _rootNode: ApgSvgNode;
  private _nodes: Map<string, ApgSvgNode> = new Map();
  private _defs: Map<string, ApgSvgNode> = new Map();
  private _styles: Map<string, ApgSvgStyle> = new Map();

  private _idCounter = 1;


  constructor(
    aw: number = DEFAULT_WIDTH,
    ah: number = DEFAULT_HEIGHT
  ) {
    this._width = aw;
    this._height = ah;
    this._rootNode = this.group(this._rootNodeID);
  }


  setViewbox(ax: number, ay: number, aw: number, ah: number) {
    this._viewBoxX = ax;
    this._viewBoxY = ay;
    this._viewBoxWidth = aw;
    this._viewBoxHeight = ah;
    this._rootNode.move(0, -this._viewBoxY);
  }


  bottomLeft() {
    return new A2D.Apg2DPoint(this._viewBoxX, this._viewBoxY);
  }

  topRight() {
    return new A2D.Apg2DPoint(
      this._viewBoxX + this._viewBoxWidth,
      this._viewBoxY + this._viewBoxHeight
    );
  }


  #y(ay: number): number {
    //return this.viewboxHeight - ay;
    return -ay;
  }


  #nextID(aid: string, atype: string): string {
    let noID = false;
    if (aid === "") {
      noID = true;
    } else if (this._nodes.has(aid)) {
      noID = true;
    }
    let r = aid;
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
    r.attrib("id", `${r.ID}`);
    this.#addNode(r);
    return r;
  }


  addToRoot(anode: ApgSvgNode) {
    this._rootNode.addChild(anode);
  }


  getRoot() {
    return this._rootNode;
  }


  addToDefs(adefId: string, anode: ApgSvgNode) {
    this._defs.set(adefId, anode);
  }


  getFromDef(adefId: string) {
    return this._defs.get(adefId);
  }

  getDefs() {
    return Array.from(this._defs.keys());
  }


  addStyle(astyle: ApgSvgStyle) {
    this._styles.set(astyle.ID, astyle);
  }


  getStyle(astyleId: string) {
    return this._styles.get(astyleId);
  }


  viewBoxBackground() {
    const ID = "APG_SVG_DOC_VIEWBOX_BACKGROUND";

    const background = this.rect(
      this._viewBoxX,
      this._viewBoxY,
      this._viewBoxWidth,
      this._viewBoxHeight,
      ID,
    );
    background.fill('#FFFFFF');
    background.stroke('black', 1);
    background.childOfRoot(this);

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
    r.attrib("id", `${r.ID}`);
    r.attrib("x1", `${ax1}`);
    r.attrib("y1", `${this.#y(ay1)}`);
    r.attrib("x2", `${ax2}`);
    r.attrib("y2", `${this.#y(ay2)}`);
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
    r.attrib("id", `${r.ID}`);
    let pointsSeq = "";
    apoints.forEach((point) => {
      pointsSeq += ` ${point.x},${this.#y(point.y)}`;
    });
    r.attrib("points", `${pointsSeq}`);

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
    r.attrib("id", `${r.ID}`);
    let pointsSeq = "";
    apoints.forEach((element) => {
      pointsSeq += ` ${element.x},${this.#y(element.y)}`;
    });
    r.attrib("points", `${pointsSeq}`);

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
    r.attrib("id", `${r.ID}`);
    r.attrib("x", `${ax}`);
    const y = this.#y(ay + ah);
    r.attrib("y", `${y}`);
    r.attrib("width", `${aw}`);
    r.attrib("height", `${ah}`);
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
    r.attrib("id", `${r.ID}`);
    r.attrib("cx", `${acx}`);
    r.attrib("cy", `${this.#y(acy)}`);
    r.attrib("r", `${ar}`);
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

    const startAngleRad = A2D.Apg2DUtility.DegToRad(astartAngleDeg);
    const endAngleRad = A2D.Apg2DUtility.DegToRad(aendAngleDeg);
    const startX = Math.cos(startAngleRad) * aradious + acenterX;
    const startY = Math.sin(startAngleRad) * aradious + this.#y(acenterY);
    const endX = Math.cos(endAngleRad) * aradious + acenterX;
    const endY = Math.sin(endAngleRad) * aradious + this.#y(acenterY);

    const largeArcFlag = (astartAngleDeg - aendAngleDeg) > 180 ? 1 : 0;
    const sweepFlag = astartAngleDeg > aendAngleDeg ? 1 : 0;

    r.ID = this.#nextID(aid, r.type);
    r.attrib("id", `${r.ID}`);
    // Example "M87,189 A92,129 0 1 0 557,101"
    r.attrib("d", `M${startX},${startY} A${aradious},${aradious} 0 ${largeArcFlag} ${sweepFlag} ${endX},${endY}`);
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
    r.attrib("id", `${r.ID}`);
    r.attrib("x", `${ax}`);
    r.attrib("y", `${this.#y(ay + ah)}`);
    r.attrib("width", `${aw}`);
    r.attrib("height", `${ah}`);
    r.attrib("href", `${ahref}`);
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
    alineSpacing: number,
    aid = "",
  ): ApgSvgNode {
    const t = new ApgSvgNode();
    t.type = eApgSvgNodeTypes.TEXT;
    t.tag = "text";
    t.ID = this.#nextID(aid, t.type);

    const innerText = this.#multilineText(atext, alineSpacing);
    t.rawInnerContent(innerText);
    t.attrib("id", `${t.ID}_text`);
    t.attrib("x", "0");
    t.attrib("y", "0");

    const r = this.group(t.ID);
    r.move(ax, ay);
    t.childOf(r);
    this.#addNode(r);
    return r;
  }

  #multilineText(
    atext: string,
    alineSpacing: number
  ) {
    const lines = atext.split("\n");
    if (lines.length == 1) {
      return atext;
    }
    const r: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const newY = alineSpacing * i;
      const spanLine = `<tspan x="0" y="${newY}" >${line}</tspan>`;
      r.push(spanLine);
    }
    return r.join("\n");
  }


  path(
    ainstructions: string,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.PATH;
    r.tag = "path";
    r.ID = this.#nextID(aid, r.type);
    r.attrib("id", `${r.ID}`);
    r.attrib("d", `${ainstructions}`);
    this.#addNode(r);
    return r;
  }


  use(
    aid: string,
    ax: number,
    ay: number,
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = eApgSvgNodeTypes.USE;
    r.tag = "use";
    r.ID = this.#nextID(aid, r.type);
    r.attrib("id", `${r.ID}`);
    r.attrib("xlink:href", `#${aid}`);
    r.attrib("x", `${ax}`);
    r.attrib("y", `${this.#y(ay)}`);
    this.#addNode(r);
    return r;
  }

  useT(
    aid: string,
    ax: number,
    ay: number,
    atransforms: IApgSvgTransforms
  ): ApgSvgNode {

    const u = new ApgSvgNode();
    u.type = eApgSvgNodeTypes.USE;
    u.tag = "use";
    u.ID = this.#nextID(aid, u.type);
    u.attrib("id", `${u.ID}`);
    u.attrib("xlink:href", `#${aid}`);
    let x = ax;
    let y = this.#y(ay);

    let trasfs = "";
    if (atransforms.scale) {
      trasfs += ` scale(${atransforms.scale.x}, ${atransforms.scale.y})`
      x /= atransforms.scale.x;
      y /= atransforms.scale.y;
    }

    if (atransforms.translate) {
      let tx = atransforms.translate.x;
      let ty = this.#y(atransforms.translate.y);
      if (atransforms.scale) {
        tx /= atransforms.scale.x;
        ty /= atransforms.scale.y;
      }
      x += tx;
      y += ty;
    }

    if (atransforms.rotate) {
      trasfs += ` rotate(${atransforms.rotate.a}, ${x}, ${y})`
    }

    u.attrib("x", `${x}`);
    u.attrib("y", `${y}`);
    if (trasfs != "") { 
      u.attrib("transform", trasfs);
    }

    this.#addNode(u);
    return u;
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
    r.attrib("id", `${r.ID}`);
    r.attrib("x1", `${x1}`);
    r.attrib("y1", `${this.#y(y1)}`);
    r.attrib("x2", `${x2}`);
    r.attrib("y2", `${y2}`);
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
    r.attrib("id", `${r.ID}`);
    r.attrib("cx", `${cx}`);
    r.attrib("cy", `${this.#y(cy)}`);
    r.attrib("rad", `${rad}`);
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
    r.attrib("id", `${r.ID}`);
    r.attrib("x", `${x}`);
    r.attrib("y", `${this.#y(y)}`);
    r.attrib("width", `${w}`);
    r.attrib("height", `${h}`);
    this.#addNode(r);
    return r;
  }


  render(): string {

    const r: string[] = [];

    r.push(`
<svg
    style="display:block; margin:auto; border: 2px; border-color: black; background-color: #888888;"
    id="${this.id}"
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
