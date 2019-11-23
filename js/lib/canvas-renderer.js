const types = [
    "moveAbsolute",
    "lineAbsolute",
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
        for (var i = 0; i < pathInstructions.length; i++) {
            this.drawInstruction(pathInstructions[i]);
        }
        if (options.fillColor) {
            this.context.fill();
        }
        if (options.stroke) {
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
        options = Object.assign({}, {
            strokeColor: "#000",
            strokeWidth: 1,
            fillColor: null
        }, options);
        this.context.strokeStyle = options.strokeColor;
        this.context.lineWidth = options.strokeWidth;
        this.context.fillStyle = options.fillColor;
    }

    moveAbsolute(x, y) {
        this.context.moveTo(x, y);
        this.currentPoint = {
            x,
            y
        };
    }

    lineAbsolute(x, y) {
        this.context.lineTo(x, y);
        this.currentPoint = {
            x,
            y
        };
    }

    cubicCurveAbsolute(controlStartX, controlStartY1, controlEndX, controlEndY, x, y) {
        this.context.bezierCurveTo(controlStartX, controlStartY1, controlEndX, controlEndY, x, y);
        this.currentPoint = {
            x,
            y
        };
    }
}