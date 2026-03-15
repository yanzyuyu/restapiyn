import React from "react";
import { Type, Calculator, Shield, Smile } from "lucide-react";

const createStrEp = (id: string, title: string, path: string) => ({
  id, title, category: "String Utilities", method: "GET", path,
  description: `String utility: ${title}`,
  params: [{ name: "text", type: "string", description: "Input text" }],
  icon: <Type className="w-5 h-5" />,
  example: `${path}?text=hello+world`
});

const createMathEp = (id: string, title: string, path: string, twoParams = false) => ({
  id, title, category: "Math Utilities", method: "GET", path,
  description: `Math utility: ${title}`,
  params: twoParams 
    ? [{ name: "a", type: "number", description: "Number a" }, { name: "b", type: "number", description: "Number b" }]
    : [{ name: "a", type: "number", description: "Number a" }],
  icon: <Calculator className="w-5 h-5" />,
  example: twoParams ? `${path}?a=5&b=10` : `${path}?a=5`
});

const createCryptoEp = (id: string, title: string, path: string, param = "text") => ({
  id, title, category: "Crypto & Encoding", method: "GET", path,
  description: `Crypto utility: ${title}`,
  params: param === "none" ? [] : [{ name: param, type: param === "size" ? "number" : "string", description: `Input ${param}` }],
  icon: <Shield className="w-5 h-5" />,
  example: param === "none" ? path : `${path}?${param}=${param === "size" ? "16" : "hello"}`
});

const createFakerEp = (id: string, title: string, path: string) => ({
  id, title, category: "Fake Data", method: "GET", path,
  description: `Fake data: ${title}`,
  params: [],
  icon: <Smile className="w-5 h-5" />,
  example: path
});

export const extraEndpoints = [
  createStrEp("str-upper", "Uppercase", "/api/str/upper"),
  createStrEp("str-lower", "Lowercase", "/api/str/lower"),
  createStrEp("str-length", "String Length", "/api/str/length"),
  createStrEp("str-reverse", "Reverse String", "/api/str/reverse"),
  createStrEp("str-trim", "Trim String", "/api/str/trim"),
  createStrEp("str-urlencode", "URL Encode", "/api/str/urlencode"),
  createStrEp("str-urldecode", "URL Decode", "/api/str/urldecode"),
  createStrEp("str-wordcount", "Word Count", "/api/str/wordcount"),
  createStrEp("str-charcount", "Char Count (No Spaces)", "/api/str/charcount"),
  createStrEp("str-capitalize", "Capitalize", "/api/str/capitalize"),

  createMathEp("math-add", "Addition", "/api/math/add", true),
  createMathEp("math-sub", "Subtraction", "/api/math/sub", true),
  createMathEp("math-mul", "Multiplication", "/api/math/mul", true),
  createMathEp("math-div", "Division", "/api/math/div", true),
  createMathEp("math-pow", "Power", "/api/math/pow", true),
  createMathEp("math-sqrt", "Square Root", "/api/math/sqrt"),
  createMathEp("math-round", "Round", "/api/math/round"),
  createMathEp("math-floor", "Floor", "/api/math/floor"),
  createMathEp("math-ceil", "Ceil", "/api/math/ceil"),
  createMathEp("math-abs", "Absolute", "/api/math/abs"),

  createCryptoEp("crypto-md5", "MD5 Hash", "/api/crypto/md5"),
  createCryptoEp("crypto-sha1", "SHA1 Hash", "/api/crypto/sha1"),
  createCryptoEp("crypto-sha256", "SHA256 Hash", "/api/crypto/sha256"),
  createCryptoEp("crypto-sha512", "SHA512 Hash", "/api/crypto/sha512"),
  createCryptoEp("crypto-rand-hex", "Random Hex", "/api/crypto/random-hex", "size"),
  createCryptoEp("crypto-rand-b64", "Random Base64", "/api/crypto/random-base64", "size"),
  createCryptoEp("crypto-uuid", "UUID v4", "/api/crypto/uuid-v4", "none"),
  createCryptoEp("crypto-rot13", "ROT13", "/api/crypto/rot13"),
  createCryptoEp("crypto-btoa", "Base64 Encode", "/api/crypto/btoa"),
  createCryptoEp("crypto-atob", "Base64 Decode", "/api/crypto/atob"),

  createFakerEp("faker-name", "Random Name", "/api/faker/name"),
  createFakerEp("faker-email", "Random Email", "/api/faker/email"),
  createFakerEp("faker-username", "Random Username", "/api/faker/username"),
  createFakerEp("faker-password", "Random Password", "/api/faker/password"),
  createFakerEp("faker-phone", "Random Phone", "/api/faker/phone"),
  createFakerEp("faker-address", "Random Address", "/api/faker/address"),
  createFakerEp("faker-city", "Random City", "/api/faker/city"),
  createFakerEp("faker-country", "Random Country", "/api/faker/country"),
  createFakerEp("faker-company", "Random Company", "/api/faker/company"),
  createFakerEp("faker-job", "Random Job Title", "/api/faker/job-title"),
  createFakerEp("faker-avatar", "Random Avatar", "/api/faker/avatar"),
  createFakerEp("faker-color-hex", "Random Color Hex", "/api/faker/color-hex"),
  createFakerEp("faker-color-name", "Random Color Name", "/api/faker/color-name"),
  createFakerEp("faker-emoji", "Random Emoji", "/api/faker/emoji"),
  createFakerEp("faker-word", "Random Word", "/api/faker/word"),
  createFakerEp("faker-sentence", "Random Sentence", "/api/faker/sentence"),
  createFakerEp("faker-paragraph", "Random Paragraph", "/api/faker/paragraph"),
  createFakerEp("faker-past", "Random Past Date", "/api/faker/date-past"),
  createFakerEp("faker-future", "Random Future Date", "/api/faker/date-future"),
  createFakerEp("faker-uuid", "Random UUID", "/api/faker/uuid"),
];
