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

import { eApgSvgStyleType } from "../enums/eApgSvgStyleType.ts";
import { ApgSvgStyleAttribute } from "./ApgSvgStyleAttribute.ts";



export class ApgSvgStyle {
  public ID = "";
  public type: eApgSvgStyleType = eApgSvgStyleType.EVERY;
  public attributes: ApgSvgStyleAttribute[] = [];

  public constructor(atype: eApgSvgStyleType, aID: string) {
    this.ID = aID;
    this.type = atype;
  }

  public Attrib(aname: string, avalue: string) {
    const attrib = new ApgSvgStyleAttribute(aname, avalue);
    this.attributes.push(attrib);
  }

  public Render(adepth: number, aspaces = 4): string {
    const spacer = "".padStart(aspaces, " ");
    let pad = "";
    for (let i = 0; i < adepth; i++) {
      pad += spacer;
    }

    let pre = "";
    if (this.type === eApgSvgStyleType.CLASS) {
      pre = ".";
    } else if (this.type === eApgSvgStyleType.ID) {
      pre = "#";
    }

    let renderedAttribs = "";
    this.attributes.forEach((element) => {
      renderedAttribs += `${pad}${spacer}${element.name} : ${element.value};\n`;
    });

    const r = `
      ${pad}${pre}${this.ID} {
      ${renderedAttribs}
      }`;
    return r;
  }
}
