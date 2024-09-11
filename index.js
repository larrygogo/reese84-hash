const { parse } = require("@babel/parser");
const fs = require("node:fs");
const Reese84 = require("./reese84");

const args = process.argv.slice(2);

const file = fs.readFileSync(args[0], "utf-8");
const ast = parse(file);

const reese84 = new Reese84(ast);

const hash = reese84.getHash();

process.stdout.write(hash);
