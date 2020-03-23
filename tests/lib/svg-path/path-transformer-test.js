import { flipAcrossX } from "../../../js/lib/svg-path/path-transformer.js";
/*
describe("path-transformer", () => {
	describe("flipAcrossX", () => {
		[
			{ 
				input: { type: "moveAbsolute", points: [10, 10] },
				origin: 5,
				expectedValue: { type: "moveAbsolute", points: [10, 0]}
			},
			{
				input: { type: "moveAbsolute", points: [10, 10] },
				origin: 7,
				expectedValue: { type: "moveAbsolute", points: [10, 4] }
			},
			{
				input: { type: "moveAbsolute", points: [10, -10] },
				origin: 7,
				expectedValue: { type: "moveAbsolute", points: [10, 24] }
			},
			{
				input: { type: "moveRelative", points: [10, 10] },
				origin: 5,
				expectedValue: { type: "moveRelative", points: [10, 0] }
			},
			{
				input: { type: "moveRelative", points: [10, 10] },
				origin: 15,
				expectedValue: { type: "moveRelative", points: [10, 20] }
			},
			{
				input: { type: "lineAbsolute", points: [10, 10] },
				origin: 5,
				expectedValue: { type: "lineAbsolute", points: [10, 0] }
			},
			{
				input: { type: "lineRelative", points: [10, 10] },
				origin: 5,
				expectedValue: { type: "lineRelative", points: [10, 0] }
			},
			{
				input: { type: "horizontalLineAbsolute", points: [10] },
				origin: 5,
				expectedValue: { type: "horizontalLineAbsolute", points: [10] }
			},
			{
				input: { type: "horizontalLineRelative", points: [10] },
				origin: 5,
				expectedValue: { type: "horizontalLineRelative", points: [10] }
			},
			{
				input: { type: "verticalLineAbsolute", points: [10] },
				origin: 5,
				expectedValue: { type: "verticalLineAbsolute", points: [0] }
			},
			{
				input: { type: "verticalLineRelative", points: [10] },
				origin: 5,
				expectedValue: { type: "verticalLineRelative", points: [0] }
			},
			{
				input: { type: "cubicCurveAbsolute", points: [10, 10, 5, 5, 15, 15] },
				origin: 5,
				expectedValue: { type: "cubicCurveAbsolute", points: [10, 0, 5, 5, 15, -5] }
			},
			{
				input: { type: "cubicCurveRelative", points: [10, 10, 5, 5, 15, 15] },
				origin: 5,
				expectedValue: { type: "cubicCurveRelative", points: [10, 0, 5, 5, 15, -5] }
			},
		].forEach(x => 
			it(`should flip [${JSON.stringify(x.input)}] around ${x.origin}`, () => {
				expect(flipAcrossX(x.input, x.origin)).toEqual(x.expectedValue);
			}));
	});
});
*/