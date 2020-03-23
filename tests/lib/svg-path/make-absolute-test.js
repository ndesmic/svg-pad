import { makeAbsolute } from "../../../js/lib/svg-path/make-absolute.js";

describe("make-absolute", () => {
	describe("makeAbsolute", () => {
		[
			{ 
				input : [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "moveAbsolute", points: [20, 20] }
				],
				expectedValue : [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "moveAbsolute", points: [20, 20] }
				]
			},
			{
				input: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "moveRelative", points: [10, 10] }
				],
				expectedValue: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "moveAbsolute", points: [20, 20] }
				]
			},
			{
				input: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "lineAbsolute", points: [20, 20] }
				],
				expectedValue: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "lineAbsolute", points: [20, 20] }
				]
			},
			{
				input: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "lineRelative", points: [10, 10] }
				],
				expectedValue: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "lineAbsolute", points: [20, 20] }
				]
			},
			{
				input: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "horizontalLineAbsolute", points: [20] }
				],
				expectedValue: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "horizontalLineAbsolute", points: [20] }
				]
			},
			{
				input: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "horizontalLineRelative", points: [10] }
				],
				expectedValue: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "horizontalLineAbsolute", points: [20] }
				]
			},
			{
				input: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "verticalLineAbsolute", points: [20] }
				],
				expectedValue: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "verticalLineAbsolute", points: [20] }
				]
			},
			{
				input: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "verticalLineRelative", points: [10] }
				],
				expectedValue: [
					{ type: "moveAbsolute", points: [10, 10] },
					{ type: "verticalLineAbsolute", points: [20] }
				]
			}
		]
		.forEach(test => {
			it(`should make ${test.input[1].type} absolute`, () => {
				const result = makeAbsolute(test.input);
				expect(result).toEqual(test.expectedValue);
			});
		})
	});
});