/** -----------------------------------------------------------------------
 * @module [SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.5.1 [APG 2021/02/21]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/24] Github beta
 * @version 0.9.4 [APG 2023/02/05] Changed from _ [] to _ Map()
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
  /** Svg tag */
  public tag = "";
  /** Node attributes. Map prevents multiple attribute assignment to the same node. The last is applied.*/
  private _attributes: Map<string, string> = new Map();
  /** Node transforms. Map prevents multiple trasnform assignment to the same node. The last is applied.*/
  private _transforms: Map<string, string> = new Map();
  /** List of child nodes */
  private _children: ApgSvgNode[] = [];
  /** List of text row content*/
  private _innerContent: string[] = [];



  clear(aclearAttributes = false) {
    const ALLOWED_TAGS = "group";
    this.#checkTag("Clear", ALLOWED_TAGS);
    if (aclearAttributes) {
      this._attributes = new Map();
    }
    this._transforms = new Map();
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

    if (this._attributes.size > 0) {

      for (const v of this._attributes.values()) {
        r.push(`${pad}${spacer}${v}\n`);
      }

      if (this._transforms.size > 0) {
        r.push(`${pad}${spacer}transform="`);
        for (const v of this._transforms.values()) {
          r.push(`${pad}${spacer}${v}\n`);
        }
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

    // TODO @9 -- APG 20230205. Maybe inner content and renderd children are incompatible. UB.
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
    this._attributes.set(aname, newParam);
    return this;
  }

  class(acssClassName: string): ApgSvgNode {
    this.attrib('class', acssClassName);
    return this;
  }

  fill(acolor: string, aopacity?: number): ApgSvgNode {
    this.attrib('fill', acolor);
    if (aopacity) {
      this.attrib('fill-opacity', aopacity.toString());
    }
    return this;
  }

  fillPattern(apatternDef: string) {
    this.attrib('fill', `url(#${apatternDef})`);
    return this;
  }

  fillGradient(agradientDef: string) {
    this.attrib('fill', `url(#${agradientDef})`);
    return this;
  }

  fillTexture(atextureDef: string) {
    this.attrib('fill', `url(#${atextureDef})`);
    return this;
  }

  stroke(acolor: string, awidth: number, aopacity = 1): ApgSvgNode {
    this.attrib('stroke', acolor);
    this.attrib('stroke-width', awidth.toString());
    if (aopacity != 1) {
      this.attrib('stroke-opacity', aopacity.toString());
    }
    return this;
  }

  strokeDashPattern(adashArray: number[], adashOffset = 0): ApgSvgNode {
    const pattern = adashArray.toString();
    this.attrib('stroke-dasharray', pattern);
    this.attrib('stroke-dashoffset', adashOffset.toString());
    return this;
  }

  /** @remark Multilple move on the same node don't sum or merge. Last one is applied */
  move(ax: number, ay: number) {
    this._transforms.set('translate', `translate(${ax} ${-ay})`);
    return this;
  }

  /** @remark Multilple rotate on the same node don't sum or merge. Last one is applied */
  rotate(adeg: number, acx = 0, acy = 0) {
    this._transforms.set('rotate', `rotate(${360 - adeg}, ${acx}, ${-acy})`);
    return this;
  }

  /** @remark Multilple scale on the same node don't sum or merge. Last one is applied */
  scale(axfactor: number, ayfactor: number) {
    this._transforms.set('scale', `scale(${axfactor}, ${ayfactor})`);
    return this;
  }


  aspectRatio(aalign: eApgSvgAlign, amos: eApgSvgMeetOrSlice) {
    const ALLOWED_TAGS = "image";
    this.#checkTag("AspectRatio", ALLOWED_TAGS);
    this.attrib('preserveAspectRatio', `${aalign} ${amos}`);
    return this;
  }

  anchor(aanchor: eApgSvgTextAnchor) {
    const ALLOWED_TAGS = "g|text|textPath";
    this.#checkTag("Anchor", ALLOWED_TAGS);
    this.attrib('text-anchor', aanchor);
    return this;
  }

  textStyle(atextStyle: IApgSvgTextStyle, asetFillAndStroke = true) {
    const ALLOWED_TAGS = "g|text|textPath";
    this.#checkTag("TextStyle", ALLOWED_TAGS);
    this.attrib("font-size", `${atextStyle.size}`);
    if (atextStyle.font) this.attrib("font-family", `${atextStyle.font}`);
    if (atextStyle.anchor) this.attrib("text-anchor", `${atextStyle.anchor}`);
    if (atextStyle.italic) this.attrib("font-style", "italic");
    if (atextStyle.bold) this.attrib("font-weight", "bold");
    if (asetFillAndStroke) {
      if (atextStyle.fill) this.fill(atextStyle.fill.color, atextStyle.fill.opacity);
      if (atextStyle.stroke) {
        this.stroke(atextStyle.stroke.color, atextStyle.stroke.width);
      } else {
        this.stroke("none", 0);
      }
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
        `<stop offset="${astop.offset}%" stop-color="${astop.color}" stop-opacity="${astop.opacity == undefined ? 1 : astop.opacity}" />`;

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
