/** -----------------------------------------------------------------------
 * @module [SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.5.1 [APG 2021/02/21]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/24] Github beta
 * @version 0.9.3 [APG 2022/12/26] Paths management
 * -----------------------------------------------------------------------
 */

export { eApgSvgStyleType } from "./src/enums/eApgSvgStyleType.ts";
export { eApgSvgTextAnchor } from "./src/enums/eApgSvgTextAnchor.ts";
export { eApgSvgCoordType } from "./src/enums/eApgSvgCoordType.ts";
export { eApgSvgNodeTypes } from "./src/enums/eApgSvgNodeTypes.ts";
export { eApgSvgAlign, eApgSvgMeetOrSlice } from "./src/enums/eApgSvgAspectRatio.ts";
export { eApgSvgPathCommands } from "./src/enums/eApgSvgPathCommands.ts";

export type { IApgSvgFillStyle } from "./src/interfaces/IApgSvgFillStyle.ts";
export type { IApgSvgLinearGradient } from "./src/interfaces/IApgSvgLinearGradient.ts";
export type { IApgSvgGradientStop } from "./src/interfaces/IApgSvgGradientStop.ts";
export type { IApgSvgPathInstruction } from "./src/interfaces/IApgSvgPathInstruction.ts";
export type { IApgSvgStrokeStyle } from "./src/interfaces/IApgSvgStrokeStyle.ts";
export type { IApgSvgTextStyle } from "./src/interfaces/IApgSvgTextStyle.ts";
export type { IApgSvgTransforms } from "./src/interfaces/IApgSvgTransforms.ts";

export { ApgSvgDoc } from "./src/classes/ApgSvgDoc.ts";
export { ApgSvgNode } from "./src/classes/ApgSvgNode.ts";
export { ApgSvgStyleAttribute } from "./src/classes/ApgSvgStyleAttribute.ts";
export { ApgSvgStyle } from "./src/classes/ApgSvgStyle.ts";
export { ApgSvgPathFactory } from "./src/classes/ApgSvgPathFactory.ts";