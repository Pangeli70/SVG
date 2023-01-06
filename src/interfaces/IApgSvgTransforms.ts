/** -----------------------------------------------------------------------
 * @module [SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2023/01/02] 
 * -----------------------------------------------------------------------
 */
export interface IApgSvgTransforms {
  scale?: { x: number, y: number };
  translate?: { x: number, y: number };
  rotate?: { a: number, x?: number, y?: number };
}
