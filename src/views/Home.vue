<template>
  <div class="home">
    <h1>Hashi Puzzle</h1>
    <Puzzle :width='width' :height='height' />
    <div class="controls">
      <select v-model="selectedSize" id="sizeSet" class="sizeOptions">
        <option value="4*5">4*5</option>
        <option value="8*8">8x8</option>
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
      selectedSize: '4*5'
    }
  },
  computed: {
    dimensions: function () {
      return this.selectedSize.split('*')
    },
    width: function () {
      return parseInt(this.dimensions[0])
    },
    height: function () {
      return parseInt(this.dimensions[1])
    }
  }
}
</script>
