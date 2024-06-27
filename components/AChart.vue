<template>
    <div>
      <VueApexCharts type="candlestick" :options="chartOptions" :series="series"></VueApexCharts>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ApexCharts from 'apexcharts';
  import VueApexCharts from 'vue3-apexcharts';
  
  const chartOptions = ref({
    chart: {
      type: 'candlestick',
      height: 350,
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true | '<img src="/static/icons/reset.png" width="20">',
          customIcons: []
        },
        export: {
          csv: {
            filename: undefined,
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          },
          svg: {
            filename: undefined,
          },
          png: {
            filename: undefined,
          }
        },
        autoSelected: 'zoom' 
      },
    },
    title: {
      text: 'Custom Candle Data with Drawing Tools',
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  });
  
  const series = ref([
    {
      data: [
        {
          x: new Date(2021, 5, 1),
          y: [33800, 34000, 33600, 33950],
        },
        {
          x: new Date(2021, 5, 2),
          y: [33950, 34100, 33700, 33800],
        },
        {
          x: new Date(2021, 5, 3),
          y: [33800, 33950, 33500, 33600],
        },
        // Add more data as needed
      ],
    },
  ]);
  
/*   export default {
    components: {
      apexchart: VueApexCharts,
    },
  }; */
  </script>
  
  <style scoped>
  /* Add any custom styles for your chart component */
  </style>
  