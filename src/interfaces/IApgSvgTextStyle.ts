/** -----------------------------------------------------------------------
 * @module [CAD-SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * @version 0.9.3 [APG 2022/12/27] Cad integration
 * -----------------------------------------------------------------------
 */

import { IApgSvgFillStyle } from "./IApgSvgFillStyle.ts";
import { IApgSvgStrokeStyle } from "./IApgSvgStrokeStyle.ts";
import { eApgSvgTextAnchor } from "../enums/eApgSvgTextAnchor.ts";

export interface IApgSvgTextStyle {
  /** Name of the font */
  font: string;
  /** Height of the font in pixels */
  size: number;
  /**  Position of the text */
  anchor: eApgSvgTextAnchor;
  italic: boolean;
  bold: boolean;
  /**  Fill style */
  fill: IApgSvgFillStyle;
  /** Stroke style */
  stroke: IApgSvgStrokeStyle;
  /** Average font H/W Ratio depends from Font Family*/
  HWRatio: number;
  /** Line spacing factor */
  leading?: number;
}
