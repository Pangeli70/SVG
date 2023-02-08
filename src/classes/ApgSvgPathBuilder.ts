/** -----------------------------------------------------------------------
 * @module [SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/26] Github beta
 * @version 0.9.4 [APG 2023/02/04] Chainable commands version
 * -----------------------------------------------------------------------
*/
import { eApgSvgPathCommands } from "../enums/eApgSvgPathCommands.ts";
import { IApgSvgPathInstruction } from "../interfaces/IApgSvgPathInstruction.ts";

export class ApgSvgPathBuilder {

    private _istructions: IApgSvgPathInstruction[] = []

    moveRel(adx: number, ady: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.MOVE_REL,
            params: [adx, -ady]
        });
        return this;
    }
    moveAbs(ax: number, ay: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.MOVE_ABS,
            params: [ax, -ay]
        });
        return this;
    }


    lineRel(adeltaX: number, adeltaY: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.LINE_REL,
            params: [adeltaX, -adeltaY]
        });
        return this;
    }
    lineAbs(ax: number, ay: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.LINE_ABS,
            params: [ax, -ay]
        });
        return this;
    }
    lineHorizontalRel(adeltaX: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.LINE_HOR_REL,
            params: [adeltaX]
        });
        return this;
    }
    lineHorizontalAbs(ax: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.LINE_HOR_ABS,
            params: [ax]
        });
        return this;
    }
    lineVerticalRel(adeltaY: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.LINE_VERT_REL,
            params: [-adeltaY]
        });
        return this;
    }
    lineVerticalAbs(ay: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.LINE_VERT_ABS,
            params: [-ay]
        });
        return this;
    }


    cubicRel(
        acontrolPoint1DeltaX: number, acontrolPoint1DeltaY: number,
        acontrolPoint2DeltaX: number, acontrolPoint2DeltaY: number,
        aendPointDeltaX: number, aendPointDeltaY: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.CUBIC_CURVE_REL,
            params: [
                acontrolPoint1DeltaX, -acontrolPoint1DeltaY,
                acontrolPoint2DeltaX, -acontrolPoint2DeltaY,
                aendPointDeltaX, -aendPointDeltaY]
        });
        return this;
    }
    cubicAbs(
        acontrolPoint1X: number, acontrolPoint1Y: number,
        acontrolPoint2X: number, acontrolPoint2Y: number,
        aendPointX: number, aendPointY: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.CUBIC_CURVE_ABS,
            params: [
                acontrolPoint1X, -acontrolPoint1Y,
                acontrolPoint2X, -acontrolPoint2Y,
                aendPointX, -aendPointY]
        });
        return this;
    }


    cubicSmoothRel(
        acontrolPoint2DeltaX: number, acontrolPoint2DeltaY: number,
        aendPointDeltaX: number, aendPointDeltaY: number
    ) {
        this._istructions.push({
            command: eApgSvgPathCommands.SMOOTH_CUBIC_CURVE_REL,
            params: [acontrolPoint2DeltaX, -acontrolPoint2DeltaY, aendPointDeltaX, -aendPointDeltaY,]
        });
        return this;
    }
    cubicSmoothAbs(
        acontrolPoint2X: number, acontrolPoint2Y: number,
        aendPointX: number, aendPointY: number
    ) {
        this._istructions.push({
            command: eApgSvgPathCommands.SMOOTH_CUBIC_CURVE_ABS,
            params: [acontrolPoint2X, -acontrolPoint2Y, aendPointX, -aendPointY]
        });
        return this;
    }


    quadraticRel(
        acontrolPointDeltaX: number, acontrolPointDeltaY: number,
        aendPointDeltaX: number, aendPointDeltaY: number
    ) {
        this._istructions.push({
            command: eApgSvgPathCommands.QUADRATIC_CURVE_REL,
            params: [acontrolPointDeltaX, -acontrolPointDeltaY, aendPointDeltaX, -aendPointDeltaY]
        });
        return this;
    }
    quadraticAbs(
        acontrolPointX: number, acontrolPointY: number,
        aendPointX: number, aendPointY: number
    ) {
        this._istructions.push({
            command: eApgSvgPathCommands.QUADRATIC_CURVE_ABS,
            params: [acontrolPointX, -acontrolPointY, aendPointX, -aendPointY]
        });
        return this;
    }


    quadraticSmoothRel(
        aendPointDeltaX: number, aendPointDeltaY: number
    ) {
        this._istructions.push({
            command: eApgSvgPathCommands.SMOOTH_QUADRATIC_CURVE_REL,
            params: [aendPointDeltaX, -aendPointDeltaY]
        });
        return this;
    }
    quadraticSmoothAbs(
        aendPointX: number, aendPointY: number
    ) {
        this._istructions.push({
            command: eApgSvgPathCommands.SMOOTH_QUADRATIC_CURVE_ABS,
            params: [aendPointX, -aendPointY]
        });
        return this;
    }


    arcRel(
        aendPointDeltaX: number, aendPointDeltaY: number,
        axRadious: number, ayRadious: number,
        axAxisRotation: number,
        alargeArcFlag: boolean, asweepFlag: boolean
    ) {
        this._istructions.push({
            command: eApgSvgPathCommands.ARC_REL,
            params: [axRadious, ayRadious, axAxisRotation, alargeArcFlag ? 1 : 0, asweepFlag ? 1 : 0, aendPointDeltaX, aendPointDeltaY]
        });
        return this;
    }
    arcAbs(
        aendPointX: number, aendPointY: number,
        axRadious: number, ayRadious: number,
        axAxisRotation: number,
        alargeArcFlag: boolean, asweepFlag: boolean
    ) {
        this._istructions.push({
            command: eApgSvgPathCommands.ARC_ABS,
            params: [axRadious, ayRadious, axAxisRotation, alargeArcFlag ? 1 : 0, asweepFlag ? 1 : 0, aendPointX, aendPointY]
        });
        return this;
    }


    close() {
        this._istructions.push({
            command: eApgSvgPathCommands.CLOSE_ABS,
            params: []
        });
    }



    build() {
        const t: string[] = [];

        for (const inst of this._istructions) {
            switch (inst.command) {
                case eApgSvgPathCommands.LINE_HOR_ABS:
                case eApgSvgPathCommands.LINE_HOR_REL:
                case eApgSvgPathCommands.LINE_VERT_ABS:
                case eApgSvgPathCommands.LINE_VERT_REL:
                    {
                        t.push(`${inst.command} ${inst.params[0]}`);
                    }
                    break;
                case eApgSvgPathCommands.MOVE_ABS:
                case eApgSvgPathCommands.MOVE_REL:
                case eApgSvgPathCommands.LINE_REL:
                case eApgSvgPathCommands.LINE_ABS:
                case eApgSvgPathCommands.SMOOTH_QUADRATIC_CURVE_REL:
                case eApgSvgPathCommands.SMOOTH_QUADRATIC_CURVE_ABS:
                    {
                        t.push(`${inst.command} ${inst.params[0]} ${inst.params[1]}`);
                    }
                    break;
                case eApgSvgPathCommands.SMOOTH_CUBIC_CURVE_REL:
                case eApgSvgPathCommands.SMOOTH_CUBIC_CURVE_ABS:
                case eApgSvgPathCommands.QUADRATIC_CURVE_REL:
                case eApgSvgPathCommands.QUADRATIC_CURVE_ABS:
                    {
                        t.push(`${inst.command} ${inst.params[0]} ${inst.params[1]}, ${inst.params[2]} ${inst.params[3]}`);
                    }
                    break;
                case eApgSvgPathCommands.CUBIC_CURVE_REL:
                case eApgSvgPathCommands.CUBIC_CURVE_ABS:
                    {
                        t.push(`${inst.command} ${inst.params[0]} ${inst.params[1]}, ${inst.params[2]} ${inst.params[3]}, ${inst.params[4]} ${inst.params[5]}`);
                    }
                    break;
                case eApgSvgPathCommands.ARC_ABS:
                case eApgSvgPathCommands.ARC_REL:
                    {
                        t.push(`${inst.command} ${inst.params[0]} ${inst.params[1]} ${inst.params[2]} ${inst.params[3]} ${inst.params[4]} ${inst.params[5]} ${inst.params[6]}`);
                    }
                    break;
                case eApgSvgPathCommands.CLOSE_ABS:
                case eApgSvgPathCommands.CLOSE_REL:
                    {
                        t.push(`${inst.command}`);
                    }
                    break;

            }
        }


        return t.join(" ");
    }

}
