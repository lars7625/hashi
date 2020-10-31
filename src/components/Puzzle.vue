<template>
  <div class="hello">
    <h1>Hashi Puzzle</h1>
    <div class="controls">
      <select id="sizeSet" class="sizeOptions">
        <option value ="10*12">10x12</option>
        <option value ="12*14">12x14</option>
      </select>
      <button id="genPuzzle" class="btn btn-default">Generate Puzzle</button>
    </div>
  </div>
</template>

<script>
import * as SVG from svg.js
import boardGenerator from board.js


export default {
  name: 'Puzzle',
  props: {
  },
  components: {
    HashiBoard
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
