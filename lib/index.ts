const has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input: string): string | null {
	try {
		return decodeURIComponent(input.replace(/\+/g, " "));
	} catch (e) {
		return null;
	}
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input: string | any): string | null {
	try {
		return encodeURIComponent(input);
	} catch (e) {
		return null;
	}
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 * @description qs.parse('?foo=bar');         // { foo: 'bar' }
 * @description qs.parse('#foo=bar');         // { foo: 'bar' }
 * @description qs.parse('foo=bar');          // { foo: 'bar' }
 * @description qs.parse('foo=bar&bar=foo');  // { foo: 'bar', bar: 'foo' }
 * @description qs.parse('foo&bar=foo');      // { foo: '', bar: 'foo' }
 */
function querystring(query: string) {
	const parser = /([^=?#&]+)=?([^&]*)/g;
	const result: { [k: string]: any } = {};
	let part;

	while ((part = parser.exec(query))) {
		let key = decode(part[1]),
			value = decode(part[2]);

		//
		// Prevent overriding of existing properties. This ensures that build-in
		// methods like `toString` or __proto__ are not overriden by malicious
		// querystrings.
		//
		// In the case if failed decoding, we want to omit the key/value pairs
		// from the result.
		//
		if (key === null || value === null || key in result) continue;
		result[key] = value;
	}

	return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix. 分割前缀符号
 * @returns {String}
 * @description qs.stringify({ foo: bar });       // foo=bar
 * @description qs.stringify({ foo: bar }, true); // ?foo=bar
 * @description qs.stringify({ foo: bar }, '#');  // #foo=bar
 * @description qs.stringify({ foo: '' }, '&');   // &foo=
 * @api public
 */
function querystringify(obj: { [k: string]: any }, prefix?: string | boolean) {
	prefix = prefix || "";

	let pairs = [],
		value,
		key;

	//
	// Optionally prefix with a '?' if needed
	//
	if ("string" !== typeof prefix) prefix = "?";

	for (key in obj) {
		if (has.call(obj, key)) {
			value = obj[key];

			//
			// Edge cases where we actually want to encode the value to an empty
			// string instead of the stringified value.
			//
			if (!value && (value === null || value === undefined || isNaN(value))) {
				value = "";
			}

			key = encode(key);
			value = encode(value);

			//
			// If we failed to encode the strings, we should bail out as we don't
			// want to add invalid strings to the query.
			//
			if (key === null || value === null) continue;
			pairs.push(key + "=" + value);
		}
	}

	return pairs.length ? prefix + pairs.join("&") : "";
}

//
// Expose the module.
//
export const stringify = querystringify;
export const parse = querystring;
