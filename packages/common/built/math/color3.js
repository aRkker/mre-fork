"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color3 = void 0;
const _1 = require(".");
/**
 * Class used to hold a RBG color
 */
class Color3 {
    /**
     * Creates a new Color3 object from red, green, blue values, all between 0 and 1
     * @param r defines the red component (between 0 and 1, default is 0)
     * @param g defines the green component (between 0 and 1, default is 0)
     * @param b defines the blue component (between 0 and 1, default is 0)
     */
    constructor(
    /**
     * Defines the red component (between 0 and 1, default is 0)
     */
    r = 0, 
    /**
     * Defines the green component (between 0 and 1, default is 0)
     */
    g = 0, 
    /**
     * Defines the blue component (between 0 and 1, default is 0)
     */
    b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    /**
     * Creates a string with the Color3 current values
     * @returns the string representation of the Color3 object
     */
    toString() {
        return "{R: " + this.r + " G:" + this.g + " B:" + this.b + "}";
    }
    /**
     * Returns a JSON representation of this color. This is necessary due to the way
     * Actors detect changes on components like the actor's transform. They do this by adding
     * properties for observation, and we don't want these properties serialized.
     */
    toJSON() {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
        };
    }
    /**
     * Returns the string "Color3"
     * @returns "Color3"
     */
    getClassName() {
        return "Color3";
    }
    /**
     * Compute the Color3 hash code
     * @returns an unique number that can be used to hash Color3 objects
     */
    getHashCode() {
        let hash = this.r || 0;
        hash = (hash * 397) ^ (this.g || 0);
        hash = (hash * 397) ^ (this.b || 0);
        return hash;
    }
    // Operators
    /**
     * Stores in the given array from the given starting index the red, green, blue values as successive elements
     * @param array defines the array where to store the r,g,b components
     * @param index defines an optional index in the target array to define where to start storing values
     * @returns the current Color3 object
     */
    toArray(array, index = 0) {
        array[index] = this.r;
        array[index + 1] = this.g;
        array[index + 2] = this.b;
        return this;
    }
    copyFromArray(arr, index = 0) {
        this.r = arr[index];
        this.g = arr[index + 1];
        this.b = arr[index + 2];
        return this;
    }
    /**
     * Returns a new Color4 object from the current Color3 and the given alpha
     * @param alpha defines the alpha component on the new Color4 object (default is 1)
     * @returns a new Color4 object
     */
    toColor4(alpha = 1) {
        return new _1.Color4(this.r, this.g, this.b, alpha);
    }
    /**
     * Returns a new array populated with 3 numeric elements : red, green and blue values
     * @returns the new array
     */
    asArray() {
        const result = new Array();
        this.toArray(result, 0);
        return result;
    }
    /**
     * Returns the luminance value
     * @returns a float value
     */
    toLuminance() {
        return this.r * 0.3 + this.g * 0.59 + this.b * 0.11;
    }
    /**
     * Multiply each Color3 rgb values by the given Color3 rgb values in a new Color3 object
     * @param otherColor defines the second operand
     * @returns the new Color3 object
     */
    multiply(otherColor) {
        return new Color3(this.r * otherColor.r, this.g * otherColor.g, this.b * otherColor.b);
    }
    /**
     * Multiply the rgb values of the Color3 and the given Color3 and stores the result in the object "result"
     * @param otherColor defines the second operand
     * @param result defines the Color3 object where to store the result
     * @returns the current Color3
     */
    multiplyToRef(otherColor, result) {
        result.r = this.r * otherColor.r;
        result.g = this.g * otherColor.g;
        result.b = this.b * otherColor.b;
        return this;
    }
    /**
     * Determines equality between Color3 objects
     * @param otherColor defines the second operand
     * @returns true if the rgb values are equal to the given ones
     */
    equals(otherColor) {
        return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b;
    }
    /**
     * Determines equality between the current Color3 object and a set of r,b,g values
     * @param r defines the red component to check
     * @param g defines the green component to check
     * @param b defines the blue component to check
     * @returns true if the rgb values are equal to the given ones
     */
    equalsFloats(r, g, b) {
        return this.r === r && this.g === g && this.b === b;
    }
    /**
     * Multiplies in place each rgb value by scale
     * @param scale defines the scaling factor
     * @returns the updated Color3
     */
    scale(scale) {
        return new Color3(this.r * scale, this.g * scale, this.b * scale);
    }
    /**
     * Multiplies the rgb values by scale and stores the result into "result"
     * @param scale defines the scaling factor
     * @param result defines the Color3 object where to store the result
     * @returns the unmodified current Color3
     */
    scaleToRef(scale, result) {
        result.r = this.r * scale;
        result.g = this.g * scale;
        result.b = this.b * scale;
        return this;
    }
    /**
     * Scale the current Color3 values by a factor and add the result to a given Color3
     * @param scale defines the scale factor
     * @param result defines color to store the result into
     * @returns the unmodified current Color3
     */
    scaleAndAddToRef(scale, result) {
        result.r += this.r * scale;
        result.g += this.g * scale;
        result.b += this.b * scale;
        return this;
    }
    /**
     * Clamps the rgb values by the min and max values and stores the result into "result"
     * @param min defines minimum clamping value (default is 0)
     * @param max defines maximum clamping value (default is 1)
     * @param result defines color to store the result into
     * @returns the original Color3
     */
    clampToRef(min = 0, max = 1, result) {
        result.r = _1.Scalar.Clamp(this.r, min, max);
        result.g = _1.Scalar.Clamp(this.g, min, max);
        result.b = _1.Scalar.Clamp(this.b, min, max);
        return this;
    }
    /**
     * Creates a new Color3 set with the added values of the current Color3 and of the given one
     * @param otherColor defines the second operand
     * @returns the new Color3
     */
    add(otherColor) {
        return new Color3(this.r + otherColor.r, this.g + otherColor.g, this.b + otherColor.b);
    }
    /**
     * Stores the result of the addition of the current Color3 and given one rgb values into "result"
     * @param otherColor defines the second operand
     * @param result defines Color3 object to store the result into
     * @returns the unmodified current Color3
     */
    addToRef(otherColor, result) {
        result.r = this.r + otherColor.r;
        result.g = this.g + otherColor.g;
        result.b = this.b + otherColor.b;
        return this;
    }
    /**
     * Returns a new Color3 set with the subtracted values of the given one from the current Color3
     * @param otherColor defines the second operand
     * @returns the new Color3
     */
    subtract(otherColor) {
        return new Color3(this.r - otherColor.r, this.g - otherColor.g, this.b - otherColor.b);
    }
    /**
     * Stores the result of the subtraction of given one from the current Color3 rgb values into "result"
     * @param otherColor defines the second operand
     * @param result defines Color3 object to store the result into
     * @returns the unmodified current Color3
     */
    subtractToRef(otherColor, result) {
        result.r = this.r - otherColor.r;
        result.g = this.g - otherColor.g;
        result.b = this.b - otherColor.b;
        return this;
    }
    /**
     * Copy the current object
     * @returns a new Color3 copied the current one
     */
    clone() {
        return new Color3(this.r, this.g, this.b);
    }
    /**
     * Copies the rgb values from the source in the current Color3
     * @param source defines the source Color3 object
     * @returns the updated Color3 object
     */
    copyFrom(source) {
        this.r = source.r;
        this.g = source.g;
        this.b = source.b;
        return this;
    }
    /**
     * Updates the Color3 rgb values from the given floats
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @returns the current Color3 object
     */
    copyFromFloats(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }
    /**
     * Updates the Color3 rgb values from the given floats
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @returns the current Color3 object
     */
    set(r, g, b) {
        return this.copyFromFloats(r, g, b);
    }
    /**
     * Updates the Color3 from the sparsely populated value.
     * @param from The sparsely populated value to read from.
     */
    copy(from) {
        if (!from)
            return this;
        if (from.r !== undefined)
            this.r = from.r;
        if (from.g !== undefined)
            this.g = from.g;
        if (from.b !== undefined)
            this.b = from.b;
        return this;
    }
    /**
     * Compute the Color3 hexadecimal code as a string
     * @returns a string containing the hexadecimal representation of the Color3 object
     */
    toHexString() {
        const intR = (this.r * 255) || 0;
        const intG = (this.g * 255) || 0;
        const intB = (this.b * 255) || 0;
        return "#" + _1.Scalar.ToHex(intR) + _1.Scalar.ToHex(intG) + _1.Scalar.ToHex(intB);
    }
    /**
     * Computes a new Color3 converted from the current one to linear space
     * @returns a new Color3 object
     */
    toLinearSpace() {
        const convertedColor = new Color3();
        this.toLinearSpaceToRef(convertedColor);
        return convertedColor;
    }
    /**
     * Converts the Color3 values to linear space and stores the result in "convertedColor"
     * @param convertedColor defines the Color3 object where to store the linear space version
     * @returns the unmodified Color3
     */
    toLinearSpaceToRef(convertedColor) {
        convertedColor.r = Math.pow(this.r, _1.ToLinearSpace);
        convertedColor.g = Math.pow(this.g, _1.ToLinearSpace);
        convertedColor.b = Math.pow(this.b, _1.ToLinearSpace);
        return this;
    }
    /**
     * Computes a new Color3 converted from the current one to gamma space
     * @returns a new Color3 object
     */
    toGammaSpace() {
        const convertedColor = new Color3();
        this.toGammaSpaceToRef(convertedColor);
        return convertedColor;
    }
    /**
     * Converts the Color3 values to gamma space and stores the result in "convertedColor"
     * @param convertedColor defines the Color3 object where to store the gamma space version
     * @returns the unmodified Color3
     */
    toGammaSpaceToRef(convertedColor) {
        convertedColor.r = Math.pow(this.r, _1.ToGammaSpace);
        convertedColor.g = Math.pow(this.g, _1.ToGammaSpace);
        convertedColor.b = Math.pow(this.b, _1.ToGammaSpace);
        return this;
    }
    // Statics
    /**
     * Creates a new Color3 from the string containing valid hexadecimal values
     * @param hex defines a string containing valid hexadecimal values
     * @returns a new Color3 object
     */
    static FromHexString(hex) {
        if (hex.substring(0, 1) !== "#" || hex.length !== 7) {
            return new Color3(0, 0, 0);
        }
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return Color3.FromInts(r, g, b);
    }
    /**
     * Creates a new Vector3 from the starting index of the given array
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns a new Color3 object
     */
    static FromArray(array, offset = 0) {
        return new Color3(array[offset], array[offset + 1], array[offset + 2]);
    }
    /**
     * Creates a new Color3 from integer values (< 256)
     * @param r defines the red component to read from (value between 0 and 255)
     * @param g defines the green component to read from (value between 0 and 255)
     * @param b defines the blue component to read from (value between 0 and 255)
     * @returns a new Color3 object
     */
    static FromInts(r, g, b) {
        return new Color3(r / 255.0, g / 255.0, b / 255.0);
    }
    /**
     * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
     * @param start defines the start Color3 value
     * @param end defines the end Color3 value
     * @param amount defines the gradient value between start and end
     * @returns a new Color3 object
     */
    static Lerp(start, end, amount) {
        const result = new Color3(0.0, 0.0, 0.0);
        Color3.LerpToRef(start, end, amount, result);
        return result;
    }
    /**
     * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @param result defines the Color3 object where to store the result
     */
    static LerpToRef(left, right, amount, result) {
        result.r = left.r + ((right.r - left.r) * amount);
        result.g = left.g + ((right.g - left.g) * amount);
        result.b = left.b + ((right.b - left.b) * amount);
    }
    /**
     * Returns a Color3 value containing a red color
     * @returns a new Color3 object
     */
    static Red() { return new Color3(1, 0, 0); }
    /**
     * Returns a Color3 value containing a green color
     * @returns a new Color3 object
     */
    static Green() { return new Color3(0, 1, 0); }
    /**
     * Returns a Color3 value containing a blue color
     * @returns a new Color3 object
     */
    static Blue() { return new Color3(0, 0, 1); }
    /**
     * Returns a Color3 value containing a black color
     * @returns a new Color3 object
     */
    static Black() { return new Color3(0, 0, 0); }
    /**
     * Returns a Color3 value containing a white color
     * @returns a new Color3 object
     */
    static White() { return new Color3(1, 1, 1); }
    /**
     * Returns a Color3 value containing a purple color
     * @returns a new Color3 object
     */
    static Purple() { return new Color3(0.5, 0, 0.5); }
    /**
     * Returns a Color3 value containing a magenta color
     * @returns a new Color3 object
     */
    static Magenta() { return new Color3(1, 0, 1); }
    /**
     * Returns a Color3 value containing a yellow color
     * @returns a new Color3 object
     */
    static Yellow() { return new Color3(1, 1, 0); }
    /**
     * Returns a Color3 value containing a gray color
     * @returns a new Color3 object
     */
    static Gray() { return new Color3(0.5, 0.5, 0.5); }
    /**
     * Returns a Color3 value containing a light gray color
     * @returns a new Color3 object
     */
    static LightGray() { return new Color3(0.75, 0.75, 0.75); }
    /**
     * Returns a Color3 value containing a dark gray color
     * @returns a new Color3 object
     */
    static DarkGray() { return new Color3(0.25, 0.25, 0.25); }
    /**
     * Returns a Color3 value containing a teal color
     * @returns a new Color3 object
     */
    static Teal() { return new Color3(0, 1.0, 1.0); }
    /**
     * Returns a Color3 value containing a random color
     * @returns a new Color3 object
     */
    static Random() { return new Color3(Math.random(), Math.random(), Math.random()); }
}
exports.Color3 = Color3;
//# sourceMappingURL=color3.js.map