const types = [
    "moveAbsolute",
    "moveRelative",
    "lineAbsolute",
    "lineRelative",
    "cubicCurveAbsolute",
    "cubicCurveRelative",
    "closePath",
    "cubicCurveShortAbsolute",
    "cubicCurveShortRelative",
    "quadraticAbsolute",
    "quadraticRelative",
    "quadraticSmoothAbsolute",
    "quadraticSmoothRelative",
    "arcAbsolute",
    "arcRelative"
];

function rotate(position, angle, invertY = false) {
    if(invertY){
        return [
            Math.cos(angle) * position[0] + Math.sin(angle) * position[1],
            -Math.sin(angle) * position[0] + Math.cos(angle) * position[1]
        ];
    } else {
        return [
            Math.cos(angle) * position[0] - Math.sin(angle) * position[1],
            Math.sin(angle) * position[0] + Math.cos(angle) * position[1]
        ];
    }
}

function angleBetweenVectors(v1, v2){
    return Math.acos(dot(v1, v2) / (mag(v1) * mag(v2)))
}

function add(v1, v2){
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

function dot(v1, v2){
    return v1[0] * v2[0] + v1[1] * v2[1];
}

function mag(v){
    return Math.sqrt(v[0] ** 2 + v[1] ** 2);
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

const TWO_PI = Math.PI * 2;
export function normalizeAngle(angle) {
    if (angle < 0) {
        return TWO_PI - (Math.abs(angle) % TWO_PI);
    }
    return angle % TWO_PI;
}

export class CanvasRenderer {

    constructor(canvas = null) {
        this.bind(this);
        this.canvas = canvas || document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.currentPoint = {
            x: 0,
            y: 0
        };
    }

    bind(canvasRenderer) {
        canvasRenderer.drawInstructionList = this.drawInstructionList.bind(canvasRenderer);
        canvasRenderer.drawInstruction = this.drawInstruction.bind(canvasRenderer);
        canvasRenderer.setupStoke = this.setupStroke.bind(canvasRenderer);
        canvasRenderer.clear = this.clear.bind(canvasRenderer);
        canvasRenderer.moveAbsolute = this.moveAbsolute.bind(canvasRenderer);
        canvasRenderer.lineAbsolute = this.lineAbsolute.bind(canvasRenderer);
        canvasRenderer.cubicCurveAbsolute = this.cubicCurveAbsolute.bind(canvasRenderer);
    }

    drawInstructionList(pathInstructions, options) {
        this.setupStoke(options);
        this.context.beginPath();
        for (let instruction of pathInstructions) {
            this.drawInstruction(instruction);
            if(!this.startPoint){ //Not even close to correct, just assume we started with a M
                this.startPoint = {
                    x: instruction.points[0],
                    y: instruction.points[1]
                };
            }
        }
        if (options.fillColor && options.fillColor !== "none") {
            this.context.fillStyle = options.fillColor;
            this.context.fill();
        }
        if (options.stroke) {
            this.context.strokeStyle = options.stroke;
            this.context.stroke();
        }
    }

    drawInstruction(instruction, options) {
        if (!types.includes(instruction.type)) {
            console.log(`Unknown instruction: ${instruction.type}`);
        } else {
            this[instruction.type](...instruction.points)
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupStroke(options) {
        options = {
            ...{
                strokeColor: "#000",
                strokeWidth: 1,
                fillColor: null
            },
            ...options
        };
        this.context.strokeStyle = options.strokeColor;
        this.context.lineWidth = options.strokeWidth;
        this.context.fillStyle = options.fillColor;
    }

    moveAbsolute(x, y) {
        this.context.stroke();
        this.context.moveTo(x, y);
        this.currentPoint = {
            x,
            y
        };
    }

    moveRelative(x, y) {
        const nx = this.currentPoint.x + x;
        const ny = this.currentPoint.y + y;
        this.context.moveTo(nx, ny);
        this.currentPoint = {
            x: nx,
            y:ny
        };
    }

    lineAbsolute(x, y) {
        this.context.lineTo(x, y);
        this.currentPoint = {
            x,
            y
        };
    }

    lineRelative(x, y) {
        const nx = this.currentPoint.x + x;
        const ny = this.currentPoint.y + y;
        this.context.lineTo(nx, ny);
        this.currentPoint = {
            x: nx,
            y: ny
        };
    }

    closePath(){
        this.context.lineTo(this.startPoint.x, this.startPoint.y);
        this.currentPoint = { ...this.startPoint };
    }

    cubicCurveAbsolute(controlStartX, controlStartY1, controlEndX, controlEndY, x, y) {
        this.context.bezierCurveTo(controlStartX, controlStartY1, controlEndX, controlEndY, x, y);
        this.currentPoint = {
            x,
            y
        };
    }

    arcAbsolute(rx, ry, xAxisRotation, largeArc, sweep, x, y){
        const rotation  = degreesToRadians(xAxisRotation);
        const mdx = (this.currentPoint.x - x) / 2; //mid delta x
        const mdy = (this.currentPoint.y - y) / 2; //mid delta y
        const [tx, ty] = rotate([mdx, mdy], rotation, true); //transformed x,y


        const topTerm = (rx ** 2 * ry ** 2) - (rx ** 2 * ty ** 2) - (ry ** 2 * tx ** 2);
        const bottomTerm = (rx ** 2 * ty ** 2) + (ry ** 2 * tx ** 2);
        const radicant = topTerm / bottomTerm;
        const coefficent = Math.sqrt(radicant) * (largeArc === sweep ? -1 : 1);

        const tcx = coefficent * ((rx * ty) / ry); //transformed center x
        const tcy = coefficent * -((ry * tx) / rx); //transformed center y
        const [cx, cy] = add(rotate([tcx,tcy], rotation), [mdx, mdy]); //rotate around mdx,mdy
        const startAngle = angleBetweenVectors([1,0], [(mdx - tcx), (mdy - tcy)]);
        const deltaAngle = angleBetweenVectors([mdx - tcx, mdy - tcy], [-mdx - tcx,  -mdy- tcy]);
        const endAngle = startAngle + deltaAngle;

        this.context.ellipse(x + cx, x + cy, rx, ry, rotation, startAngle, endAngle, sweep !== 1);
    }
}