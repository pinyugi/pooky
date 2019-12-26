import * as recast from "recast";


export  function getStateHolderType(path) {
  const prev = path.getPrevSibling();
  const isVarDec = prev.type == "VariableDeclaration" && prev.get("declarations").length == 1;
  const isAssignment = prev.get("expression").type == "AssignmentExpression";

  return isVarDec ? "vardec" : isAssignment ? "assignment" : false;
}

export function getStateHolderName(path) {
  const prev = path.getPrevSibling();
  const _type = utils.getStateHolderType(path);

  return _type == "vardec"
    ? recast.print(prev.get("declarations.0.id").node).code
    : _type == "assignment"
    ? recast.print(prev.get("expression.left").node).code
    : false;
}

export function getInitialState(path) {
  const prev = path.getPrevSibling();
  const _type = utils.getStateHolderType(path);

  return _type == "vardec"
    ? prev.get("declarations.0.init.value").node
    : _type == "assignment"
    ? prev.get("expression.right.value").node
    : false;
}

export function hasGoToSibling(path) {
  return (
    utils.getStateHolderName(path) == recast.print(path.get("test.left").node).code
  );
}

export function isForAControlFlow(path) {
  return (
    path.type == "ForStatement" &&
    path.get("init").node === null &&
    path.get("update").node == null &&
    path.get("test").type == "BinaryExpression" &&
    path.get("test.operator").node == "!==" &&
    utils.hasGoToSibling(path)
  );
}

export function isWhileAControlFlow(path) {
  return (
    path.type == "WhileStatement" &&
    path.get("test").type == "BinaryExpression" &&
    path.get("test.operator").node == "!==" &&
    utils.hasGoToSibling(path)
  );
}


