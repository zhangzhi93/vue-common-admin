<template>
  <div>
    <div id="venn"></div>
  </div>
</template>

<script>
import { select } from 'd3';
import { VennDiagram } from 'venn.js';

export default {
  name: 'Venn',
  data() {
    return {
      sets: [
        { sets: ['A'], size: 12 },
        { sets: ['B'], size: 12 },
        { sets: ['C'], size: 12 },
        { sets: ['A', 'B'], size: 2 },
        { sets: ['A', 'C'], size: 2 },
        { sets: ['B', 'C'], size: 2 },
      ],
    };
  },
  mounted() {
    const chart = VennDiagram();
    select('#venn').datum(this.sets).call(chart);
  },
};
</script>
