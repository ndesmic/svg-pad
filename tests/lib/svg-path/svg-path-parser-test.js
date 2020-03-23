import { SvgPathParser } from "../../../js/lib/svg-path/svg-path-parser.js";

describe("svg-path-parser", () => {
	it("should tokenize path", () => {
		const svgPathParser = new SvgPathParser();
		const result = svgPathParser.tokenizePath("C-0.171767888,10.638723 -0.238720425,11.6876357 0.617810306,11.6411804");

		expect(result).toEqual([
			"C",
			"-0.171767888",
			"10.638723",
			"-0.238720425",
			"11.6876357",
			"0.617810306",
			"11.6411804"
		]);
	});

	it("should parse M", () => {
		const svgPathParser = new SvgPathParser();
		const result = svgPathParser.parsePath("M0.61319289,10.4895769");

		expect(result[0]).toEqual({
			points: [0.61319289, 10.4895769],
			type: "moveAbsolute"
		});
	});

	it("should parse C", () => {
		const svgPathParser = new SvgPathParser();
		const result = svgPathParser.parsePath("C-0.171767888,10.638723 -0.238720425,11.6876357 0.617810306,11.6411804");

		expect(result[0]).toEqual({
			points: [-0.171767888, 10.638723, -0.238720425, 11.6876357, 0.617810306, 11.6411804],
			type: "cubicCurveAbsolute"
		});
	});
});