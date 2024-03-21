"use strict";
const expect = require("chai").expect;
const { stringify, parse } = require("../dist/index");

describe("querystringify-ts function test", () => {
	it("stringify", () => {
		const params = {
			foo: "bar",
		};
		const result = stringify(params);
		expect(result).to.equal("foo=bar");
	});

	it("parse", () => {
		const params = {
			foo: "bar",
		};
		const result = parse(stringify(params));
		expect(JSON.stringify(result)).to.equal(JSON.stringify(params));
	});
});
