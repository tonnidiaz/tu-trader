<template>
    <div class="m-auto rounded-md w-100p bg-gray-1000" id="chart"></div>
</template>

<script setup lang="ts">
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import DarkTheme from "@amcharts/amcharts5/themes/Dark";

onMounted(() => {
    const root = am5.Root.new("chart");
    root.setThemes([DarkTheme.new(root)]);
    var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panY: false,
            wheelY: "zoomX",
            layout: root.verticalLayout,
            maxTooltipDistance: 0, panX: true, pinchZoomX: false, 
        })
    );

    // Define data
    var data = testCandles.map((el) => ({ ...el, ts: Date.parse(el.ts) }));

    // Create Y-axis
    var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {}),
        })
    );

    // Create X-Axis
    var xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: "minute", count: 15 },
            renderer: am5xy.AxisRendererX.new(root, {
                minGridDistance: 50,
            }),
        })
    );

    // Create series
    var series = chart.series.push(
        am5xy.CandlestickSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            openValueYField: "o",
            highValueYField: "h",
            lowValueYField: "l",
            valueYField: "c",
            valueXField: "ts",
            tooltip: am5.Tooltip.new(root, {}),
        })
    );

    series.columns.template.states.create("riseFromOpen", {
        fill: am5.color(0x76b041),
        stroke: am5.color(0x76b041),
    });
    series.columns.template.states.create("dropFromOpen", {
        fill: am5.color(0xe4572e),
        stroke: am5.color(0xe4572e),
    });

    series
        .get("tooltip")
        ?.label.set(
            "text",
            "[bold]{valueX.formatDate()}[/]\nOpen: {openValueY}\nHigh: {highValueY}\nLow: {lowValueY}\nClose: {valueY}"
        );
    series.data.setAll(data);

    // Add cursor
    chart.set(
        "cursor",
        am5xy.XYCursor.new(root, {
            behavior: "zoomXY",
            xAxis: xAxis,
        })
    );

    xAxis.set(
        "tooltip",
        am5.Tooltip.new(root, {
            themeTags: ["axis"],
        })
    );

    yAxis.set(
        "tooltip",
        am5.Tooltip.new(root, {
            themeTags: ["axis"],
        })
    );
});
</script>

<style lang="scss">
#chart {
    height: calc(100vh - 300px);
    color: wheat;
}
.bg-gray-1000 {
    background-color: rgb(12, 17, 27);
}
</style>
