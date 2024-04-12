function getNodesByNodeName(node: Node, nodeName: string, childrenOnly = false): Array<Node> {
    const nodes: Array<Node> = Object.assign([], node.childNodes);
    let childNodes: Array<Node> = [];
    const foundNodes: Array<Node> = [];
    let nextNode: Node | undefined;
    if (node.nodeName === nodeName) {
        foundNodes.push(node);
    } else {
        do {
            nextNode = nodes.shift();
            if (nextNode) {
                if (nextNode.nodeName === nodeName) {
                    foundNodes.push(nextNode);
                } else if (childrenOnly === false) {
                    childNodes = Object.assign([], nextNode.childNodes);
                    for (const childNode of childNodes) {
                        nodes.unshift(childNode);
                    }
                }
            }
        } while (nodes.length > 0);
    }
    return foundNodes;
}

function getChildNodesByNodeName(parentNode: Node, nodeName: string): Array<Node> {
    return getNodesByNodeName(parentNode, nodeName, true);
}

function queryParentNode(node: Node, nodeNames: Array<string>): Array<Node> {
    const clonedNodeNames = Object.assign([], nodeNames);
    let foundNodes: Array<Node> = [];
    function _queryParentNode(_node: Node, _nodeNames: Array<string>): Array<Node> {
        let _foundNodes: Array<Node> = [];
        if (_nodeNames.length > 0) {
            const childNodes = getChildNodesByNodeName(_node, _nodeNames.shift() as string);
            for (const childNode of childNodes) {
                _foundNodes = _foundNodes.concat(_queryParentNode(childNode, _nodeNames));
            }
        } else {
            _foundNodes.push(_node);
        }
        return _foundNodes;
    }
    foundNodes = foundNodes.concat(_queryParentNode(node, clonedNodeNames));
    return foundNodes;
}

export function querySelectorAll(doc: Document, query: string): Array<Node> {
    const nodeNames: Array<string> = query.split(">");
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const parentNodes: Array<Node> = getNodesByNodeName(doc.documentElement, nodeNames.shift()!);
    let foundNodes: Array<Node> = [];
    if (nodeNames.length > 0) {
        for (const node of parentNodes) {
            foundNodes = foundNodes.concat(queryParentNode(node, nodeNames));
        }
    } else {
        foundNodes = parentNodes;
    }
    return foundNodes;
}

export function querySelector(doc: Document, query: string): Node {
    return querySelectorAll(doc, query)[0];
}
