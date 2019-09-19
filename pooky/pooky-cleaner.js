const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const recast = require("recast");

function checkForUselessMember(path){
  return path.get("left").type == "MemberExpression" && 
    path.get("operator").node == "=" && 
    ["StringLiteral", "NumericLiteral"].includes(path.get("right").type);
};


function shouldRemoveUselessMember(path, state){

  return path.get("left").type == "MemberExpression" && 
    path.get("operator").node == "=" &&
    path.get("left.property.name").node in state["uselessMembers"];

}

function shouldRemoveUselessVar(path, state){
  return path.get("declarations.0.id").node.name in state["uselessMembers"];
}


function cleanValue(value){
  if(typeof value == "string"){
    return value.startsWith("0x") ? +value : /^\d+$/.test(value) ? +value : value; 
  }else{
    return value;
  }
}

function literalNode(value){
  return typeof value === "string" ? t.stringLiteral(value) : t.numericLiteral(value);
}

function isFunctionMasker(path){
   
  if(path.get("body.body").length){

    return path.get("body.body.0").type == "VariableDeclaration" &&
      path.get("body.body.0.declarations.0.init").type == "ArrayExpression" &&
      path.get("body.body.0.declarations.0.init.elements.0.name").node;
  }

  return false;

}

function isFunctionMaybeUseless(path, state){
  const funcName = path.get("id.name").node;
  const mainFunc = state["mainFunc"];
  return !(path.get("body.body").length) && funcName.length ==4 && funcName != mainFunc;
}

function isAssignmentFromUselessFunc(path, state){

};

USELESS_LITERAL_VISITOR = {

  AssignmentExpression(path, state){
    if(!("uselessMembers" in state))state["uselessMembers"] = Object.create(null);
    if(checkForUselessMember(path)){
      const rightValue = path.get("right").node.value;
      const cleanedValue = cleanValue(rightValue);
      const objectName = path.get("left.object.name").node;
      const propertyName = path.get("left.property.name").node;
      const memberFullName = objectName + "."+ propertyName;
      if(propertyName !== undefined){
        state["uselessMembers"][propertyName] = {"object" : objectName, "fullName" : memberFullName, "value" : cleanedValue}
      }

    }
  }
};

REPLACE_USELESS_LITERAL_VISITOR = {

  MemberExpression(path, state){
    if(!("uselessMembers" in state))state["uselessMembers"] = Object.create(null);
    const objectName = path.get("object.name").node;
    const propertyName = path.get("property.name").node;
    const fullName = objectName + "." + propertyName;
    const parentPath = path.parentPath;

    if(propertyName in state["uselessMembers"] && path.parentPath.type != "AssignmentExpression"){

      const newNode = literalNode(state["uselessMembers"][propertyName]["value"]);

      if(parentPath.type == "UnaryExpression" && parentPath.get("operator").node == "+"){
        parentPath.replaceWith(newNode);
      }else{
        path.replaceWith(newNode);
      }
    }
  }

};

USELESS_FUNCS_VISITOR = {
  
  FunctionDeclaration(path, state){
    const funcName = path.get("id.name").node;

    if(isFunctionMaybeUseless(path, state)){
      if(!("maybeUselessFuncs" in state))state["maybeUselessFuncs"] = new Set();
      state["maybeUselessFuncs"].add(funcName);
    }

  }, 

  AssignmentExpression(path, state){

  }
}


CLEANUP_USELESS_LITERAL_VISITOR = {

  AssignmentExpression(path, state){
    if(shouldRemoveUselessMember(path, state)){
      path.parentPath.remove();
    }

  }

};

FIND_FUNCTION_MASKERS_VISITOR = {

  FunctionDeclaration(path, state){
    if(isFunctionMasker(path)){
      if(!("funcs" in state))state["funcs"] = [];
      const funcName = path.get("id.name").node;
      state["funcs"].push(funcName);

    }
  }

};

MASKING_STRINGS_VISITOR = {
  CallExpression(path, state){
    const funcName = path.get("callee.name").node;
    if(state["funcs"].includes(funcName)){
      if(!("masks" in state))state["masks"] = {};

      const originalMask = path.get("arguments.2.value").node;
      const clonedMask = path.get("arguments.3.value").node;

      state["masks"][clonedMask] = originalMask;

    }
  }
};

REPLACE_MASKING_VISITORS = {

  Identifier(path, state){
    if(!("masks" in state))state["masks"] = {};
    const name = path.get("name").node;
    if(name in state["masks"])path.node.name = state["masks"][name];

  }

};
const findAllUselessLiterals = (ast, state) => {
  traverse(ast, USELESS_LITERAL_VISITOR, {}, state = state);

};
const replaceUselessLiterals = (ast, state) => {
  traverse(ast, REPLACE_USELESS_LITERAL_VISITOR, {}, state = state);
  
};

const findAllUselessFuncs = (ast, state) => {
  state["mainFunc"] = ast.program.body[0].expression.left.object.name;
  traverse(ast, USELESS_FUNCS_VISITOR, {}, state = state);
  state["maybeUselessFuncs"] = Array.from(state["maybeUselessFuncs"])
}

const cleanUpNodes = (ast, state) => {
  traverse(ast, CLEANUP_USELESS_LITERAL_VISITOR, {}, state = state);
};

const findFunctionMaskers = (ast, state) => {
  traverse(ast, FIND_FUNCTION_MASKERS_VISITOR, {}, state = state);
};

const findMaskingStrings = (ast, state) => {
  traverse(ast, MASKING_STRINGS_VISITOR, {}, state = state);
};

const replaceMaskingStrings = (ast, state) => {
  traverse(ast, REPLACE_MASKING_VISITORS, {}, state = state);
};

const removeMaskingFunctions = (ast, state) => {
  ast.program.body.splice(1, 3);
  
};

module.exports = {
  findAllUselessLiterals: findAllUselessLiterals,
  replaceUselessLiterals : replaceUselessLiterals,
  findAllUselessFuncs : findAllUselessFuncs,
  cleanUpNodes : cleanUpNodes,
  findFunctionMaskers : findFunctionMaskers,
  findMaskingStrings : findMaskingStrings,
  replaceMaskingStrings : replaceMaskingStrings,
  removeMaskingFunctions : removeMaskingFunctions
};