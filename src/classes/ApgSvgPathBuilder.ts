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

    move(adx: number, ady: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.MOVE_REL,
            params: [adx, ady]
        });
        return this;
    }
    moveTo(ax: number, ay: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.MOVE_ABS,
            params: [ax, ay]
        });
        return this;
    }


    line(adx: number, ady: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.LINE_REL,
            params: [adx, ady]
        });
        return this;
    }
    lineTo(ax: number, ay: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.LINE_ABS,
            params: [ax, ay]
        });
        return this;
    }


    close() {
        this._istructions.push({
            command: eApgSvgPathCommands.CLOSE_ABS,
            params: []
        });
    }


    cubic(adx: number, ady: number, acdx1: number, acdy1: number, acdx2: number, acdy2: number,) {
        this._istructions.push({
            command: eApgSvgPathCommands.CUBIC_CURVE_REL,
            params: [acdx1, acdy1, acdx2, acdy2, adx, ady]
        });
        return this;
    }
    cubicTo(ax: number, ay: number, acx1: number, acy1: number, acx2: number, acy2: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.CUBIC_CURVE_ABS,
            params: [acx1, acy1, acx2, acy2, ax, ay]
        });
        return this;
    }


    cubicSmooth(adx: number, ady: number, acdx2: number, acdy2: number,) {
        this._istructions.push({
            command: eApgSvgPathCommands.SMOOTH_CUBIC_CURVE_REL,
            params: [acdx2, acdy2, adx, ady]
        });
        return this;
    }
    cubicSmoothTo(ax: number, ay: number, acx2: number, acy2: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.SMOOTH_CUBIC_CURVE_ABS,
            params: [acx2, acy2, ax, ay]
        });
        return this;
    }


    quadratic(adx: number, ady: number, acdx1: number, acdy1: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.QUADRATIC_CURVE_REL,
            params: [acdx1, acdy1, adx, ady]
        });
        return this;
    }
    quadraticTo(ax: number, ay: number, acx1: number, acy1: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.QUADRATIC_CURVE_ABS,
            params: [acx1, acy1, ax, ay]
        });
        return this;
    }


    quadraticSmooth(adx: number, ady: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.SMOOTH_QUADRATIC_CURVE_REL,
            params: [adx, ady]
        });
        return this;
    }
    quadraticSmoothTo(ax: number, ay: number) {
        this._istructions.push({
            command: eApgSvgPathCommands.SMOOTH_QUADRATIC_CURVE_ABS,
            params: [ax, ay]
        });
        return this;
    }


    arc(adx: number, ady: number, arad: number, alarge: boolean, aflip: boolean,) {
        this._istructions.push({
            command: eApgSvgPathCommands.ARC_REL,
            params: [arad, arad, 0, alarge ? 1 : 0, aflip ? 1 : 0, adx, ady]
        });
        return this;
    }
    arcTo(ax: number, ay: number, arad: number, alarge: boolean, aflip: boolean,) {
        this._istructions.push({
            command: eApgSvgPathCommands.ARC_REL,
            params: [arad, arad, 0, alarge ? 1 : 0, aflip ? 1 : 0, ax, ay]
        });
        return this;
    }

    
    build() {
        const t: string[] = [];

        for (const inst of this._istructions) {
            switch (inst.command) {
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
