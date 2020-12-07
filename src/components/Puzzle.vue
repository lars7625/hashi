<template>
  <div class="hello">
    <svg class="chart" :viewBox="viewbox" :width="gridWidth" :height="gridHeight">
        <g fill="white" stroke="grey" stroke-width="1">
          <!-- horizontal grid line -->
          <line v-for="(n, i) in numOfRows" :key="'hl' + i" :x1="0" :y1="i * scale" :x2="gridWidth" :y2="i * scale"></line>
          <!-- vertical grid line -->
          <line v-for="(n, i) in numOfCols" :key="'vl' + i" :x1="i * scale" :y1="0" :x2="i * scale" :y2="gridHeight"></line>
        </g>
        <g fill="white" stroke="grey" stroke-width="3">
          <line v-for="(n, i) in hConnNtN" :key="'hcon' + i" :x1="xGridPosN(hConnNtN[i][0])" :y1="yGridPosN(hConnNtN[i][0])" :x2="xGridPosN(hConnNtN[i][1])" :y2="yGridPosN(hConnNtN[i][1])"></line>
        </g>
        <!-- circles for nodes -->
        <g fill="white" stroke="blue" stroke-width="2">
          <circle v-for="(n, i) in numOfNodes" :key="i" :cx="calcXPosC(i)" :cy="calcYPosC(i)" :r="circleRadius" />
        </g>
        <!-- text numbers in hashi circles -->
        <text v-for="(n, i) in numOfNodes" :key="i" :x="calcXPosT(i)" :y="calcYPosT(i)" fill="black" dominant-baseline="middle" text-anchor="middle">{{ board[i].connections }}</text>
    </svg>

    {{board}}
    {{hConnNtN}}
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
      circleRadius: 12
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
    hConnNtN: function () {
      return this.nodeToNodeCoords('e', 'w')
    },
    vConnNtN: function () {
      return this.nodeToNodeCoords('n', 's')
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
    nodeToNodeCoords: function (dir1, dir2) {
      const nodesConn = []
      const parentNodes = []
      this.board.forEach(node => {
        node.nodeToNode.map(el => {
          if (el.charAt(0) === dir1 || el.charAt(0) === dir2) {
            // check for duplicates if not add pair
            if (!parentNodes.includes(parseInt(el.slice(1)))) {
              nodesConn.push([node.position, parseInt(el.slice(1))])
              parentNodes.push(node.position)
            }
          }
        })
      })
      return nodesConn
    },
    xGridPosN: function (nodeLoc) {
      console.log((nodeLoc % this.numOfCols))
      return (nodeLoc % this.numOfCols) * this.scale
    },
    yGridPosN: function (nodeLoc) {
      console.log((nodeLoc % this.numOfCols))
      return (Math.floor(nodeLoc / this.numOfCols)) * this.scale
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
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
