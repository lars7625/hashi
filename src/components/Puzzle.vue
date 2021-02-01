<template>
  <div class="hello">
    <div>
      <svg class="chart" :viewBox="viewbox" :width="gridWidth" :height="gridHeight">
        <!-- invisible lines to trigger function -->
        <g :stroke="gridColor" stroke-width="1">
          <!-- horizontal grid line -->
          <line
          v-for="(n, i) in numOfRows" :key="'hl' + i" :x1="0" :y1="i *
          scale" :x2="gridWidth" :y2="i * scale">
          </line>
          <!-- vertica l grid line -->
          <line
          v-for="(n, i) in numOfCols" :key="'vl' + i" :x1="i * scale"
          :y1="0" :x2="i * scale" :y2="gridHeight">
          </line>
        </g>
        <g :stroke="bridgeColor" :stroke-width="bridgeStrokeW">
        <!-- if one bridge -->
        <line
        v-for="(n,i) in singleBridgeList" :key="'sBridge' + i"
        :x1="xGridPosN(singleBridgeList[i][0])" :y1="yGridPosN(singleBridgeList[i][0])"
        :x2="xGridPosN(singleBridgeList[i][1])" :y2="yGridPosN(singleBridgeList[i][1])">
        </line>
        <!-- if two bridges -->
        <line
        v-for="(n,i) in doubleBridgeList" :key="'dBridgeTop' + i"
        :x1="xGridPosB1of2(doubleBridgeList[i][0])" :y1="yGridPosB1of2(doubleBridgeList[i][0])"
        :x2="xGridPosB1of2(doubleBridgeList[i][1])" :y2="yGridPosB1of2(doubleBridgeList[i][1])">
        </line>
        <line
        v-for="(n,i) in doubleBridgeList" :key="'dBridgeBot' + i"
        :x1="xGridPosB2of2(doubleBridgeList[i][0])" :y1="yGridPosB2of2(doubleBridgeList[i][0])"
        :x2="xGridPosB2of2(doubleBridgeList[i][1])" :y2="yGridPosB2of2(doubleBridgeList[i][1])">
        </line>
        </g>
        <!-- hidden bridges that serve to set the bridges -->
        <line
        v-for="(n, i) in connNtN" @mouseover="highLightBridge(connNtN[i])"
        stroke="white" stroke-opacity="0%" stroke-width="5" :key="'bridgeClick' + i"
        :x1="xGridPosN(connNtN[i][0])" :y1="yGridPosN(connNtN[i][0])"
        :x2="xGridPosN(connNtN[i][1])" :y2="yGridPosN(connNtN[i][1])">
        </line>
        <!-- highlist bridge on hover -->
        <line
        stroke="red"  stroke-opacity="70%" stroke-width="10" :key="'bridgehover'"
        @mouseleave="unHighLightBridge()" v-on:click="setBridges(highlightBridgeList)"
        :x1="xGridPosN(highlightBridgeList[0])" :y1="yGridPosN(highlightBridgeList[0])"
        :x2="xGridPosN(highlightBridgeList[1])" :y2="yGridPosN(highlightBridgeList[1])">
        </line>
        <!-- circles for nodes -->
        <g fill="white" :stroke="circleColor" stroke-width="2">
          <circle
          v-for="(n, i) in numOfNodes" :key="i" :cx="calcXPosC(i)"
          :cy="calcYPosC(i)" :r="circleRadius" />
        </g>
        <!-- text numbers in hashi circles -->
        <text
        v-for="(n, i) in numOfNodes" :key="i" :x="calcXPosT(i)" :y="calcYPosT(i)"
        fill="black" dominant-baseline="middle" text-anchor="middle">
        {{ boardNodes[i].connections }}
        </text>
      </svg>
    </div>
    <div>
      <button v-on:click="checkSolution()">Check  Puzzle</button>
    </div>
  </div>
</template>
connNtN
<script>
import boardGenerator from '@/components/board.js'

export default {
  name: 'Puzzle',
  props: {
    numOfCols: {
      type: Number
    },
    numOfRows: {
      type: Number
    }
  },
  data () {
    return {
      scale: 20,
      offSetX: -20,
      offSetY: -20,
      circleRadius: 10,
      doubleBridgeOffSet: 3,
      singleBridgeList: [],
      doubleBridgeList: [],
      highlightBridgeList: [0, 0],
      unClickableNodes: [],
      bridgeColor: 'black',
      circleColor: 'grey',
      gridColor: 'grey',
      bridgeStrokeW: 2
    }
  },
  components: {
  },
  computed: {
    gridWidth: function () {
      return (this.numOfCols - 1) * this.scale
    },
    gridHeight: function () {
      return (this.numOfRows - 1) * this.scale
    },
    viewbox: function () {
      const gridWidth = this.gridWidth - this.offSetX * 2
      const gridHeight = this.gridHeight - this.offSetY * 2
      return this.offSetX + ' ' + this.offSetY + ' ' + gridWidth + ' ' + gridHeight
    },
    numOfNodes: function () {
      return this.boardNodes.length
    },
    boardNodes: function () {
      return boardGenerator(this.numOfCols, this.numOfRows)
    },
    board: function () {
      let board = []
      const nodePositions = []
      this.boardNodes.forEach(el => {
        nodePositions.push(el.position)
      })
      board = (new Array(this.numOfCols * this.numOfRows)).fill(0)
      board.map((boardEl, boardIdx) => {
        if (nodePositions.includes(boardIdx)) {
          board[boardIdx] = 1
        }
      })
      return board
    },
    connNtN: function () {
      const nodesConn = []
      const parentNodes = []
      let nodes = []
      this.boardNodes.forEach(node => {
        node.nodeToNode.map(el => {
          // check for duplicates if not add pair
          if (!parentNodes.includes(el)) {
            nodes = [node.position, el]
            nodes.sort((a, b) => a - b)
            nodesConn.push([nodes[0], nodes[1]])
            parentNodes.push(node.position)
          }
        })
      })
      return nodesConn
    }
  },
  methods: {
    calcXPosC: function (i) {
      return (this.boardNodes[i].position % this.numOfCols) * this.scale
    },
    calcYPosC: function (i) {
      return Math.floor(this.boardNodes[i].position / this.numOfCols) * this.scale
    },
    calcXPosT: function (i) {
      return (this.boardNodes[i].position % this.numOfCols) * this.scale
    },
    calcYPosT: function (i) {
      return Math.floor(this.boardNodes[i].position / this.numOfCols) * this.scale
    },
    xGridPosN: function (nodeLoc) {
      return (nodeLoc % this.numOfCols) * this.scale
    },
    yGridPosN: function (nodeLoc) {
      return (Math.floor(nodeLoc / this.numOfCols)) * this.scale
    },
    xGridPosB1of2: function (nodeLoc) {
      return (nodeLoc % this.numOfCols) * this.scale - this.doubleBridgeOffSet
    },
    xGridPosB2of2: function (nodeLoc) {
      return (nodeLoc % this.numOfCols) * this.scale + this.doubleBridgeOffSet
    },
    yGridPosB1of2: function (nodeLoc) {
      return (Math.floor(nodeLoc / this.numOfCols)) * this.scale - this.doubleBridgeOffSet
    },
    yGridPosB2of2: function (nodeLoc) {
      return (Math.floor(nodeLoc / this.numOfCols)) * this.scale + this.doubleBridgeOffSet
    },
    getGridPos: function (nodeLoc) {
      const gridPos = { row: 0, col: 0 }
      gridPos.row = (Math.floor(nodeLoc / this.numOfCols))
      gridPos.col = nodeLoc % this.numOfCols

      return gridPos
    },
    setBridges: function (nodes) {
      if (!this.singleBridgeList.includes(nodes) && !this.doubleBridgeList.includes(nodes)) {
        this.singleBridgeList.push(nodes)
        this.setPointsNodes([nodes[0], nodes[1]], 'set')
      } else if (this.singleBridgeList.includes(nodes)) {
        this.singleBridgeList = this.arrRemove(this.singleBridgeList, nodes)
        this.doubleBridgeList.push(nodes)
      } else if (this.doubleBridgeList.includes(nodes)) {
        this.doubleBridgeList = this.arrRemove(this.doubleBridgeList, nodes)
        this.setPointsNodes([nodes[0], nodes[1]], 'remove')
      }
    },
    highLightBridge: function (nodes) {
      if (!this.unClickableNodes.includes(nodes)) {
        this.highlightBridgeList = nodes
      }
    },
    unHighLightBridge: function () {
      this.highlightBridgeList = [0, 0]
    },
    arrRemove: function (arr, val) {
      return arr.filter(el => {
        return el !== val
      })
    },
    checkSolution: function () {
      const nodeList = [...this.boardNodes]
      const oneBridge = this.singleBridgeList.flat()
      const twoBridges = this.doubleBridgeList.flat()
      nodeList.map(el => {
        el.bridges = 0
        oneBridge.forEach(sBridge => {
          if (el.position === sBridge) {
            el.bridges += 1
          }
        })
        twoBridges.forEach(dBridge => {
          if (el.position === dBridge) {
            el.bridges += 2
          }
        })
      })
      let counter = 0
      nodeList.forEach(el => {
        if (el.connections === el.bridges) {
          counter++
        }
      })
      if (counter === nodeList.length) {
        alert('won')
      } else {
        alert('you suck')
      }
    },
    setPointsNodes: function (nodePair, action) {
      const nodes = [nodePair[0], nodePair[1]]
      nodes.sort((a, b) => a - b)
      const node1GridPos = this.getGridPos(nodes[0])
      const node2GridPos = this.getGridPos(nodes[1])
      let newVal = 0
      if (action === 'set') newVal = -1
      // same row
      if (node1GridPos.row === node2GridPos.row) {
        for (let i = nodes[0] + 1; i < nodes[1]; i++) {
          this.board[i] = newVal
        }
      } else if (node1GridPos.col === node2GridPos.col) {
        for (let i = nodes[0] + this.numOfCols; i < nodes[1]; i += this.numOfCols) {
          this.board[i] = newVal
        }
      }
      this.setUnClickableNodes()
    },
    setUnClickableNodes: function () {
      let betweenNodesCounter = 0
      this.connNtN.forEach(nodes => {
        const node1Grid = this.getGridPos(nodes[0])
        const node2Grid = this.getGridPos(nodes[1])
        // check west and south - nodes are sorted ascending
        if (node1Grid.row === node2Grid.row) {
          for (let i = nodes[0] + 1; i < nodes[1]; i++) {
            if (this.board[i] === -1 && !this.singleBridgeList.includes(nodes) && !this.doubleBridgeList.includes(nodes) && !this.unClickableNodes.includes(nodes)) {
              this.unClickableNodes.push(nodes)
              break
            } else if (this.board[i] === 0 && this.unClickableNodes.includes(nodes)) {
              betweenNodesCounter++
              if (betweenNodesCounter === (node2Grid.col - node1Grid.col - 1)) {
                this.unClickableNodes = this.arrRemove(this.unClickableNodes, nodes)
                betweenNodesCounter = 0
              }
            }
          }
        } else if (node1Grid.col === node2Grid.col) {
          for (let i = nodes[0] + this.numOfCols; i < nodes[1]; i += this.numOfCols) {
            if (this.board[i] === -1 && !this.singleBridgeList.includes(nodes) && !this.doubleBridgeList.includes(nodes) && !this.unClickableNodes.includes(nodes)) {
              this.unClickableNodes.push(nodes)
              break
            } else if (this.board[i] === 0 && this.unClickableNodes.includes(nodes)) {
              this.unClickableNodes = this.arrRemove(this.unClickableNodes, nodes)
              betweenNodesCounter++
              if (betweenNodesCounter === (node2Grid.row - node1Grid.row - 1)) {
                this.unClickableNodes = this.arrRemove(this.unClickableNodes, nodes)
                betweenNodesCounter = 0
              }
            }
          }
        }
      })
    }
  },
  watch: {
    numOfCols: function (i) {
      this.singleBridgeList = []
      this.doubleBridgeList = []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
