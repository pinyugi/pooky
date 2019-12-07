const t = require("@babel/types");

function optimizeWhileLoop() {}
class Optimizer {
  constructor(opts = {}) {
    this.whileLoops = opts.whileLoop || true;
    this.ifThenElses = opts.ifThenElses || true;
  }

  cleanNodes(nodes) {
    const cleanedNodes = [];
    let optimizedNodes = [];

    nodes.forEach((node) => {
      switch (node.type) {
        case "WhileStatement":
          optimizedNodes = this.optimizeWhileLoop(node);
          cleanedNodes.push(...optimizedNodes);

          break;

        case "IfStatement":
          optimizedNodes = this.optimizeIfThenElse(node);
          cleanedNodes.push(...optimizedNodes);
          break;

        default:
          cleanedNodes.push(node);
      }
    });
    return cleanedNodes;
  }

  optimizeWhileLoop(whileNode) {
    return [whileNode];
  }

  optimizeIfThenElse(ifThenElseNode) {
    return [ifThenElseNode];
  }
}

module.exports = {
  Optimizer,
};
