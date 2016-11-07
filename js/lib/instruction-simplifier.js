var InstructionSimplifier = (function(){

    function create(){
        var instructionSimplifier = {};
        bind(instructionSimplifier);
        instructionSimplifier.init();
        return instructionSimplifier;
    }
    function bind(instructionSimplifier){
        instructionSimplifier.init = init.bind(instructionSimplifier);
        instructionSimplifier.simplifyInstructions = simplifyInstructions.bind(instructionSimplifier);
        instructionSimplifier.simplifyInstruction = simplifyInstruction.bind(instructionSimplifier);
        instructionSimplifier.moveAbsolute = moveAbsolute.bind(instructionSimplifier);
        instructionSimplifier.moveRelative = moveRelative.bind(instructionSimplifier);
        instructionSimplifier.lineAbsolute = lineAbsolute.bind(instructionSimplifier);
        instructionSimplifier.lineRelative = lineRelative.bind(instructionSimplifier);
        instructionSimplifier.horizontalLineAbsolute = horizontalLineAbsolute.bind(instructionSimplifier);
        instructionSimplifier.horizontalLineRelative = horizontalLineRelative.bind(instructionSimplifier);
        instructionSimplifier.verticalLineAbsolute = verticalLineAbsolute.bind(instructionSimplifier);
        instructionSimplifier.verticalLineRelative = verticalLineRelative.bind(instructionSimplifier);
        instructionSimplifier.cubicCurveAbsolute = cubicCurveAbsolute.bind(instructionSimplifier);
        instructionSimplifier.cubicCurveRelative = cubicCurveRelative.bind(instructionSimplifier);
    }
    function simplifyInstructions(pathInstructions){
        var simplifiedInstructions = [];
        this.currentPoint = { x : 0, y : 0 };
        for(var i = 0; i < pathInstructions.length; i++){
            simplifiedInstructions.push(...[].concat(this.simplifyInstruction(pathInstructions, i)));
        }
        return simplifiedInstructions;
    }
    function simplifyInstruction(instructions, index){
        var instruction = instructions[index];
        return this[instruction.type](instructions, index, ...instruction.points);
    }
    function moveAbsolute(instructions, index, x, y){
        this.currentPoint = { x, y };
        return instructions[index];
    }
    function moveRelative(instructions, index, dx, dy){
        var instruction = instructions[index];
        return {
            type : "moveAbsolute",
            points : [this.currentPoint.x + dx, this.currentPoint.y + dy]
        };
    }
    function lineAbsolute(instructions, index, x, y){
        let last = this.currentPoint;
		this.currentPoint = { x, y };
    	return {
			type : "lineAbsolute",
			points : [last.x, last.y, x, y]
		};
    }
    function lineRelative(instructions, index, dx, dy){
        var instruction = instructions[index];
        return {
            type : "lineAbsolute",
            points : [this.currentPoint.x, this.currentPoint.y, this.currentPoint.x + dx, this.currentPoint.y + dy]
        };
    }
    function horizontalLineAbsolute(instructions, index, x){
        var instruction = instructions[index];
        return {
            type : "lineAbsolute",
            points : [this.currentPoint.x, this.currentPoint.y, x, this.currentPoint.y]
        };
    }
    function horizontalLineRelative(instructions, index, dx){
        var instruction = instructions[index];
        return {
            type : "lineAbsolute",
            points : [this.currentPoint.x, this.currentPoint.y, this.currentPoint.x + dx, this.currentPoint.y]
        };
    }
    function verticalLineAbsolute(instructions, index, y){
        var instruction = instructions[index];
        return {
            type : "lineAbsolute",
            points : [this.currentPoint.x, this.currentPoint.y, this.currentPoint.x, y]
        };
    }
    function verticalLineRelative(instructions, index, dy){
        var instruction = instructions[index];
        return {
            type : "lineAbsolute",
            points : [this.currentPoint.x, this.currentPoint.y, this.currentPoint.x, this.currentPoint.y + dy]
        };
    }
    function cubicCurveAbsolute(instructions, index, startCX, startCY, endCX, endCY, x, y){
        this.currentPoint = { x : x, y : y };
        return instructions[index];
    }
    function cubicCurveRelative(instructions, index, startCX, startCY, endCX, endCY, dx, dy){
        var instruction = instructions[index];
        return {
            type : "cubicCurveAbsolute",
            points : [startCX, startCY, endCX, endCY, this.currentPoint.x + dx, this.currentPoint.y + dy]
        };
    }
    function cubicCurveShortAbsolute(instructions, index, endCX, endCY, x, y){
        var instruction = instructions[index];
        return {
            type : "cubicCurveAbsolute",
            points : [startCX, startCY, endCX, endCY, this.currentPoint.x + dx, this.currentPoint.y + dy]
        };
    }
    function init(){

    }
    return {
        create : create
    };
})();
