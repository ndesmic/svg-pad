const CanvasRenderer = (function() {

    const defaults = {
        canvas: null
    };

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

    function create(options) {
        let canvasRenderer = {};
        canvasRenderer.options = Object.assign({}, defaults, options);
        bind(canvasRenderer);
        canvasRenderer.init();
        return canvasRenderer;
    }

    function bind(canvasRenderer) {
        canvasRenderer.drawInstructionList = drawInstructionList.bind(canvasRenderer);
        canvasRenderer.drawInstruction = drawInstruction.bind(canvasRenderer);
        canvasRenderer.init = init.bind(canvasRenderer);
        canvasRenderer.setupStoke = setupStroke.bind(canvasRenderer);
        canvasRenderer.clear = clear.bind(canvasRenderer);
        canvasRenderer.moveAbsolute = moveAbsolute.bind(canvasRenderer);
        canvasRenderer.lineAbsolute = lineAbsolute.bind(canvasRenderer);
        canvasRenderer.cubicCurveAbsolute = cubicCurveAbsolute.bind(canvasRenderer);
    }

    function drawInstructionList(pathInstructions, options) {
        this.setupStoke(options);
        this.context.beginPath();
        for (var i = 0; i < pathInstructions.length; i++) {
            this.drawInstruction(pathInstructions[i]);
        }
        this.context.stroke();
    }

    function drawInstruction(instruction, options) {
        if (!types.includes(instruction.type)) {
            console.log(`Unknown instruction: ${instruction.type}`);
        } else {
            this[instruction.type](...instruction.points)
        }
    }

    function clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    function setupStroke(options){
      options = Object.assign({}, {
        strokeColor : "#000",
        strokeWidth : 1,
        fillColor : "#000"
      }, options);
      this.context.strokeStyle = options.strokeColor;
      this.context.lineWidth = options.strokeWidth;
      this.context.fillStyle = options.fillColor;
    }

    function moveAbsolute(x, y) {
        this.context.moveTo(x, y);
        this.currentPoint.x = x;
        this.currentPoint.y = y;
    }

    function lineAbsolute(x, y, x2, y2) {
        this.moveAbsolute(x, y);
        this.context.lineTo(x2, y2);
        this.currentPoint = {
            x: x2,
            y: y2
        };
    }

    function cubicCurveAbsolute(controlStartX, controlStartY1, controlEndX, controlEndY, x, y) {
        this.context.bezierCurveTo(controlStartX, controlStartY1, controlEndX, controlEndY, x, y);
        this.currentPoint = {
            x: x,
            y: y
        };
    }

    function init() {
        this.canvas = this.options.canvas || document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.currentPoint = {
            x: 0,
            y: 0
        };
    }

    return {
        create
    };

})();
