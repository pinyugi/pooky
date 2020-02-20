const t = require("@babel/types");
const recast = require("recast");

const BREAK_FLOW_NODES = ["ContinueStatement", "BreakStatement", "ReturnStatement"];
const isNull = (n) => n === null;
const hasEmptyBlockStatement = (n) => !isNull(n) && n.type == "BlockStatement" && (n.body !== null && !n.body.length);
const hasNullBlockStatement = (n) => !isNull(n) && n.type == "BlockStatement" && n.body === null;
const hasExpressionStatement = (n) => !isNull(n) && n.type == "ExpressionStatement";
const hasEmptyStatement = (n) => !isNull(n) && n.type == "EmptyStatement";
const hasANode = (n) => !hasEmptyBlockStatement(n);
const hasBreakFlowNode = (n) => !isNull(n) && hasANode(n) && n.body !== null && BREAK_FLOW_NODES.includes(n.body.slice(-1)[0].type);
const hasIIFE = (n) => !isNull(n) && n.type== "ExpressionStatement" && n.expression.type == "CallExpression" && n.expression.callee.type == "FunctionExpression";
const hasWhileControlFlow = (n,m) => n.type == "VariableDeclaration" && m.type == "WhileStatement" && m.test.left.name == n.declarations[0].id.name;
const getLength = (n) => !isNull(n) && hasANode(n) && (n.body === null ? 0 : n.body.length);
const getBigger = (x, y) => getLength(x) == getLength(y) ? 0 : getLength(x) > getLength(y) ? -1 : 1;

const same = (original, optimized) => recast.print(t.blockStatement(original)).code == recast.print(t.blockStatement(optimized)).code;


function purifyBlock(block){
  if(hasEmptyStatement(block) || hasNullBlockStatement(block)){
    block = t.blockStatement([]);
  }

  if(hasExpressionStatement(block)){
    block = t.blockStatement([block]);
  }

  return block;

}

function optimizeNodeWithBody(node) {
  try{

    node.body = purifyBlock(node.body);
  }catch(e){
    console.log("purify:", node);
    node.body = purifyBlock(node.body);

  };
  
  

  node.body.body = reOptimize(node.body.body);
  console.log("reoptimized:", recast.print(t.blockStatement(node.body.body)).code);
  return [node];
}

function optimizeIfThenElse(node){

  const nodes = [];
  const { alternate, consequent } = node;

  //If we have a null value on the alternate then it is already transformed
  //or simply ignore them.

  /*
    If we have any branches with a single ExpressionStatement, then converted to a BlockStatement
    with the ExpressionStatement inside. Or if it's an EmptyStatement then set it to an empty BlockStatement.
  */
  [consequent, alternate].forEach((n) => purifyBlock(n));

 /*
  If we have a null value on the alternate then it is already transformed
  or simply ignore them.
 */
 
  if(hasEmptyBlockStatement(alternate)){
    node.alternate == null;
    nodes.push(node);
    console.log("first reoptimize");
    return nodes;
  };


  const consequentHasBreakFlow = hasBreakFlowNode(consequent);
  const alternateHasBreakFlow = hasBreakFlowNode(alternate);

  /*
    Having an empty if statement means we dont process this node
    So just add it to nodes unchanged.
  */

  if(!hasANode(consequent) && !hasANode(alternate)){

    nodes.push(node);
    console.log("second reoptimize");
    return nodes;
  }

  /*
    Weird situation where the if statement is empty but the else part isnt.
    
  */
  if(!hasANode(consequent) && hasANode(alternate)){

    console.log("third optimize:", recast.print(node).code);
    nodes.push(
      t.ifStatement(
        t.unaryExpression("!", node.test),
        alternate.body,
        null
      )
    );

    console.log("third reoptimize");
    return nodes;
  }
  /*
    If any of them end with a break flow node, and the other one doesn't
    have a break flow node then split the non break flow node into separate 
    individual nodes and push them to the nodes array.
  */
  if((!alternateHasBreakFlow && consequentHasBreakFlow) || 
    (alternateHasBreakFlow && !consequentHasBreakFlow)){

    const bodyBlock = !consequentHasBreakFlow ? consequent.body : alternate.body;
    const nonBodyBlock = bodyBlock == consequent.body ? alternate.body : consequent.body;
    const testExp = !consequentHasBreakFlow ? node.test : t.unaryExpression("!", node.test); 
    
    nodes.push(t.ifStatement(testExp, t.blockStatement(bodyBlock)));
    nodes.push(...nonBodyBlock);

    console.log("fourth reoptimize");

    return nodes;
  } 

  const bigger = getBigger(node.consequent, node.alternate)
  /*
    If they are equal and none of them is bigger than the other one, then set it to the consequent.
  */
  const biggestLength = !bigger || bigger == -1 ? consequent : alternate;
  const smallestLength = biggestLength == alternate ? consequent : alternate;

  let i = 0;
  console.log("smallest length:", smallestLength);
  if(smallestLength === null){
    console.log("smallest is null:", recast.print(node).code);
  }
  while( smallestLength !== null && i < smallestLength.body.length){
    console.log("smallest body length:", smallestLength.body.length);

    lastSmallest = smallestLength.body.slice(-1 * (i+1))[0];
    lastBiggest = biggestLength.body.slice(-1 * (i+1))[0];

    const sameNode = recast.print(lastSmallest).code == recast.print(lastBiggest).code;
    console.log("inside if then else:",i);
    if(!sameNode){
      break;
    }
    nodes.push(smallestLength.body.pop());
    biggestLength.body.pop();
    i++;

  }
  /*
  if( smallestLength === null || !smallestLength.body.length){
    if(consequent === null || !consequent.body.length){
      node.test = t.unaryExpression("!", node.test);
      node.consequent = node.alternate;
    }

    if(alternate === null || !alternate.body.length){
      node.alternate = null;
    }
  }
  */
  nodes.unshift(node);

  return nodes;

}

function reOptimize(nodes){
  //Re optimize the new nodes
  let reoptimized = optimizeNodes(nodes);
  let i = 0;
  while(true){
    console.log("i is:",i);

    let isSame = same(nodes, reoptimized);
    if(isSame){
      // If nodes are the same even after re optimizing the new nodes, then we are done and return the nodes.
      return nodes;
    }else{
      console.log("not same", i);
      //Else we need to return the reoptimized nodes until they are the same.
      nodes = reoptimized;
      reoptimized = optimizeNodes(nodes);

    }
    i++;


  }
}

function optimizeNodes(nodes) {
  const cleanedNodes = [];
  let skipNext = false;
  nodes.forEach((node, nodeIndex) => {
    console.log("node type:", node.type, "node index:", nodeIndex);
    if(node.type == "VariableDeclaration"){
      console.log("var dec:", recast.print(node).code);
      console.log(recast.print(t.blockStatement(cleanedNodes)).code );
    }

    if(skipNext){
      skipNext = false;
      cleanedNodes.push(node);
      return;
    }
    switch (node.type) {
      case "VariableDeclaration":
        if(hasWhileControlFlow(node, nodes[nodeIndex+1])){
          console.log("DO NOT TOUCH;");
          cleanedNodes.push(node);
          skipNext = true;

        }else{
          cleanedNodes.push(node);
        }

        break;
      case "WhileStatement":
      case "DoWhileStatement":

        console.log("LOOP");
        //console.log("while:", recast.print(node).code);
        cleanedNodes.push(...optimizeNodeWithBody(node));
        break;
      case "IfStatement":
        console.log("IFSTATEMENT", recast.print(node).code);
        cleanedNodes.push(...optimizeIfThenElse(node));
        console.log("FTER IFSTATEMENT");
        break;
      /*
      case "ExpressionStatement":
        console.log("has EXPRESSION");
        if(hasIIFE(node)){
          console.log("has EXPRESSION STATEMENT");
          cleanedNodes.push(...optimizeNodeWithBody(node.expression.callee));
        }
        break;

        */
      default:
        cleanedNodes.push(node);
    }
  });
  
  if(same(nodes, cleanedNodes)){
    //console.log("nodes printout:", recast.print(t.blockStatement(nodes)).code);
    //console.log("optimized printout:", recast.print(t.blockStatement(cleanedNodes)).code);
    return cleanedNodes;
  }else{
    //return optimizeNodes(cleanedNodes);
  }
  return cleanedNodes;
}

module.exports = {
  optimizeNodes,
};
