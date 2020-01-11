const t = require("@babel/types");
const traverse = require("@babel/traverse").default;
const fromFile = require("../pooky/ast.js").fromFile;
const fs = require("fs");
const generate = require("@babel/generator").default;

function getEvalFuncName(ast) {
  const body = ast.program.body;
  const node = body.slice(-1)[0].type == "FunctionDeclaration" ? body.slice(-2)[0] : body.slice(-1)[0];
  return node.expression.callee.callee.id.name;
}

function getEvalFuncArguments(ast) {
  const body = ast.program.body;
  const node = body.slice(-1)[0].type == "FunctionDeclaration" ? body.slice(-2)[0] : body.slice(-1)[0];

  const rawArguments = [node.expression.callee.arguments[0].value];

  const elements = node.expression.arguments[0].elements;
  for (let i = 0; i < elements.length; i++) {
    rawArguments.push(elements[i].arguments[0].value);
  }
  return rawArguments;
}

function cutEvalFunctionSourceCode(data, funcName) {
  const sources = data.split(`function ${funcName}(`);
  sources.shift();

  for (let i = 0; i < sources.length; i++) {
    sources[i] = sources[i].split('}("%')[0];
    sources[i] = `function ${funcName}(${sources[i]}\}`;
  }
  return sources;
}

function isTamperingCheck(path, funcName) {
  return (
    path.get("left").type == "UnaryExpression" &&
    path.get("left.argument.name").node == funcName &&
    (path.get("right").type = "MemberExpression" || path.get("right.value").node == "function")
  );
}

function toTemplateLiteral(string) {
  return t.templateLiteral([t.templateElement({ cooked: string, raw: string })], []);
}
function isEvalSourceCode(path, funcName) {
  return (
    path.get("callee").type == "MemberExpression" &&
    path.get("callee.computed").node == true &&
    path.get("callee.object.name").node == funcName &&
    (path.get("callee.property").type == "MemberExpression" ||
      (path.get("callee.property").type == "Literal" && path.get("callee.property.value").node == "toString"))
  );
}

function removeTamperingChecks(ast, fileName, addLocalStorage = false) {
  const data = fs.readFileSync(fileName, "utf8");
  const funcName = getEvalFuncName(ast);
  const sourceCodes = cutEvalFunctionSourceCode(data, funcName);
  traverse(ast, {
    BinaryExpression(path) {
      if (isTamperingCheck(path, funcName)) {
        const parent = path.getStatementParent();
        const id = parent.get("declarations.0.id").node;
        parent.replaceWith(t.variableDeclaration("var", [t.variableDeclarator(id, t.booleanLiteral(true))]));
      }
    },
  });
  let sourceIndex = 0;
  traverse(ast, {
    CallExpression(path) {
      if (isEvalSourceCode(path, funcName)) {
        const parent = path.getStatementParent();
        const init = toTemplateLiteral(sourceCodes[sourceIndex]);
        parent.insertBefore(
          t.variableDeclaration("var", [t.variableDeclarator(t.identifier("FUNCTION_SOURCE_STRING"), init)])
        );

        path.replaceWith(t.identifier("FUNCTION_SOURCE_STRING"));
        sourceIndex++;

        if (addLocalStorage) {
          const evaluatedId = parent.get("declarations.0.id.name").node;

          parent.insertAfter(
            t.expressionStatement(
              t.callExpression(t.memberExpression(t.identifier("localStorage"), t.identifier("setItem")), [
                t.stringLiteral(evaluatedId),
                t.identifier(evaluatedId),
              ])
            )
          );
        }
      }
    },
  });

  const { code } = generate(ast, { compact: true, retainLines: true });
  return code;
}

module.exports = {
  getEvalFuncName,
  getEvalFuncArguments,
  cutEvalFunctionSourceCode,
  removeTamperingChecks,
};
