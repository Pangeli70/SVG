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
import { IApgSvgGradientStop } from "../../mod.ts";

export interface IApgSvgLinearGradient {
  ID: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: IApgSvgGradientStop[];
}
