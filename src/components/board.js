export default function boardGenerator (numOfCols, numOfRows) {
  const boardSize = numOfCols * numOfRows
  let board = []
  let nodeList = []
  // number of nodes the board can contain
  const numBoardNodes = boardSize / 2
  // min arity / options for connections
  const minArity = 1
  // max arity / options for connections
  const maxArity = 8

  function rand (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  };
  // get the position of a node on the grid
  function getGridPos (nodeLoc) {
    const gridPos = { row: 0, col: 0 }
    gridPos.row = (Math.floor(nodeLoc / numOfCols))
    gridPos.col = nodeLoc % numOfCols

    return gridPos
  }
  // Create an array  with amount of elements set to 0 based on boardSize
  function setBoard () {
    board = (new Array(boardSize)).fill(0)
  }
  // Set first node
  // List of nodes with [{position: x=<boardSize, arity: y= 1 <= maxArity, connections: z= 1 <= maxArity}]
  function setFirstNode () {
    const firstRandomNodePos = rand(0, boardSize)
    const firstRandomNodeArity = rand(minArity, maxArity)
    nodeList.push({ position: firstRandomNodePos, arity: firstRandomNodeArity, connections: 0, freeNode: true, nodeToNode: [] })
    board[firstRandomNodePos] = 1
  }
  // Sets surrounding positions to not available / to -1
  /*   function setSurPos (nodeLoc) {
    const gridPos = getGridPos(nodeLoc)
    // node is not first el in a row
    if (gridPos.col !== 0) {
      board[nodeLoc - 1] = -1
    }
    // node is not last el in a row
    if (gridPos.col !== numOfCols - 1) {
      board[nodeLoc + 1] = -1
    }
    // node is not in the top row
    if (gridPos.row !== 0) {
      board[nodeLoc - numOfCols] = -1
    }
    // node is not in the bottom row
    if (gridPos.row !== numOfRows - 1) {
      board[nodeLoc + numOfCols] = -1
    }
  } */
  // set the positions inbetween to nodes to -1
  function setInbetweenPos (node1, node2) {
    const nodes = [node1, node2]
    nodes.sort((a, b) => a - b)
    const node1GridPos = getGridPos(nodes[0])
    const node2GridPos = getGridPos(nodes[1])
    // same row
    if (node1GridPos.row === node2GridPos.row) {
      for (let i = nodes[0] + 1; i < nodes[1]; i++) {
        board[i] = -1
      }
    } else if (node1GridPos.col === node2GridPos.col) {
      for (let i = nodes[0] + numOfCols; i < nodes[1]; i += numOfCols) {
        board[i] = -1
      }
    }
  }
  // return list of free positions for new node
  function findFreePos (nodeLoc) {
    const freePos = []
    const gridPos = getGridPos(nodeLoc)
    // check positions in row left of node
    for (let i = nodeLoc - 2; i >= gridPos.row * numOfCols; i--) {
      if (board[i] === 0 && board[nodeLoc - 1] !== -1 && board[i + numOfCols] !== 1 && board[i - numOfCols] !== 1 && board[i - 1] !== 1) {
        freePos.push(i)
      } else if (board[i] !== 0) {
        break
      }
    }
    // check positions in row right of node
    for (let i = nodeLoc + 2; i < (gridPos.row + 1) * numOfCols; i++) {
      if (board[i] === 0 && board[nodeLoc + 1] !== -1 && board[i + numOfCols] !== 1 && board[i - numOfCols] !== 1 && board[i + 1] !== 1) {
        freePos.push(i)
      } else if (board[i] !== 0) {
        break
      }
    }
    // check positions in column north of node
    for (let i = nodeLoc - (numOfCols * 2); i >= 0; i -= numOfCols) {
      if (board[i] === 0 && board[nodeLoc - numOfCols] !== -1 && board[i + 1] !== 1 && board[i - 1] !== 1 && board[i - numOfCols] !== 1) {
        freePos.push(i)
      } else if (board[i] !== 0) {
        break
      }
    }
    // check positions in column south of node
    for (let i = nodeLoc + (numOfCols * 2); i <= boardSize; i += numOfCols) {
      if (board[i] === 0 && board[nodeLoc + numOfCols] !== -1 && board[i + 1] !== 1 && board[i - 1] !== 1 && board[i + numOfCols] !== 1) {
        freePos.push(i)
      } else if (board[i] !== 0) {
        break
      }
    }
    return freePos
  }
  // set arity to rand num between min- and maxArity and connections to 0
  function getNodeProps (nodeLoc) {
    const newNode = { position: nodeLoc, arity: rand(minArity, maxArity + 1), connections: 0, freeNode: true, nodeToNode: [] }
    return newNode
  }
  // randomly select a parent node where arity > connections
  function getParentNode () {
    const availableNodes = []
    nodeList.map((el) => {
      if (el.arity > el.connections && el.freeNode) availableNodes.push(el)
    })
    // for the first time
    if (nodeList.length === 1) {
      return availableNodes[0]
    } else if (nodeList.length === 0) {
      return false
    } else {
      return availableNodes[rand(0, availableNodes.length)]
    }
  }
  // if there are no options available set freeNode to false
  function noFreeChildNode (nodeLoc) {
    nodeList.map((el) => {
      if (el.position === nodeLoc) el.freeNode = false
    })
  }
  // set the number of bridges
  function setConnections (newNode, parentNode) {
    // at random pick 1 or 2
    const oneOrTwoBridges = rand(0, 2) === 0 ? 1 : 2

    // if arity  = 1 or arity - connections = 1 set 1 bridge
    if (newNode.arity === 1) {
      parentNode.connections += 1
      newNode.connections = 1
    // if arity - connections is 1
    } else if ((parentNode.arity - parentNode.connections) === 1) {
      parentNode.connections += 1
      newNode.connections += 1
    // else 1 or 2 bridges
    } else {
      parentNode.connections += oneOrTwoBridges
      newNode.connections += oneOrTwoBridges
    }
  }
  //  FOR DEBUG PURPOSE, sets nodetonode prop to childnodes
  function setNodeToNode (parentNodePos, newNodePos) {
    nodeList.map(el => {
      if (el.position === parentNodePos) {
        el.nodeToNode.push(newNodePos)
      } else if (el.position === newNodePos) {
        el.nodeToNode.push(parentNodePos)
      }
    })
  }
  // loop to setup all the nodes on the board with N = 2 * number of max nodes
  function setNodes () {
    for (let i = 0; i < (numBoardNodes * 2); i++) {
      let newNode
      // set first node
      if (nodeList.length === 0) {
        setFirstNode()
      }
      // randomly select an already existing node
      const parentNode = getParentNode()
      // break in the event there are no free childnodes available
      if (!parentNode) break
      // find positions for new node
      const newNodePos = findFreePos(parentNode.position)
      // if there are not childnodes available set freeNode to false and reiterate
      if (newNodePos.length === 0) {
        noFreeChildNode(parentNode.position)
        /* set connections, push node to list, set boardposition to -1
               and set surrounding nodes to -1 */
      } else {
        newNode = getNodeProps(newNodePos[rand(0, newNodePos.length)])
        nodeList.push(newNode)
        setConnections(newNode, parentNode)
        board[newNode.position] = 1
        setInbetweenPos(parentNode.position, newNode.position)
        // for debug purpose
        setNodeToNode(parentNode.position, newNode.position)
      }
      if (nodeList.length === numBoardNodes) break
    }
  }
  let counter = 0
  let finalNodeList = []
  let finalBoard = []
  // try untill it reached the set number of nodes or after 500 tries
  while (nodeList.length !== numBoardNodes && counter < 50) {
    nodeList = []
    setBoard()
    setNodes()
    counter++
    // save largest list in case the set number of board nodes aren't reached
    if (nodeList.length > finalNodeList.length) {
      finalNodeList = [...nodeList]
      finalBoard = [...board]
    }
  }
  console.log(finalBoard)
  console.log(finalNodeList)
  /* find the nodes a certain node is connected to */
  // list all nodes and sort
  /* const nodeLocList = []
  finalNodeList.map(element => {
    nodeLocList.push(element.position)
  })
  nodeLocList.sort((a, b) => a - b)
  // get node to node cross coords
  function getNodeToNode (nodeLoc) {
    const crossPos = []
    const gridPos = getGridPos(nodeLoc)
    // check positions in row left of node
    for (let i = nodeLoc - 2; i >= gridPos.row * numOfCols; i--) {
      if (nodeLocList.inc1udes(i)) {
        crossPos.push(i)
        break
      }
    }
    // check positions in row right of node
    for (let i = nodeLoc + 2; i < (gridPos.row + 1) * numOfCols; i++) {
      if (nodeLocList.includes(i)) {
        crossPos.push(i)
        break
      }
    }
    // check positions in column north of node
    for (let i = nodeLoc - (numOfCols * 2); i >= 0; i -= numOfCols) {
      if (nodeLocList.includes(i)) {
        crossPos.push(i)
        break
      }
    }
    // check positions in column south of node
    for (let i = nodeLoc + (numOfCols * 2); i <= boardSize; i += numOfCols) {
      if (nodeLocList.includes(i)) {
        crossPos.push(i)
        break
      }
    }
    return crossPos
  }
  // set the list of nodes a node is connected to as a property
  finalNodeList.map(el => {
    el.nodeToNode = getNodeToNode(el.position)
  }) */
  return finalNodeList
}
