/** -----------------------------------------------------------------------
 * @module [SVG]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.4 [APG 2023/02/04] Procedural hatch patterns
 * -----------------------------------------------------------------------
*/
import { A2D } from "../../deps.ts";
import { IApgSvgStrokeStyle } from "../interfaces/IApgSvgStrokeStyle.ts";
import { ApgSvgDoc } from "./ApgSvgDoc.ts";
import { ApgSvgPathBuilder } from "./ApgSvgPathBuilder.ts";

export class ApgSvgHatchBuilder {

    private _doc: ApgSvgDoc

    constructor(adoc: ApgSvgDoc) {
        this._doc = adoc;
    }

    saltire(aname: string, axSize: number, aySize: number, astrokeStyle?: IApgSvgStrokeStyle) {
        const r = this._doc.pattern(axSize, aySize, aname);
        const l1 = this._doc.line(0, 0, axSize, aySize).childOf(r);
        const l2 = this._doc.line(0, aySize, axSize, 0).childOf(r);
        if (astrokeStyle) {
            l1.stroke(astrokeStyle.color, astrokeStyle.width)
            l2.stroke(astrokeStyle.color, astrokeStyle.width)
        }
        return r;
    }

    cross(aname: string, axSize: number, aySize: number, astrokeStyle?: IApgSvgStrokeStyle) {
        const halfXSize = axSize / 2;
        const halfYSize = aySize / 2;
        const r = this._doc.pattern(axSize, aySize, aname);
        const l1 = this._doc.line(0, halfYSize, axSize, halfYSize).childOf(r);
        const l2 = this._doc.line(halfXSize, 0, halfXSize, aySize).childOf(r);
        if (astrokeStyle) {
            l1.stroke(astrokeStyle.color, astrokeStyle.width)
            l2.stroke(astrokeStyle.color, astrokeStyle.width)
        }
        return r;
    }

    diagonal(aname: string, axSize: number, aySize: number, astrokeStyle?: IApgSvgStrokeStyle) {
        const halfXSize = axSize / 2;
        const halfYSize = aySize / 2;
        const r = this._doc.pattern(axSize, aySize, aname);
        const l1 = this._doc.line(0, halfYSize, halfXSize, aySize).childOf(r);
        const l2 = this._doc.line(0, 0, axSize, aySize).childOf(r);
        const l3 = this._doc.line(halfXSize, 0, axSize, halfYSize).childOf(r);

        if (astrokeStyle) {
            l1.stroke(astrokeStyle.color, astrokeStyle.width)
            l2.stroke(astrokeStyle.color, astrokeStyle.width)
            l3.stroke(astrokeStyle.color, astrokeStyle.width)
        }
        return r;
    }

    floor(aname: string, axSize: number, aySize: number, astrokeStyle?: IApgSvgStrokeStyle) {
        const halfXSize = axSize / 2;
        const halfYSize = aySize / 2;
        const qrtXSize = axSize / 4;
        const qrtYSize = aySize / 4;

        const pts: A2D.Apg2DPoint[] = [
            new A2D.Apg2DPoint(qrtXSize, halfYSize),
            new A2D.Apg2DPoint(halfXSize, qrtYSize),
            new A2D.Apg2DPoint(axSize - qrtXSize, halfYSize),
            new A2D.Apg2DPoint(halfXSize, aySize - qrtYSize)
        ]
        const r = this._doc.pattern(axSize, aySize, aname);
        const l1 = this._doc.line(0, halfYSize, pts[0].x, pts[0].y).childOf(r);
        const l2 = this._doc.line(halfXSize, 0, pts[1].x, pts[1].y).childOf(r);
        const l3 = this._doc.line(pts[2].x, pts[2].y, axSize, halfYSize).childOf(r);
        const l4 = this._doc.line(pts[3].x, pts[3].y, halfXSize, aySize).childOf(r);
        const r1 = this._doc.polygon(pts).fill("none").childOf(r);

        if (astrokeStyle) {
            l1.stroke(astrokeStyle.color, astrokeStyle.width)
            l2.stroke(astrokeStyle.color, astrokeStyle.width)
            l3.stroke(astrokeStyle.color, astrokeStyle.width)
            l4.stroke(astrokeStyle.color, astrokeStyle.width)
            r1.stroke(astrokeStyle.color, astrokeStyle.width)
        }
        return r;
    }

    bricks(aname: string, axSize: number, aySize: number, astrokeStyle?: IApgSvgStrokeStyle) {
        const halfXSize = axSize / 2;
        const halfYSize = aySize / 2;
        const cw = ((axSize > aySize) ? axSize : aySize) / 20;
        const cw2 = 2 * cw;
        const r = this._doc.pattern(axSize, aySize, aname);

        const r1 = this._doc.rect(cw, cw, axSize - cw2, halfYSize - cw2).fill("none").childOf(r);
        const r2 = this._doc.rect(halfXSize + cw, halfYSize + cw, axSize - cw2, halfYSize - cw2).fill("none").childOf(r);
        const r3 = this._doc.rect(-halfXSize + cw, halfYSize + cw, axSize - cw2, halfYSize - cw2).fill("none").childOf(r);

        if (astrokeStyle) {
            r1.stroke(astrokeStyle.color, astrokeStyle.width)
            r2.stroke(astrokeStyle.color, astrokeStyle.width)
            r3.stroke(astrokeStyle.color, astrokeStyle.width)
        }
        return r;
    }

    roof(aname: string, axSize: number, aySize: number, astrokeStyle?: IApgSvgStrokeStyle) {
        const halfXSize = axSize / 2;
        const halfYSize = aySize / 2;
        const pathBuilder = new ApgSvgPathBuilder();
        pathBuilder
            .moveAbs(0, halfYSize)
            .cubicAbs(halfXSize / 2, halfYSize, halfXSize, aySize - halfYSize / 2, halfXSize, aySize)
            .cubicAbs(halfXSize, aySize - halfYSize / 2, axSize - halfXSize / 2, halfYSize, axSize, halfYSize)
            .moveAbs(0, halfYSize)
            .cubicAbs(0, halfYSize / 2, halfXSize / 2, 0, halfXSize, 0)
            .cubicAbs(axSize - halfXSize / 2, 0, axSize, halfYSize / 2, axSize, halfYSize)

        const path = pathBuilder.build();

        const r = this._doc.pattern(axSize, aySize, aname);

        const p1 = this._doc.path(path).fill("none").childOf(r);

        if (astrokeStyle) {
            p1.stroke(astrokeStyle.color, astrokeStyle.width)
        }
        return r;
    }

    roofTiles(aname: string, axSize: number, aySize: number, astrokeStyle?: IApgSvgStrokeStyle) {
        const blockXSize = axSize / 10;
        const blockYSize = aySize / 10;
        const pathBuilder = new ApgSvgPathBuilder();
        pathBuilder
            .moveAbs(blockXSize, aySize)
            .lineAbs(0, blockYSize)
            .lineAbs(blockXSize, 0)
            .cubicAbs(blockXSize, 2 * blockYSize, axSize - blockXSize, 2 * blockYSize, axSize - blockXSize, 0)
            .lineAbs(axSize, blockYSize)
            .lineAbs(axSize - blockXSize, aySize)
            .moveAbs(0, blockYSize)
            .cubicAbs(0, 3 * blockYSize, axSize, 3 * blockYSize, axSize, blockYSize)

        const path = pathBuilder.build();

        const r = this._doc.pattern(axSize, aySize, aname);

        const p1 = this._doc.path(path).fill("none").childOf(r);

        if (astrokeStyle) {
            p1.stroke(astrokeStyle.color, astrokeStyle.width)
        }
        return r;
    }


}