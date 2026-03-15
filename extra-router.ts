import { Router } from "express";
import { faker } from "@faker-js/faker";
import crypto from "crypto";

export const extraRouter = Router();

const route = (path: string, handler: (req: any) => any) => {
  extraRouter.get(path, (req, res) => {
    try {
      const data = handler(req);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  });
};

// 1. String APIs (10)
route("/str/upper", req => String(req.query.text || "").toUpperCase());
route("/str/lower", req => String(req.query.text || "").toLowerCase());
route("/str/length", req => String(req.query.text || "").length);
route("/str/reverse", req => String(req.query.text || "").split("").reverse().join(""));
route("/str/trim", req => String(req.query.text || "").trim());
route("/str/urlencode", req => encodeURIComponent(String(req.query.text || "")));
route("/str/urldecode", req => decodeURIComponent(String(req.query.text || "")));
route("/str/wordcount", req => String(req.query.text || "").trim().split(/\s+/).filter(Boolean).length);
route("/str/charcount", req => String(req.query.text || "").replace(/\s/g, "").length);
route("/str/capitalize", req => {
    const s = String(req.query.text || "");
    return s.charAt(0).toUpperCase() + s.slice(1);
});

// 2. Math APIs (10)
route("/math/add", req => Number(req.query.a || 0) + Number(req.query.b || 0));
route("/math/sub", req => Number(req.query.a || 0) - Number(req.query.b || 0));
route("/math/mul", req => Number(req.query.a || 0) * Number(req.query.b || 0));
route("/math/div", req => Number(req.query.a || 0) / (Number(req.query.b) || 1));
route("/math/pow", req => Math.pow(Number(req.query.a || 0), Number(req.query.b || 1)));
route("/math/sqrt", req => Math.sqrt(Number(req.query.a || 0)));
route("/math/round", req => Math.round(Number(req.query.a || 0)));
route("/math/floor", req => Math.floor(Number(req.query.a || 0)));
route("/math/ceil", req => Math.ceil(Number(req.query.a || 0)));
route("/math/abs", req => Math.abs(Number(req.query.a || 0)));

// 3. Crypto & Encoding APIs (10)
route("/crypto/md5", req => crypto.createHash("md5").update(String(req.query.text || "")).digest("hex"));
route("/crypto/sha1", req => crypto.createHash("sha1").update(String(req.query.text || "")).digest("hex"));
route("/crypto/sha256", req => crypto.createHash("sha256").update(String(req.query.text || "")).digest("hex"));
route("/crypto/sha512", req => crypto.createHash("sha512").update(String(req.query.text || "")).digest("hex"));
route("/crypto/random-hex", req => crypto.randomBytes(Number(req.query.size || 16)).toString("hex"));
route("/crypto/random-base64", req => crypto.randomBytes(Number(req.query.size || 16)).toString("base64"));
route("/crypto/uuid-v4", () => crypto.randomUUID());
route("/crypto/rot13", req => String(req.query.text || "").replace(/[a-zA-Z]/g, c => {
    let charCode = c.charCodeAt(0) + 13;
    const limit = c <= "Z" ? 90 : 122;
    return String.fromCharCode(limit >= charCode ? charCode : charCode - 26);
}));
route("/crypto/btoa", req => Buffer.from(String(req.query.text || "")).toString("base64"));
route("/crypto/atob", req => Buffer.from(String(req.query.text || ""), "base64").toString("utf8"));

// 4. Faker APIs (20)
route("/faker/name", () => faker.person.fullName());
route("/faker/email", () => faker.internet.email());
route("/faker/username", () => faker.internet.username());
route("/faker/password", () => faker.internet.password());
route("/faker/phone", () => faker.phone.number());
route("/faker/address", () => faker.location.streetAddress());
route("/faker/city", () => faker.location.city());
route("/faker/country", () => faker.location.country());
route("/faker/company", () => faker.company.name());
route("/faker/job-title", () => faker.person.jobTitle());
route("/faker/avatar", () => faker.image.avatar());
route("/faker/color-hex", () => faker.color.rgb());
route("/faker/color-name", () => faker.color.human());
route("/faker/emoji", () => faker.internet.emoji());
route("/faker/word", () => faker.lorem.word());
route("/faker/sentence", () => faker.lorem.sentence());
route("/faker/paragraph", () => faker.lorem.paragraph());
route("/faker/date-past", () => faker.date.past().toISOString());
route("/faker/date-future", () => faker.date.future().toISOString());
route("/faker/uuid", () => faker.string.uuid());
