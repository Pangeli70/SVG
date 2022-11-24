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
import { ApgSvgNode } from "./ApgSvgNode.ts";
import { ApgSvgStyle } from "./ApgSvgStyle.ts";


const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = DEFAULT_WIDTH / 16 * 9;

export class ApgSvgDoc {
  public viewboxX = 0;
  public viewboxY = 0;

  public viewboxWidth = 10000;
  public viewboxHeight = 10000;

  public width: number = DEFAULT_WIDTH;

  public height: number = DEFAULT_HEIGHT;

  public title = "ApgSvgDoc";
  public desc = "Default description";

  public rootNode!: ApgSvgNode;
  public nodeMap: Map<string, ApgSvgNode> = new Map();
  public defsMap: Map<string, ApgSvgNode> = new Map();
  public stylesMap: Map<string, ApgSvgStyle> = new Map();

  public globalIDCounter = 1;

  public hasViewBoxSheet = false;

  public constructor(
    aw: number = DEFAULT_WIDTH,
    ah: number = DEFAULT_HEIGHT,
    ahasViewBoxSheet = true,
  ) {
    const NODE_ID = "Apg_Svg_Root_Node"

    this.width = aw;
    this.height = ah;
    this.hasViewBoxSheet = ahasViewBoxSheet;
    this.rootNode = this.Group(NODE_ID);
  }

  public SetViewbox(ax: number, ay: number, aw: number, ah: number) {
    this.viewboxX = ax;
    this.viewboxY = ay;
    this.viewboxWidth = aw;
    this.viewboxHeight = ah;
    this.rootNode.Move(0, -this.viewboxY);
    this._viewBoxSheet();
  }

  private _y(ay: number): number {
    //return this.viewboxHeight - ay;
    return -ay;
  }

  private _getNextID(aid: string, atype: string): string {
    let r = aid;
    let noID = false;
    if (aid === "") {
      noID = true;
    } else if (this.nodeMap.has(aid)) {
      noID = true;
    }
    if (noID) {
      r = atype + "-" + this.globalIDCounter.toString();
    }
    return r;
  }

  private _addNode(anode: ApgSvgNode) {
    this.globalIDCounter++;
    this.nodeMap.set(anode.ID, anode);
  }

  public coordFromViewBoxPerc(aperc: number, atype: eApgSvgCoordType) {
    if (aperc < 0 || aperc > 1) {
      throw new Error(`Percentage out of range ${aperc}`);
    }
    switch (atype) {
      case eApgSvgCoordType.x:
        return this.viewboxWidth * aperc + this.viewboxX;
      case eApgSvgCoordType.y:
        return this.viewboxHeight * aperc + this.viewboxY;
      case eApgSvgCoordType.w:
        return this.viewboxWidth * aperc;
      case eApgSvgCoordType.h:
        return this.viewboxHeight * aperc;
    }
  }

  public Group(aid = ""): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Group";
    r.tag = "g";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    this._addNode(r);
    return r;
  }

  public AddToRoot(anode: ApgSvgNode) {
    this.rootNode.children.push(anode);
  }

  public AddToDefs(anode: ApgSvgNode) {
    this.defsMap.set(anode.ID, anode);
  }

  public AddStyle(astyle: ApgSvgStyle) {
    this.stylesMap.set(astyle.ID, astyle);
  }

  private _viewBoxSheet() {
    const ID = "APG_SVG_DOC_VIEWBOX_SHEET";

    if (this.hasViewBoxSheet) {

      const sheet = this.Rect(
        this.viewboxX,
        this.viewboxY,
        this.viewboxWidth,
        this.viewboxHeight,
        ID,
      );
      sheet.Fill('#FFFFFF');
      sheet.Stroke('black', 1);
      sheet.Attrib('opacity', '0.5');
      sheet.ChildOfRoot(this);

    }
  }

  public Line(
    ax1: number,
    ay1: number,
    ax2: number,
    ay2: number,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Line";
    r.tag = "line";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    r.params.push(`x1="${ax1}"`);
    r.params.push(`y1="${this._y(ay1)}"`);
    r.params.push(`x2="${ax2}"`);
    r.params.push(`y2="${this._y(ay2)}"`);
    this._addNode(r);
    return r;
  }

  public PolyLine(
    apoints: A2D.Apg2DPoint[],
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "PolyLine";
    r.tag = "polyline";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    let pointsSeq = "";
    apoints.forEach((point) => {
      pointsSeq += ` ${point.x},${this._y(point.y)}`;
    });
    r.params.push(`points="${pointsSeq}"`);

    this._addNode(r);
    return r;
  }

  public Polygon(
    apoints: A2D.Apg2DPoint[],
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Polygon";
    r.tag = "polygon";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    let pointsSeq = "";
    apoints.forEach((element) => {
      pointsSeq += ` ${element.x},${this._y(element.y)}`;
    });
    r.params.push(`points="${pointsSeq}"`);

    this._addNode(r);
    return r;
  }

  public Rect(
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Rect";
    r.tag = "rect";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    r.params.push(`x="${ax}"`);
    const y = this._y(ay + ah);
    r.params.push(`y="${y}"`);
    r.params.push(`width="${aw}"`);
    r.params.push(`height="${ah}"`);
    this._addNode(r);
    return r;
  }

  public Circle(
    acx: number,
    acy: number,
    ar: number,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Circle";
    r.tag = "circle";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    r.params.push(`cx="${acx}"`);
    r.params.push(`cy="${this._y(acy)}"`);
    r.params.push(`r="${ar}"`);
    this._addNode(r);
    return r;
  }

  public Arc(
    acenterX: number,
    acenterY: number,
    aradious: number,
    astartAngleDeg: number,
    aendAngleDeg: number,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Arc";
    r.tag = "path";

    const startAngleRad = A2D.Apg2DUtility.degToRad(astartAngleDeg);
    const endAngleRad = A2D.Apg2DUtility.degToRad(aendAngleDeg);
    const startX = Math.cos(startAngleRad) * aradious + acenterX;
    const startY = Math.sin(startAngleRad) * aradious + this._y(acenterY);
    const endX = Math.cos(endAngleRad) * aradious + acenterX;
    const endY = Math.sin(endAngleRad) * aradious + this._y(acenterY);

    const largeArcFlag = (astartAngleDeg - aendAngleDeg) > 180 ? 1 : 0;
    const sweepFlag = astartAngleDeg > aendAngleDeg ? 1 : 0;

    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    // Example "M87,189 A92,129 0 1 0 557,101"
    r.params.push(`d="M${startX},${startY} A${aradious},${aradious} 0 ${largeArcFlag} ${sweepFlag} ${endX},${endY}"`);
    this._addNode(r);
    return r;
  }

  public Image(
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    ahref: string,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Image";
    r.tag = "image";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    r.params.push(`x="${ax}"`);
    r.params.push(`y="${this._y(ay + ah)}"`);
    r.params.push(`width="${aw}"`);
    r.params.push(`height="${ah}"`);
    r.params.push(`href="${ahref}"`);
    this._addNode(r);
    return r;
  }

  public ImagePerc(
    axPerc: number,
    ayPerc: number,
    awPerc: number,
    ahPerc: number,
    ahref: string,
    aid = "",
  ): ApgSvgNode {
    return this.Image(
      this.coordFromViewBoxPerc(axPerc, eApgSvgCoordType.x),
      this.coordFromViewBoxPerc(ayPerc, eApgSvgCoordType.y),
      this.coordFromViewBoxPerc(awPerc, eApgSvgCoordType.w),
      this.coordFromViewBoxPerc(ahPerc, eApgSvgCoordType.h),
      ahref,
      aid,
    );
  }

  public Text(
    ax: number,
    ay: number,
    atext: string,
    aid = "",
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Text";
    r.tag = "text";
    r.innerContent.push(atext);
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    r.params.push(`x="${ax}"`);
    r.params.push(`y="${this._y(ay)}"`);
    this._addNode(r);
    return r;
  }

  public Use(
    ax: number,
    ay: number,
    aid: string,
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Use";
    r.tag = "use";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    r.params.push(`x="${ax}"`);
    r.params.push(`y="${this._y(ay)}"`);
    r.params.push(`xlink:href="#${aid}"`);
    this._addNode(r);
    return r;
  }

  public LinearGradient(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    aid: string,
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "LinearGradient";
    r.tag = "linearGradient";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    r.params.push(`x1="${x1}"`);
    r.params.push(`y1="${this._y(y1)}"`);
    r.params.push(`x2="${x2}"`);
    r.params.push(`y2="${y2}"`);
    this._addNode(r);
    return r;
  }

  public RadialGradient(
    cx: number,
    cy: number,
    rad: number,
    aid: string,
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "RadialGradient";
    r.tag = "radialGradient";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    r.params.push(`cx="${cx}"`);
    r.params.push(`cy="${this._y(cy)}"`);
    r.params.push(`rad="${rad}"`);
    this._addNode(r);
    return r;
  }

  public Pattern(
    x: number,
    y: number,
    w: number,
    h: number,
    aid: string,
  ): ApgSvgNode {
    const r = new ApgSvgNode();
    r.type = "Pattern";
    r.tag = "pattern";
    r.ID = this._getNextID(aid, r.type);
    r.params.push(`id="${r.ID}"`);
    r.params.push(`x="${x}"`);
    r.params.push(`y="${this._y(y)}"`);
    r.params.push(`width="${w}"`);
    r.params.push(`height="${h}"`);
    this._addNode(r);
    return r;
  }

  public Render(): string {

    const r: string[] = [];

    r.push(`
<svg
    width="${this.width}px"
    height="${this.height}px"
    viewBox="${this.renderedViewBox()}"
    version="2.0"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    >
    <!-- Generator: APG - DENO - ApgSvgDoc Renderer -->
    <title>${this.title}</title>
    <desc>${this.desc}</desc>\n\n`
    );
    const INDENTING_SPACE = 2;

    r.push('    <defs>\n');
    if (this.defsMap.size > 0) {
      for (const [_key, blockDef] of this.defsMap.entries()) {
        r.push(`${blockDef.Render(INDENTING_SPACE)}`);
      }
    }
    r.push('    </defs>\n');

    r.push('    <style>\n');
    if (this.stylesMap.size > 0) {
      for (const [_key, style] of this.stylesMap.entries()) {
        r.push(`${style.Render(INDENTING_SPACE)}`);
      }
    }
    r.push('    </style>\n\n');

    if (this.rootNode) {
      r.push(...this.rootNode?.Render(1));
    }

    r.push(`
</svg>\n`
    );

    return r.join("");
  }

  protected renderedViewBox(): string {
    const vby = -this.viewboxHeight; // - this.viewboxY;
    return `${this.viewboxX} ${vby} ${this.viewboxWidth} ${this.viewboxHeight} `;
  }
}
