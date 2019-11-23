export class InstructionSimplifier {
    constructor() {
        this.bind(this);
    }

    bind(instructionSimplifier) {
        instructionSimplifier.simplifyInstructions = this.simplifyInstructions.bind(instructionSimplifier);
        instructionSimplifier.simplifyInstruction = this.simplifyInstruction.bind(instructionSimplifier);
        instructionSimplifier.moveAbsolute = this.moveAbsolute.bind(instructionSimplifier);
        instructionSimplifier.moveRelative = this.moveRelative.bind(instructionSimplifier);
        instructionSimplifier.lineAbsolute = this.lineAbsolute.bind(instructionSimplifier);
        instructionSimplifier.lineRelative = this.lineRelative.bind(instructionSimplifier);
        instructionSimplifier.horizontalLineAbsolute = this.horizontalLineAbsolute.bind(instructionSimplifier);
        instructionSimplifier.horizontalLineRelative = this.horizontalLineRelative.bind(instructionSimplifier);
        instructionSimplifier.verticalLineAbsolute = this.verticalLineAbsolute.bind(instructionSimplifier);
        instructionSimplifier.verticalLineRelative = this.verticalLineRelative.bind(instructionSimplifier);
        instructionSimplifier.cubicCurveAbsolute = this.cubicCurveAbsolute.bind(instructionSimplifier);
        instructionSimplifier.cubicCurveRelative = this.cubicCurveRelative.bind(instructionSimplifier);
    }

    simplifyInstructions(pathInstructions) {
        var simplifiedInstructions = [];
        this.currentPoint = {
            x: 0,
            y: 0
        };
        for (var i = 0; i < pathInstructions.length; i++) {
            simplifiedInstructions.push(...[].concat(this.simplifyInstruction(pathInstructions, i)));
        }
        return simplifiedInstructions;
    }

    simplifyInstruction(instructions, index) {
        var instruction = instructions[index];
        return this[instruction.type](instructions, index, ...instruction.points);
    }

    moveAbsolute(instructions, index, x, y) {
        this.currentPoint = {
            x,
            y
        };
        return instructions[index];
    }

    moveRelative(instructions, index, dx, dy) {
        var instruction = instructions[index];
        return {
            type: "moveAbsolute",
            points: [this.currentPoint.x + dx, this.currentPoint.y + dy]
        };
    }

    lineAbsolute(instructions, index, x, y) {
        let last = this.currentPoint;
        this.currentPoint = {
            x,
            y
        };
        return {
            type: "lineAbsolute",
            points: [x, y]
        };
    }

    lineRelative(instructions, index, dx, dy) {
        var instruction = instructions[index];
        return {
            type: "lineAbsolute",
            points: [this.currentPoint.x, this.currentPoint.y, this.currentPoint.x + dx, this.currentPoint.y + dy]
        };
    }

    horizontalLineAbsolute(instructions, index, x) {
        var instruction = instructions[index];
        return {
            type: "lineAbsolute",
            points: [this.currentPoint.x, this.currentPoint.y, x, this.currentPoint.y]
        };
    }

    horizontalLineRelative(instructions, index, dx) {
        var instruction = instructions[index];
        return {
            type: "lineAbsolute",
            points: [this.currentPoint.x, this.currentPoint.y, this.currentPoint.x + dx, this.currentPoint.y]
        };
    }

    verticalLineAbsolute(instructions, index, y) {
        var instruction = instructions[index];
        return {
            type: "lineAbsolute",
            points: [this.currentPoint.x, this.currentPoint.y, this.currentPoint.x, y]
        };
    }

    verticalLineRelative(instructions, index, dy) {
        var instruction = instructions[index];
        return {
            type: "lineAbsolute",
            points: [this.currentPoint.x, this.currentPoint.y, this.currentPoint.x, this.currentPoint.y + dy]
        };
    }

    cubicCurveAbsolute(instructions, index, startCX, startCY, endCX, endCY, x, y) {
        this.currentPoint = {
            x: x,
            y: y
        };
        return instructions[index];
    }

    cubicCurveRelative(instructions, index, startCX, startCY, endCX, endCY, dx, dy) {
        var instruction = instructions[index];
        return {
            type: "cubicCurveAbsolute",
            points: [startCX, startCY, endCX, endCY, this.currentPoint.x + dx, this.currentPoint.y + dy]
        };
    }

    cubicCurveShortAbsolute(instructions, index, endCX, endCY, x, y) {
        var instruction = instructions[index];
        return {
            type: "cubicCurveAbsolute",
            points: [startCX, startCY, endCX, endCY, this.currentPoint.x + dx, this.currentPoint.y + dy]
        };
    }
}