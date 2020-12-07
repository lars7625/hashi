<template>
  <div class="hello">
    <svg class="chart" :viewBox="viewbox" :width="gridWidth" :height="gridHeight">
        <g fill="white" stroke="grey" stroke-width="1">
          <line v-for="(n, i) in height" :key="'hl' + i" :x1="0" :y1="i * scale" :x2="gridWidth" :y2="i * scale"></line>
          <line v-for="(n, i) in width" :key="'vl' + i" :x1="i * scale" :y1="0" :x2="i * scale" :y2="gridHeight"></line>
        </g>
        <g fill="white" stroke="blue" stroke-width="2">
          <circle v-for="(n, i) in numOfNodes" :key="i" :cx="calcXPosC(i)" :cy="calcYPosC(i)" :r="circleRadius" />
        </g>
        <text v-for="(n, i) in numOfNodes" :key="i" :x="calcXPosT(i)" :y="calcYPosT(i)" fill="black" dominant-baseline="middle" text-anchor="middle">{{ board[i].connections }}</text>
    </svg>

    {{board}}
    {{numOfConnNodes}}
  </div>
</template>

<script>
import boardGenerator from '@/components/board.js'

export default {
  name: 'Puzzle',
  props: {
    width: {
      type: Number
    },
    height: {
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
      return (this.width - 1) * this.scale
    },
    gridHeight: function () {
      return (this.height - 1) * this.scale
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
      return boardGenerator(this.width, this.height)
    },
    numOfConnNodes: function () {
      let nodeCounter = 0
      this.board.forEach(el => {
        nodeCounter += el.nodeToNode.length
      })
      return nodeCounter / 2
    }
  },
  methods: {
    calcXPosC: function (i) {
      return (this.board[i].position % this.width) * this.scale
    },
    calcYPosC: function (i) {
      return Math.floor(this.board[i].position / this.width) * this.scale
    },
    calcXPosT: function (i) {
      return (this.board[i].position % this.width) * this.scale
    },
    calcYPosT: function (i) {
      return Math.floor(this.board[i].position / this.width) * this.scale
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
