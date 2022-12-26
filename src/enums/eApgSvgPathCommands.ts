/** -----------------------------------------------------------------------
 * @module [SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/26] Github beta
 * -----------------------------------------------------------------------
 */
export enum eApgSvgPathCommands {
    UNDEF = "",

    MOVE_ABS = "M",
    MOVE_REL = "m",
    LINE_ABS = "L",
    LINE_REL = "l",
    LINE_VERT_ABS = "V",
    LINE_VERT_REL = "v",
    LINE_HOR_ABS = "H",
    LINE_HOR_REL = "h",
    CLOSE_ABS = "Z",
    CLOSE_REL = "z",
    CUBIC_CURVE_ABS = "C",
    CUBIC_CURVE_REL = "c",
    SMOOTH_CUBIC_CURVE_ABS = "S",
    SMOOTH_CUBIC_CURVE_REL = "s",
    QUADRATIC_CURVE_ABS = "Q",
    QUADRATIC_CURVE_REL = "q",
    SMOOTH_QUADRATIC_CURVE_ABS = "T",
    SMOOTH_QUADRATIC_CURVE_REL = "t",
    ARC_ABS = "A",
    ARC_REL = "a"

}
