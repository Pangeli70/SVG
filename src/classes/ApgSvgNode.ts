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
import {
  ApgSvgDoc,
  eApgSvgAlign,
  eApgSvgMeetOrSlice,
  eApgSvgTextAnchor,
  IApgSvgGradientStop,
} from "../../mod.ts";

export class ApgSvgNode {
  public ID = "";
  public type = "";
  public tag = "";
  public params: string[] = [];
  public transforms: string[] = [];
  public children: ApgSvgNode[] = [];
  public innerContent: string[] = [];

  public Clear(aparams = false) {
    const ALLOWED_TAGS = "group";
    this.CheckTag("Clear", ALLOWED_TAGS);
    if (aparams) {
      this.params = [];
    }
    this.transforms = [];
    this.children = [];
    this.innerContent = [];
    return this;
  }

  public Render(adepth: number, aspaces = 4): string[] {
    const spacer = "".padStart(aspaces, " ");
    const pad = "".padStart(aspaces * adepth, " ");

    const r: string[] = [];

    // open tag
    r.push(`${pad}<${this.tag}\n`);

    if (this.params.length > 0) {

      this.params.forEach((element) => {
        r.push(`${pad}${spacer}${element}\n`);
      });


      if (this.transforms.length > 0) {
        r.push(`${pad}${spacer}transform="`);
        this.transforms.forEach((transform) => {
          r.push(`\n${pad}${spacer}${spacer}${transform}`);
        });
        r.push(`"\n`);

      }

    }
    // open tag closed
    r.push(`${pad}>\n`);


    if (this.innerContent.length != 0) {
      this.innerContent.forEach((content) => {
        r.push(`${pad}${spacer}${content}\n`);
      });
    }

    // TODO maybe inner content and renderd children are incompatible
    if (this.children.length != 0) {
      this.children.forEach((element) => {
        const renderedChildren = element.Render(adepth + 1);
        r.push(...renderedChildren);
      });
    }

    // close tag
    r.push(`${pad}</${this.tag}>\n`);

    return r;
  }

  public ChildOf(aNode: ApgSvgNode): ApgSvgNode {
    aNode.children.push(this);
    return this;
  }

  public ChildOfRoot(asvg: ApgSvgDoc): ApgSvgNode {
    asvg.rootNode.children.push(this);
    return this;
  }

  public AddChild(anode: ApgSvgNode) {
    this.children.push(anode);
    return this;
  }

  public DefOf(asvg: ApgSvgDoc): ApgSvgNode {
    asvg.defsMap.set(this.ID, this);
    return this;
  }

  public Attrib(aname: string, avalue: string): ApgSvgNode {
    const newParam = aname + ' = "' + avalue + '"'
    this.params.push(newParam);
    return this;
  }

  public Class(aCssClassName: string): ApgSvgNode {
    this.params.push(`class="${aCssClassName}"`);
    return this;
  }

  public Fill(acolor: string): ApgSvgNode {
    this.params.push(`fill="${acolor}"`);
    return this;
  }

  public StrokeColor(acolor: string): ApgSvgNode {
    this.params.push(`stroke="${acolor}"`);
    return this;
  }

  public StrokeWidth(awidth: number): ApgSvgNode {
    this.params.push(`stroke-width="${awidth}"`);
    return this;
  }

  public StrokeDashPattern(adashArray: number[]): ApgSvgNode {
    const pattern = adashArray.toString();
    this.params.push(`stroke-dasharray="${pattern}"`);
    return this;
  }

  public Stroke(acolor: string, awidth: number): ApgSvgNode {
    this.params.push(`stroke="${acolor}"`);
    this.params.push(`stroke-width="${awidth}"`);
    return this;
  }

  public Move(ax: number, ay: number) {
    // TODO what if there are multiple move ? UB?
    this.transforms.push(`translate(${ax} ${-ay})`);
    return this;
  }

  public Rotate(adeg: number, acx: number, acy: number) {
    this.transforms.push(`rotate(${adeg + 180}, ${acx}, ${-acy})`);
    return this;
  }

  public AddStop(astop: IApgSvgGradientStop) {
    if (this.type === "LinearGradient" || this.type === "RadialGradient") {
      const inner =
        `<stop offset="${astop.offset}% stop-color="${astop.color}" stop-opacity="${astop ? astop.opacity : 1
        }" />`;

      this.innerContent.push(inner);
    }
    return this;
  }

  public AspectRatio(aalign: eApgSvgAlign, amos: eApgSvgMeetOrSlice) {
    const ALLOWED_TAGS = "image";
    this.CheckTag("AspectRatio", ALLOWED_TAGS);
    this.params.push(`preserveAspectRatio="${aalign} ${amos}"`);
    return this;
  }

  public Anchor(aanchor: eApgSvgTextAnchor) {
    const ALLOWED_TAGS = "text|textPath";
    this.CheckTag("Anchor", ALLOWED_TAGS);
    this.params.push(`text-anchor="${aanchor}"`);
    return this;
  }

  public CheckTag(amethodName: string, aallowedTags: string) {
    if (aallowedTags.indexOf(this.tag) == -1) {
      throw new Error(
        `${amethodName} method is not compatible with <${this.tag}> tag`,
      );
    }
  }
}
