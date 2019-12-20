function getFunctionMaskNames(ast) {
  const funcMaskNames = [];
  const body = ast.program.body;

  const isFunctionDeclaration = (node) => node.type == "FunctionDeclaration";
  const isFunctionMask = (node) => node.body.type == "BlockStatement" && !node.body.body.length;

  body.forEach((node) => {
    if (isFunctionDeclaration(node) && isFunctionMask(node)) {
      const id = node.id.name;
      funcMaskNames.push(id);
    }
  });

  return funcMaskNames;
}

function getAllMaskValues(ast, funcMaskNames) {
  const maskValues = {};
  const body = ast.program.body;

  const isAssignmentExpression = (node) =>
    node.type == "ExpressionStatement" && node.expression.type == "AssignmentExpression";
  const isMemberExpression = (node) => node.expression.left.type == "MemberExpression";
  const isObjectFuncMask = (node) => funcMaskNames.includes(node.expression.left.object.name);
  body.forEach((node) => {
    if (isAssignmentExpression(node) && isMemberExpression(node) && isObjectFuncMask(node)) {
      const name = node.expression.left.property.name;
      const value = node.expression.right.value;
      maskValues[name] = value;
    }
  });
  return maskValues;
}

function createDecodeFunction(xor, uriData) {
  var n18 = "",
    E18 = decodeURI(uriData);
  var K18 = 0,
    f18 = 0;
  while (K18 < E18.length) {
    if (f18 === xor.length) {
      f18 = 0;
    }

    n18 += String.fromCharCode(E18.charCodeAt(K18) ^ xor.charCodeAt(f18));
    K18++, f18++;
  }
  n18 = n18.split("+)");
  var x18 = 0;
  var q18 = function(p18) {
    if (x18 === 0 && p18 === 2113) {
      n18.unshift(n18.splice(-8, 8).splice(0, 6));
      return x18++, n18[p18];
    }
    if (x18 === 1 && p18 === 2644) {
      n18.unshift(n18.splice(-2, 2).splice(0, 1));
      return x18++, n18[p18];
    }
    if (x18 === 2 && p18 === 7307) {
      n18.unshift(n18.splice(-6, 6).splice(0, 5));
      return x18++, n18[p18];
    }
    if (x18 === 3 && p18 === 6748) {
      n18.unshift(n18.splice(-9, 9).splice(0, 7));
      return x18++, n18[p18];
    }
    if (x18 === 4 && p18 === 5687) {
      n18.unshift(n18.splice(-5, 5).splice(0, 4));
      return x18++, n18[p18];
    }
    if (x18 === 5 && p18 === 4377) {
      n18.unshift(n18.splice(-3, 3).splice(0, 1));
      return x18++, n18[p18];
    }
    if (x18 === 6 && p18 === 1766) {
      n18.unshift(n18.splice(-7, 7).splice(0, 6));
      return x18++, n18[p18];
    }
    if (x18 === 7 && p18 === 7963) {
      n18.unshift(n18.splice(-7, 7).splice(0, 5));
    } else {
      q18 = G18;
    }
    return x18++, n18[p18];
  };
  var G18 = function(l18) {
    return n18[l18];
  };
  return q18;
}

function isDecodeFunction(node) {
  return (
    node.type == "ExpressionStatement" &&
    node.expression.type == "AssignmentExpression" &&
    node.expression.right.type == "CallExpression" &&
    node.expression.right.callee.type == "FunctionExpression" &&
    node.expression.right.callee.body.type == "BlockStatement" &&
    node.expression.right.callee.body.body.length == 1 &&
    node.expression.right.callee.body.body[0].type == "ReturnStatement" &&
    node.expression.right.callee.body.body[0].argument.type == "ObjectExpression" &&
    node.expression.right.callee.body.body[0].argument.properties.length == 1 &&
    node.expression.right.callee.body.body[0].argument.properties[0].type == "ObjectProperty" &&
    node.expression.right.callee.body.body[0].argument.properties[0].value.type == "CallExpression" &&
    node.expression.right.callee.body.body[0].argument.properties[0].value.arguments.length == 1 &&
    node.expression.right.callee.body.body[0].argument.properties[0].value.arguments[0].type == "StringLiteral"
  );
}

function isUriDataFunction(node) {
  return (
    node.type == "FunctionDeclaration" &&
    node.body.type == "BlockStatement" &&
    node.body.body.length == 1 &&
    node.body.body[0].type == "ReturnStatement" &&
    node.body.body[0].argument.type == "StringLiteral"
  );
}

function getXorForDecodeFunction(ast) {
  const body = ast.program.body;
  for (let i = 0; i < body.length; i++) {
    const node = body[i];

    if (isDecodeFunction(node)) {
      const xorNode = node.expression.right.callee.body.body[0].argument.properties[0].value.arguments[0].value;
      return xorNode;
    }
  }
}

function getUriDataForDecodeFunction(ast) {
  const body = ast.program.body;
  for (let i = 0; i < body.length; i++) {
    const node = body[i];

    if (isUriDataFunction(node)) {
      const uriNode = node.body.body[0].argument.value;
      return uriNode;
    }
  }
}

module.exports = {
  getFunctionMaskNames,
  getAllMaskValues,
  createDecodeFunction,
  getXorForDecodeFunction,
  getUriDataForDecodeFunction,
};
