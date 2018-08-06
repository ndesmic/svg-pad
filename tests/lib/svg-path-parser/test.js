test("tokenizes path", function(){
	const svgPathParser = SvgPathParser.create();
	const result = svgPathParser.tokenizePath("C-0.171767888,10.638723 -0.238720425,11.6876357 0.617810306,11.6411804");
	
	assert.deepEqual(result, [
		"C",
		"-0.171767888",
		"10.638723",
		"-0.238720425",
		"11.6876357",
		"0.617810306",
		"11.6411804"
	], "tokenized instructions");
});

test("parse M", function(){
	const svgPathParser = SvgPathParser.create();
	const result = svgPathParser.parsePath("M0.61319289,10.4895769");
	
	assert.deepEqual(result[0], {
		points: [0.61319289, 10.4895769],
		type: "moveAbsolute"	
	}, "parsed instructions 0");
});

test("parse C", function(){
	const svgPathParser = SvgPathParser.create();
	const result = svgPathParser.parsePath("C-0.171767888,10.638723 -0.238720425,11.6876357 0.617810306,11.6411804");

	assert.deepEqual(result[0], {
		points: [-0.171767888, 10.638723, -0.238720425, 11.6876357, 0.617810306, 11.6411804],
		type: "cubicCurveAbsolute"	
	}, "parsed instructions 1");
});