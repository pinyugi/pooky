const t = require("@babel/types");
const recast = require("recast");

function optimizeWhileLoop(whileNode) {
  if (whileNode.test.operator == "!==") {
  } else {
    const whileBody = [...optimizeNodes(whileNode.body.body)];
    whileNode.body.body = whileBody;

    if (whileNode.body.body.slice(-1)[0].type == "ContinueStatement") {
      whileNode.body.body.pop();
    }
  }

  return [whileNode];
}

function optimizeIfThenElse(ifThenElseNode) {
  const { alternate, consequent } = ifThenElseNode;
  const testExpression = ifThenElseNode.test;
  const nodes = [];
  const outsideNodes = [];

  let allSame = true;
  let notSameAt = null;

  const { smallestLength, other } = getSmallestLength(ifThenElseNode);

  if (!smallestLength) {
  } else {
    for (let i = 0, index = -1; i < smallestLength; i++, index--) {
      const alternateNode = recast.print(alternate.body.slice(index)[0]).code;
      const consequentNode = recast.print(consequent.body.slice(index)[0]).code;
      allSame = alternateNode == consequentNode;

      if (!allSame) {
        notSameAt = i;
        break;
      }
    }

    if (allSame) {
      const body = other.body;
      const ifConsequentNodes = [...body.slice(0, body.length - smallestLength)];
      outsideNodes.push(...body.slice(smallestLength * -1));
      const testNode = other == consequent ? testExpression : t.unaryExpression("!", testExpression);

      ifThenElseNode = t.ifStatement(testNode, t.blockStatement(ifConsequentNodes));
    } else {
      if (!notSameAt) {
        const maybeLastReturnAlternate = alternate.body.slice(-1)[0].type == "ReturnStatement";
        const maybeLastReturnConsequent = consequent.body.slice(-1)[0].type == "ReturnStatement";

        if (maybeLastReturnConsequent && !maybeLastReturnAlternate) {
          outsideNodes.push(...alternate.body);
          ifThenElseNode.alternate = null;
        } else {
          ifThenElseNode.consequent.body = optimizeNodes(ifThenElseNode.consequent.body);
          ifThenElseNode.alternate.body = optimizeNodes(ifThenElseNode.alternate.body);
        }
      } else {
        for (let i = 0; i < notSameAt; i++) {
          outsideNodes.unshift(consequent.body.pop());
          alternate.body.pop();
        }
      }
    }
  }

  removeDeadBranches(ifThenElseNode, outsideNodes, nodes);

  return [...nodes];
}

function getSmallestLength(ifThenElseNode) {
  const { alternate, consequent } = ifThenElseNode;
  if (alternate === null) {
    return { smallestLength: 0, other: consequent };
  } else {
    const smallest = consequent.body.length > alternate.body.length ? alternate.body.length : consequent.body.length;
    return {
      smallestLength: smallest,
      other: smallest == consequent.body.length ? alternate : consequent,
    };
  }
}

function removeDeadBranches(ifThenElseNode, outsideNodes, nodes) {
  if (ifThenElseNode !== null && ifThenElseNode.test.type == "NumericLiteral") {
    if (ifThenElseNode.test.value == 1) {
      nodes.push(...ifThenElseNode.consequent.body);
      nodes.push(...optimizeNodes(outsideNodes));
    } else if (ifThenElseNode.test.value == 0) {
      nodes.push(...optimizeNodes(outsideNodes));
    }
  } else {
    if (ifThenElseNode !== null) {
      nodes.push(ifThenElseNode);
    } else {
    }
    nodes.push(...optimizeNodes(outsideNodes));
  }
}

function optimizeNodes(nodes) {
  const cleanedNodes = [];
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
