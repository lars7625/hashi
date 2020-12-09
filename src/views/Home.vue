<template>
  <div class="home">
    <h1>Hashi Puzzle</h1>
    <Puzzle :numOfCols='numOfCols' :numOfRows='numOfRows' />
    <div class="controls">
      <select v-model="selectedSize" id="sizeSet" class="sizeOptions">
        <option value="5*5">5*5</option>
        <option value="6*8">6x8</option>
        <option value="10*12">10*12</option>
      </select>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Puzzle from '@/components/Puzzle.vue'

export default {
  name: 'Home',
  components: {
    Puzzle
  },
  data () {
    return {
      selectedSize: '5*5'
    }
  },
  computed: {
    dimensions: function () {
      return this.selectedSize.split('*')
    },
    numOfCols: function () {
      return parseInt(this.dimensions[0])
    },
    numOfRows: function () {
      return parseInt(this.dimensions[1])
    }
  }
}
</script>
