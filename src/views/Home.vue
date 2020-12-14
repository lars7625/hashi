<template>
  <div class="home">
    <h1>Hashi Puzzle</h1>
    <Puzzle :numOfCols='numOfCols' :numOfRows='numOfRows' />
    <div class="controls">
      <select v-model="selectedSize" id="sizeSet" class="sizeOptions">
        <option value="7*7">7*7</option>
        <option value="12*12">12x12</option>
        <option value="15*15">15*15</option>
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
      selectedSize: '7*7'
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
