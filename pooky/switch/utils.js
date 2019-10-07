const recast = require("recast");

module.exports = {
	
  getStateHolderType(path){
    const prev = path.getPrevSibling();
    const isVarDec = prev.type == "VariableDeclaration" && prev.get("declarations").length == 1;
    const isAssignment = prev.get("expression").type == "AssignmentExpression";
    
    return isVarDec ? "vardec" :
      isAssignment ? "assignment" : false;
  
  },
  
  getStateHolderName(path) {

    const prev = path.getPrevSibling();
    const _type = this.getStateHolderType(path);

    return _type == "vardec" ? recast.print(prev.get("declarations.0.id").node).code : 
      type == "assignment" ? recast.print(prev.get("expression.left").node).code : false;

  
  },
  
  getInitialState(path) {
  
    const prev = path.getPrevSibling();
    const _type = this.getStateHolderType(path);

    return _type == "vardec" ? prev.get("declarations.0.init.value").node : 
      type == "assignment" ? prev.get("expression.right.value").node : false;
  },
  
  hasStateHolder(path){
    return this.getStateHolderName(path) && this.getInitialState(path);
  
  },

  hasGoToSibling(path){
    return (this.hasStateHolder(path) &&
      this.getStateHolderName(path) == recast.print(path.get("test.left").node).code);
  },
  
  isWhileAGoToSwitch(path){
    return (path.type == "WhileStatement" &&
      path.get("test").type == "BinaryExpression" &&
      path.get("test.operator").node == "!==" &&
      this.hasGoToSibling(path));
  
  },
  
  isForAGoToSwitch(path) {
   
    return path.type == "ForStatement" &&
      path.get("init").node === null &&
      path.get("test").type == "BinaryExpression" &&
      path.get("test.operator").node == "!==" &&
      this.hasGoToSibling(path);
  }
};