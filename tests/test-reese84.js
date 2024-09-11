const fs = require("node:fs");
const { execSync } = require("node:child_process");

fetch("https://epsf.ticketmaster.sg/eps-d?d=ticketmaster.sg")
  .then((res) => res.text())
  .then((code) => {
    fs.writeFileSync("./tests/source.js", code);
    const res = execSync(`node index.js ./tests/source.js`);
    const str = Buffer.from(res).toString();
    console.log(str);

    fs.writeFileSync("./tests/output.js", str);
  });
