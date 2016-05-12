test("Parses M", function(){
	var instructions = svgPath._parsePath("M 0,0");
	var instructionsExpectation = [
		{
			instruction : "M",
			points : ["0,0"]
		}
	];
	assert.deepEqual(instructions, instructionsExpectation, "parsed instruction")
});