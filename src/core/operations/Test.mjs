/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

export const ALPHABET_OPTIONS = [
    {
        name: "Standard", // https://www.rfc-editor.org/rfc/rfc4648#section-6
        value: "A-Z2-7=",
    },
    {
        name: "Hex Extended", // https://www.rfc-editor.org/rfc/rfc4648#section-7
        value: "0-9A-V=",
    },
];

/**
 * To Base32 operation
 */
class Test extends Operation {

    /**
     * ToBase32 constructor
     */
    constructor() {
        super();

        this.name = "Test";
        this.module = "Default";
        this.description = "This is a test module";
        this.infoURL = "https://wikipedia.org/wiki/Tests";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Alphabet",
                type: "editableOption",
                value: ALPHABET_OPTIONS
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return "";
        input = new Uint8Array(input);

        const alphabet = args[0] ? Utils.expandAlphRange(args[0]).join("") : "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=";
        let output = "",
            chr1, chr2, chr3, chr4, chr5,
            enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8,
            i = 0;
        while (i < input.length) {
            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];
            chr4 = input[i++];
            chr5 = input[i++];

            enc1 = chr1 >> 3;
            enc2 = ((chr1 & 7) << 2) | (chr2 >> 6);
            enc3 = (chr2 >> 1) & 31;
            enc4 = ((chr2 & 1) << 4) | (chr3 >> 4);
            enc5 = ((chr3 & 15) << 1) | (chr4 >> 7);
            enc6 = (chr4 >> 2) & 31;
            enc7 = ((chr4 & 3) << 3) | (chr5 >> 5);
            enc8 = chr5 & 31;

            if (isNaN(chr2)) {
                enc3 = enc4 = enc5 = enc6 = enc7 = enc8 = 32;
            } else if (isNaN(chr3)) {
                enc5 = enc6 = enc7 = enc8 = 32;
            } else if (isNaN(chr4)) {
                enc6 = enc7 = enc8 = 32;
            } else if (isNaN(chr5)) {
                enc8 = 32;
            }

            output += alphabet.charAt(enc1) + alphabet.charAt(enc2) + alphabet.charAt(enc3) +
                alphabet.charAt(enc4) + alphabet.charAt(enc5) + alphabet.charAt(enc6) +
                alphabet.charAt(enc7) + alphabet.charAt(enc8);
        }
        return output;
    }

}

export default Test;

