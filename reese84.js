const t = require("@babel/types");
const traverse = require("@babel/traverse").default;
const crypto = require("crypto");
class Reese84 {
  constructor(ast) {
    this.ast = ast;
  }

  getHash() {
    renameXorShift128(this.ast);
    return getXorHash(this.ast);
  }
}

function renameXorShift128(ast) {
  // console.time(`renameXorShift128`);
  const oldName = renameXorFunction(ast);
  const newNameId = t.identifier(`xorShift128`);

  traverse(ast, {
    CallExpression(callPath) {
      const callee = callPath.get(`callee`);

      if (t.isIdentifier(callee.node) && callee.node.name === oldName) {
        callee.replaceWith(newNameId);
      }
    },
  });
  // console.timeEnd(`renameXorShift128`);
}

function renameXorFunction(ast) {
  let oldName;

  traverse(ast, {
    FunctionDeclaration(path) {
      if (oldName) {
        path.stop();
      }

      const name = path.get(`id`);

      if (!name.node) {
        return;
      }

      path.traverse({
        BinaryExpression(binPath) {
          const right = binPath.get(`right`);
          const operator = binPath.node.operator;

          if (
            operator === `>>` &&
            t.isNumericLiteral(right.node) &&
            right.node.value === 17
          ) {
            oldName = name.node.name;
            name.replaceWith(t.identifier(`xorShift128`));
          }
        },
      });
    },
  });

  return oldName;
}

function getXorHash(ast) {
  const xorArray = [];
  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.name === "xorShift128") {
        const args = path.node.arguments;
        if (args.length === 1) {
          xorArray.push(args[0].value);
        }
      }
    },
  });

  const hash = crypto
    .createHash("sha256")
    .update(xorArray.join(""))
    .digest("hex");
  return hash;
}

module.exports = Reese84;
