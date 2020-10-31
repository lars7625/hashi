(function boardGenerator (rowSize, colSize) {
    // row size
    rowSize = 4;
    // column size
    colSize = 4;
    const boardSize = rowSize * colSize;
    let board = []
    let nodeList = []
    // number of nodes the board can contain
    let numBoardNodes = boardSize / 3
    // min arity / options for connections
    minArity = 1
    // max arity / options for connections
    maxArity = 6

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    // get the position of a node on the grid
    function getGridPos(nodeLoc) {
        let gridPos = {row: 0, col: 0}
        gridPos.row = Math.floor(nodeLoc / rowSize)
        gridPos.col = nodeLoc % rowSize

        return gridPos;
    }
    // Create an array  with amount of elements set to 0 based on boardSize
    function setBoard() {
        board = (new Array(boardSize)).fill(0);
    }
    // Set first node
    // List of nodes with [{position: x=<boardSize, arity: y= 1 <= maxArity, connections: z= 1 <= maxArity}]
    function setFirstNode() {
        const firstRandomNodePos = rand(0, boardSize)
        const firstRandomNodeArity = rand(minArity, maxArity)
        setSurNodes(firstRandomNodePos)
        nodeList.push({position: firstRandomNodePos, arity: firstRandomNodeArity, connections: 0, freeNode: true})
        board[firstRandomNodePos] = 1
    }
    // Sets surrounding positions to not available / to -1
    function setSurNodes(nodeLoc) {
        const gridPos = getGridPos(nodeLoc)
        // node is not first el in a row
        if(gridPos.col != 0) {
            board[nodeLoc-1] = -1
        }
        // node is not last el in a row
        if(gridPos.col != colSize) {
            board[nodeLoc+1] = -1
        }
        // node is not in the top row
        if(gridPos.row != 0) {
            board[nodeLoc-rowSize] = -1
        }
        // node is not in the bottom row
        if(gridPos.row != rowSize) {
            board[nodeLoc+rowSize] = -1
        }
    }
    // return list of free positions for new node
    function findFreePos(nodeLoc) {
        freePos = []
        const gridPos = getGridPos(nodeLoc)
        // check positions in row left of node
        for(let i = (gridPos.col - 2) + (gridPos.row * rowSize); i >= gridPos.row * rowSize ; i--) {
            if(board[i] === 0){
             freePos.push(i)
            } else {
                break;
            }
        }
        // check positions in row right of node
        for(let i = (gridPos.row * rowSize) + (gridPos.col + 2); i < (gridPos.row + 1) * rowSize; i++) {
            if(board[i] === 0){
                freePos.push(i)
               } else {
                   break;
               }
        }
        // check positions in column north of node
        for(let i = (gridPos.row * rowSize + gridPos.col) - (rowSize * 2); i >= 0; i-=rowSize) {
            if(board[i] === 0){
                freePos.push(i)
               } else {
                   break;
               }
        }
        // check positions in column south of node
        for(let i = (gridPos.row * rowSize + gridPos.col) + (rowSize * 2); i <= boardSize; i+=rowSize) {
            if(board[i] === 0){
                freePos.push(i)
               } else {
                   break;
               }
        }
        return freePos
    }
    // set arity to rand num between min- and maxArity and connections to 0
    function setNodeProps(nodeLoc) {
        let newNode = {position: nodeLoc, arity: rand(minArity, maxArity + 1), connections: 0, freeNode: true}
        return newNode;
    }
    // randomly select a parent node where arity > connections
    function getParentNode() {
        availableNodes = []
        nodeList.map((el) => {
            if(el.arity > el.connections && el.freeNode && (el.arity - el.connections !== 0)) availableNodes.push(el)
        })
        // for the first time
        if(nodeList.length === 1) {
            return availableNodes[0]
        } else {
            return availableNodes[rand(0,availableNodes.length)];
        }       
    }
    // if there are no options available set freeNode to false
    function noFreeChildNode(nodeLoc) {
        if (freePos.length === 0) {
            nodeList.map((el) => {
                if(el.position === nodeLoc) el.freeNode = false;
            })
        }
    }
    // set the number of bridges
    function setConnections(newNode, parentNode) {
        const oneOrTwoBridges = rand(0.2) === 0 ? 1 : 2
        console.log(oneOrTwoBridges)
        // at random pick 1 or 2
        
        // if arity  = 1 or arity - connections = 1 set 1 bridge
        if(parentNode.arity === 1 || newNode.arity === 1) {
            parentNode.connections = 1
            newNode.connections = 1
        }
        // if arity - connections is 1
        else if((parentNode.arity - parentNode.connections) === 1 ||
        (parentNode.arity - parentNode.connections) === 1){
            parentNode.connections += 1
            newNode.connections += 1
        }
        // else 1 or 2 bridges
        else {
            parentNode.connections += oneOrTwoBridges
            newNode.connections += oneOrTwoBridges
        }
    }

    // loop to setup all the nodes on the board with N = 2 * number of max nodes
    function setNodes(){
        for(i = 0; i < (numBoardNodes * 2); i++) {
            let newNode
            // set first node
            if(nodeList.length === 0) {setFirstNode()
            }
            // randomly select an already existing node
            const parentNode = getParentNode()
            // break in the event there are no free childnodes available
            if(parentNode === undefined) break;
            // find positions for new node
            let newNodePos = findFreePos(parentNode.position)  
            // if there are not childnodes available set freeNode to false and reiterate
            if(newNodePos.length === 0) {
                noFreeChildNode(parentNode.position)
            /* set connections, push node to list, set boardposition to -1 
               and set surrounding nodes to -1 */
            } else {        
                newNode = setNodeProps(newNodePos[rand(0, newNodePos.length)])
                setConnections(newNode, parentNode)
                nodeList.push(newNode)
                board[newNode.position] = 1
                setSurNodes(newNode.position)
            }   
            if(nodeList.length === numBoardNodes) break;
        }
    }
    let counter = 0
    let finalNodeList = []
    // try untill it reached the set number of nodes or after 10 tries
    while(nodeList.length !== numBoardNodes && counter < 10) {
        nodeList = []
        setBoard()
        setNodes() 
        counter++
        //console.log(nodeList)
        // save largest list in case the set number of board nodes aren't reached
        if(nodeList.length > finalNodeList.length) finalNodeList = [...nodeList]
    }
    
    console.log(finalNodeList)

})()

// export default boardGenerator .