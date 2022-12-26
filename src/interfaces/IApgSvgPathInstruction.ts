/** -----------------------------------------------------------------------
 * @module [SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/26] Path management
 * -----------------------------------------------------------------------
*/
import { eApgSvgPathCommands } from "../enums/eApgSvgPathCommands.ts";

export interface IApgSvgPathInstruction {
  command: eApgSvgPathCommands;
  params: number[];
}
