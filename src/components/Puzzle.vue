<template>
  <div class="hello">
    <svg class="chart" :viewBox="viewbox" :width="gridWidth" :height="gridHeight">
      <!-- invisible lines to trigger function -->
      <g fill="white" stroke="grey" stroke-width="1">
        <!-- horizontal grid line -->
        <line v-for="(n, i) in numOfRows" :key="'hl' + i" :x1="0" :y1="i * scale" :x2="gridWidth" :y2="i * scale"></line>
        <!-- vertical grid line -->
        <line v-for="(n, i) in numOfCols" :key="'vl' + i" :x1="i * scale" :y1="0" :x2="i * scale" :y2="gridHeight"></line>
      </g>
      <line v-for="(n,i) in singleBridgeList" stroke="black" stroke-width="5" :key="'sBridge' + i" :x1="xGridPosN(singleBridgeList[i][0])" :y1="yGridPosN(singleBridgeList[i][0])" :x2="xGridPosN(singleBridgeList[i][1])" :y2="yGridPosN(singleBridgeList[i][1])"></line>
      <!-- if two bridges -->
      <line v-for="(n,i) in doubleBridgeList" stroke="black" stroke-width="5" :key="'dBridgeTop' + i" :x1="xGridPosB1of2(doubleBridgeList[i][0])" :y1="yGridPosB1of2(doubleBridgeList[i][0])" :x2="xGridPosB1of2(doubleBridgeList[i][1])" :y2="yGridPosB1of2(doubleBridgeList[i][1])"></line>
      <line v-for="(n,i) in doubleBridgeList" stroke="black" stroke-width="5" :key="'dBridgeBot' + i" :x1="xGridPosB2of2(doubleBridgeList[i][0])" :y1="yGridPosB2of2(doubleBridgeList[i][0])" :x2="xGridPosB2of2(doubleBridgeList[i][1])" :y2="yGridPosB2of2(doubleBridgeList[i][1])"></line>
      <line v-on:click="setBridges(i)" stroke="white" stroke-opacity="0%" stroke-width="20" v-for="(n, i) in connNtN" :key="'bridgeClick' + i" :x1="xGridPosN(connNtN[i][0])" :y1="yGridPosN(connNtN[i][0])" :x2="xGridPosN(connNtN[i][1])" :y2="yGridPosN(connNtN[i][1])"></line>
      <!-- circles for nodes -->
      <g fill="white" stroke="blue" stroke-width="2">
        <circle v-for="(n, i) in numOfNodes" :key="i" :cx="calcXPosC(i)" :cy="calcYPosC(i)" :r="circleRadius" />
      </g>
      <!-- text numbers in hashi circles -->
      <text v-for="(n, i) in numOfNodes" :key="i" :x="calcXPosT(i)" :y="calcYPosT(i)" fill="black" dominant-baseline="middle" text-anchor="middle">{{ board[i].connections }}</text>
    </svg>
  </div>
</template>

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
      scale: 50,
      offSetX: -20,
      offSetY: -20,
      circleRadius: 12,
      doubleBridgeOffSet: 5,
      singleBridgeList: [],
      doubleBridgeList: [],
      bridgeColor: 'black'
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
      return this.board.length
    },
    board: function () {
      return boardGenerator(this.numOfCols, this.numOfRows)
    },
    numOfConnNodes: function () {
      let nodeCounter = 0
      this.board.forEach(el => {
        nodeCounter += el.nodeToNode.length
      })
      return nodeCounter / 2
    },
    connNtN: function () {
      return this.nodeToNodeCoords()
    }
  },
  methods: {
    calcXPosC: function (i) {
      return (this.board[i].position % this.numOfCols) * this.scale
    },
    calcYPosC: function (i) {
      return Math.floor(this.board[i].position / this.numOfCols) * this.scale
    },
    calcXPosT: function (i) {
      return (this.board[i].position % this.numOfCols) * this.scale
    },
    calcYPosT: function (i) {
      return Math.floor(this.board[i].position / this.numOfCols) * this.scale
    },
    nodeToNodeCoords: function () {
      const nodesConn = []
      const parentNodes = []
      this.board.forEach(node => {
        node.nodeToNode.map(el => {
          // check for duplicates if not add pair
          if (!parentNodes.includes(el)) {
            nodesConn.push([node.position, el])
            parentNodes.push(node.position)
          }
        })
      })
      return nodesConn
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
    setBridges: function (i) {
      if (!this.singleBridgeList.includes(this.connNtN[i]) && !this.doubleBridgeList.includes(this.connNtN[i])) {
        this.singleBridgeList.push(this.connNtN[i])
      } else if (this.singleBridgeList.includes(this.connNtN[i])) {
        this.singleBridgeList = this.arrRemove(this.singleBridgeList, this.connNtN[i])
        this.doubleBridgeList.push(this.connNtN[i])
      } else if (this.doubleBridgeList.includes(this.connNtN[i])) {
        this.doubleBridgeList = this.arrRemove(this.doubleBridgeList, this.connNtN[i])
      }
    },
    arrRemove: function (arr, val) {
      return arr.filter(el => {
        return el !== val
      })
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
