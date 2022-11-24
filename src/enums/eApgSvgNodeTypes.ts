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
export enum eApgSvgNodeTypes {
    UNDEF = "",

    Group = "Group",
    LINE = "Line",
    POLYLINE = "PolyLine",
    POLYGON = "Polygon",
    RECT = "Rect",
    CIRCLE = "Circle",
    ARC = "Arc",
    IMAGE = "Image",
    TEXT = "Text",
    USE = "Use",
    LINEAR_GRADIENT = "LinearGradient",
    RADIAL_GRADIENT = "RadialGradient",
    PATTERN = "Pattern",
}
