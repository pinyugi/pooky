const t = require("@babel/types");
const recast = require("recast");

function optimizeWhileLoop(whileNode) {
  const whileBody = [...optimizeNodes(whileNode.body.body)];
  whileNode.body.body = whileBody;

  if(whileNode.body.body.slice(-1)[0].type == "ContinueStatement"){
    whileNode.body.body.pop();
  }

  return [whileNode];
}

function optimizeIfThenElse(ifThenElseNode) {

  const { alternate, consequent } = ifThenElseNode;
  const testExpression = ifThenElseNode.test;
  const nodes = [];

  let allSame = true;
  let notSameAt = null;
  const smallestLength = consequent.body.length > alternate.body.length ? alternate.body.length : consequent.body.length;
  const other = smallestLength == consequent.body.length ? alternate : consequent;

  if(!smallestLength){
    const testNode = smallestLength == consequent.body.length ? t.unaryExpression("!", testExpression) : testExpression;
    nodes.push(t.ifStatement(testNode, t.blockStatement(other.body)));

    return nodes;

  }

  for(let i=0, index=-1; i < smallestLength; i++, index--){
    
    const alternateNode = recast.print(alternate.body.slice(index)[0]).code;
    const consequentNode = recast.print(consequent.body.slice(index)[0]).code;
    allSame = alternateNode == consequentNode;

    if(!allSame){
      notSameAt = i+1;
      break;
    }

  }

  if(allSame){
    const body = other.body;
    const ifConsequentNodes = [...body.slice(0, body.length - smallestLength)];
    const outsideNodes = [...body.slice(smallestLength*-1)];
    const testNode = other == consequent ? testExpression : t.unaryExpression("!", testExpression);

    
    nodes.push(t.ifStatement(testNode, t.blockStatement(ifConsequentNodes)));
    nodes.push(...optimizeNodes(outsideNodes));


  }else{

    const alternateLastIf = alternate.body.slice(-1)[0].type == "IfStatement";
    const consequentLastIf = consequent.body.slice(-1)[0].type == "IfStatement";

    if(!alternateLastIf && consequentLastIf){

      nodes.push(t.ifStatement(t.unaryExpression("!", testExpression), t.blockStatement(alternate.body)));
      nodes.push(...optimizeNodes(consequent.body));

    }else if(alternateLastIf && !consequentLastIf){

      nodes.push(t.ifStatement(testExpression, t.blockStatement(consequent.body)));
      nodes.push(...optimizeNodes(alternate.body));


    }else{

      const outsideNodes = []; 
      for(let i=0; i < notSameAt;i++){
        outsideNodes.unshift(consequent.body.pop());
        alternate.body.pop();
  
      }
  
      nodes.push(ifThenElseNode);
      nodes.push(...optimizeNodes(outsideNodes));

    }


  }

  return [...nodes];
}


function optimizeNodes(nodes) {

  const cleanedNodes = [];
  //console.log("nodes optimizeNodes:", nodes);
  nodes.forEach((node) => {
    switch (node.type) {
      case "WhileStatement":
        cleanedNodes.push(...optimizeWhileLoop(node));
        break;

      case "IfStatement":
        cleanedNodes.push(...optimizeIfThenElse(node));
        break;
     

      default:
        cleanedNodes.push(node);
    }
  });

  return cleanedNodes;
}

module.exports = {
  optimizeNodes,
};
