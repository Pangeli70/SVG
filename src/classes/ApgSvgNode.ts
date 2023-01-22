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

import { eApgSvgAlign, eApgSvgMeetOrSlice } from "../enums/eApgSvgAspectRatio.ts";
import { eApgSvgTextAnchor } from "../enums/eApgSvgTextAnchor.ts";
import { eApgSvgNodeTypes } from "../enums/eApgSvgNodeTypes.ts";
import { IApgSvgGradientStop } from "../interfaces/IApgSvgGradientStop.ts";
import { IApgSvgTextStyle } from "../interfaces/IApgSvgTextStyle.ts";
import { ApgSvgDoc } from "./ApgSvgDoc.ts";


export class ApgSvgNode {
  public ID = "";
  public type: eApgSvgNodeTypes = eApgSvgNodeTypes.UNDEF;
  public tag = "";
  private _params: string[] = [];
  private _transforms: string[] = [];
  private _children: ApgSvgNode[] = [];
  private _innerContent: string[] = [];



  clear(aparams = false) {
    const ALLOWED_TAGS = "group";
    this.#checkTag("Clear", ALLOWED_TAGS);
    if (aparams) {
      this._params = [];
    }
    this._transforms = [];
    this._children = [];
    this._innerContent = [];
    return this;
  }

  render(adepth: number, aspaces = 4): string[] {
    const spacer = "".padStart(aspaces, " ");
    const pad = "".padStart(aspaces * adepth, " ");

    const r: string[] = [];

    // open tag
    r.push(`${pad}<${this.tag}\n`);

    if (this._params.length > 0) {

      this._params.forEach((element) => {
        r.push(`${pad}${spacer}${element}\n`);
      });


      if (this._transforms.length > 0) {
        r.push(`${pad}${spacer}transform="`);
        this._transforms.forEach((transform) => {
          r.push(` ${pad}${spacer}${spacer}${transform}`);
        });
        r.push(`"\n`);

      }

    }
    // open tag closed
    r.push(`${pad}>\n`);


    if (this._innerContent.length != 0) {
      this._innerContent.forEach((content) => {
        r.push(`${pad}${spacer}${content}\n`);
      });
    }

    // TODO @9 APG ... -- maybe inner content and renderd children are incompatible
    if (this._children.length != 0) {
      this._children.forEach((element) => {
        const renderedChildren = element.render(adepth + 1);
        r.push(...renderedChildren);
      });
    }

    // close tag
    r.push(`${pad}</${this.tag}>\n`);

    return r;
  }

  childOf(aNode: ApgSvgNode): ApgSvgNode {
    aNode._children.push(this);
    return this;
  }

  childOfRoot(asvg: ApgSvgDoc): ApgSvgNode {
    asvg.addToRoot(this);
    return this;
  }

  addChild(anode: ApgSvgNode) {
    this._children.push(anode);
    return this;
  }

  defOf(asvg: ApgSvgDoc): ApgSvgNode {
    asvg.addToDefs(this.ID, this);
    return this;
  }

  attrib(aname: string, avalue: string): ApgSvgNode {
    const newParam = aname + ' = "' + avalue + '"'
    this._params.push(newParam);
    return this;
  }

  class(aCssClassName: string): ApgSvgNode {
    this._params.push(`class="${aCssClassName}"`);
    return this;
  }

  fill(acolor: string, aopacity?: number): ApgSvgNode {
    this._params.push(`fill="${acolor}"`);
    if (aopacity) this._params.push(`fill-opacity="${aopacity}"`);
    return this;
  }

  strokeDashPattern(adashArray: number[], adashOffset = 0): ApgSvgNode {
    const pattern = adashArray.toString();
    this._params.push(`stroke-dasharray="${pattern}"`);
    this._params.push(`stroke-dashoffset="${adashOffset}"`);
    return this;
  }

  stroke(acolor: string, awidth?: number): ApgSvgNode {
    this._params.push(`stroke="${acolor}"`);
    if (awidth) this._params.push(`stroke-width="${awidth}"`);
    return this;
  }

  move(ax: number, ay: number) {
    // TODO @9 APG ... -- what if there are multiple translations? how do they merge ? UB?
    this._transforms.push(`translate(${ax} ${-ay})`);
    return this;
  }

  rotate(adeg: number, acx = 0, acy = 0) {
    this._transforms.push(`rotate(${360 - adeg}, ${acx}, ${-acy})`);
    return this;
  }

  scale(axfactor: number, ayfactor: number) {
    this._transforms.push(`scale(${axfactor}, ${ayfactor})`);
    return this;
  }


  aspectRatio(aalign: eApgSvgAlign, amos: eApgSvgMeetOrSlice) {
    const ALLOWED_TAGS = "image";
    this.#checkTag("AspectRatio", ALLOWED_TAGS);
    this._params.push(`preserveAspectRatio="${aalign} ${amos}"`);
    return this;
  }

  anchor(aanchor: eApgSvgTextAnchor) {
    const ALLOWED_TAGS = "g|text|textPath";
    this.#checkTag("Anchor", ALLOWED_TAGS);
    this._params.push(`text-anchor="${aanchor}"`);
    return this;
  }

  textStyle(atextStyle: IApgSvgTextStyle) {
    const ALLOWED_TAGS = "g|text|textPath";
    this.#checkTag("TextStyle", ALLOWED_TAGS);
    this.attrib("font-size", `${atextStyle.size}`);
    if (atextStyle.font) this.attrib("font-family", `${atextStyle.font}`);
    if (atextStyle.anchor) this.attrib("text-anchor", `${atextStyle.anchor}`);
    if (atextStyle.italic) this.attrib("font-style", "italic");
    if (atextStyle.bold) this.attrib("font-weight", "bold");
    if (atextStyle.fill) this.fill(atextStyle.fill.color, atextStyle.fill.opacity);
    if (atextStyle.stroke) {
      this.stroke(atextStyle.stroke.color, atextStyle.stroke.width);
    } else {
      this.stroke("none", 0);
    }
    return this;
  }


  rawInnerContent(astring: string) {
    this._innerContent.push(astring);
    return this;
  }


  addStop(astop: IApgSvgGradientStop) {
    if (
      this.type === eApgSvgNodeTypes.LINEAR_GRADIENT ||
      this.type === eApgSvgNodeTypes.RADIAL_GRADIENT
    ) {
      const inner =
        `<stop offset="${astop.offset}%" stop-color="${astop.color}" stop-opacity="${astop.opacity || 1}" />`;

      this._innerContent.push(inner);
    }
    return this;
  }


  #checkTag(amethodName: string, aallowedTags: string) {
    if (aallowedTags.indexOf(this.tag) == -1) {
      throw new Error(
        `${amethodName} method is not compatible with <${this.tag}> tag`,
      );
    }
  }
}
