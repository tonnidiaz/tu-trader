<template>
    <TuRightMenu
        :on-trigger="
            (e) => {
                cursorPos = { x: e.clientX, y: e.clientY };
            }
        "
    >
        <template #content>
            <ul class="">
                <li @click="lockCursor">Lock cursor</li>
            </ul>
        </template>
        <div
            ref="chartContainer"
            class="m-auto rounded-md w-100p bg-gray-1000 p-2"
            id="chart"
        >
            <div v-if="symbol" class="legend flex items-center gap-3">
                {{ symbol.join("/") }}&nbsp;&bull;&nbsp;{{
                    interval ? `${interval}m` : ""
                }}&nbsp;
                <span v-for="k in Object.keys(legendContent)">
                    <span v-if="k != 'ts'"
                        >{{ k.toLocaleUpperCase() }}
                        <span
                            :class="
                                Number(legendContent.c) >
                                Number(legendContent.o)
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            "
                            >{{ legendContent[k] }}</span
                        ></span
                    >
                </span>
            </div>
        </div>
    </TuRightMenu>
</template>

<script setup lang="ts">
import {
    CrosshairMode,
    createChart,
    type CandlestickData,
    type DeepPartial,
    type IChartApi,
    type SeriesMarker,
    type Time,
    type TimeChartOptions,
} from "lightweight-charts";

const cursorPos = ref({ x: 0, y: 0 });
const props = withDefaults(
    defineProps<{
        type: string;
        cType: typeof candleType.value;
        symbol: string[];
        interval: number;
        df: any[];
        autosize: boolean;
        chartOptions?: DeepPartial<TimeChartOptions>;
    }>(),
    { type: "candlestick", cType: "ha", autosize: true }
);

const data = ref<any[]>([]);
const utc = ref(2);
const candleType = ref<"ha" | "std">("ha");

const parseTime = (ts: string) => {
    return (new Date(ts).getTime() + utc.value * 60 * 60000) / 1000;
};
const parseCandleData = (df: any[], cType: typeof candleType.value) => {
    console.log("PARSE CANDLE DATA");
    data.value = df.map((el) => {
        const candle = cType == "ha" ? el.ha : el.std;
        return {
            time: parseTime(el.ts),
            open: candle.o,
            high: candle.h,
            low: candle.l,
            close: candle.c,
        };
    });
};
// Function to get the correct series constructor name for current series type.
function getChartSeriesConstructorName(type) {
    return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}

// Lightweight Charts™ instances are stored as normal JS variables
// If you need to use a ref then it is recommended that you use `shallowRef` instead
let seriesList: any[] = [];
let series;
let chart: IChartApi | null;

const chartContainer = ref();

const fitContent = () => {
    if (!chart) return;
    chart.timeScale().fitContent();
};

const getChart = () => {
    return chart;
};

defineExpose({ fitContent, getChart });

const legendContent = ref({ ts: null as Time | null, o: 0, h: 0, l: 0, c: 0 });

function setLocale(locale) {
    chart!.applyOptions({
        localization: {
            locale: locale,
            dateFormat: "ja-JP" === locale || true ? "yy-MM-dd" : "dd MMM 'yy",
        },
    });
}

// Auto resizes the chart when the browser window is resized.
const resizeHandler = () => {
    if (!chart || !chartContainer.value) return;
    const dimensions = chartContainer.value.getBoundingClientRect();
    chart.resize(dimensions.width, dimensions.height);
};

const onCrossHair = (param) => {
    let priceFormatted = "";
    if (param.time) {
        const dataPoint: CandlestickData<Time> | undefined =
            param.seriesData.get(series) as any | undefined;

        if (!dataPoint) return;
        legendContent.value = {
            ts: dataPoint.time,
            o: Number(dataPoint.open.toFixed(4)),
            h: Number(dataPoint.high.toFixed(4)),
            l: Number(dataPoint.low.toFixed(4)),
            c: Number(dataPoint.close.toFixed(4)),
        };
    }
    // legend is a html element which has already been created
};
// Creates the chart series and sets the data.
const addSeriesAndData = (prps: typeof props) => {
    console.log("ADD SERIES DATA...");
    if (!chart) return;
    const _data = data.value;
    const _df = props.df;
    const seriesConstructor = getChartSeriesConstructorName(prps.type);
    for (let series of seriesList) {
        if (series) chart?.removeSeries(series);
    }
    seriesList = []
    series = chart![seriesConstructor]();
    series.setData(_data);
    chart?.unsubscribeCrosshairMove(onCrossHair);
    chart!.subscribeCrosshairMove(onCrossHair);

    const markers: SeriesMarker<number>[] = [];
    const haCloses: any[] = [];
    _df.forEach((el, i) => {
        const haRow = el.ha;
        const time = parseTime(el.ts);
        if (el.sma_20 > el.sma_50) {
            markers.push({
                time,
                position: "aboveBar",
                text: "B",
                shape: "arrowDown",
                color: "green",
            });
            haCloses.push({ time, value: haRow.c });
        }
    });

    series.setMarkers(markers);
    const maSeries = chart.addLineSeries({ color: "#2962FF", lineWidth: 2 });

    maSeries.setData(haCloses);
    seriesList.push(series, maSeries)
    return series;
};
const lockCursor = () => {
    const data = legendContent.value;
    const time = data.ts!;
    const price = data.c;
    chart?.setCrosshairPosition(price, time, series);
};
onMounted(() => {
    // Create the Lightweight Charts Instance using the container ref.
    chart = createChart(chartContainer.value, {
        ...props.chartOptions,
        crosshair: { mode: CrosshairMode.Normal },
        layout: {
            background: {
                color: "rgb(12,17,27)",
            },
            textColor: "rgb(240, 240, 240)",
        },
        grid: {
            vertLines: {
                color: "rgba(45,45,45, .5)",
            },
            horzLines: {
                color: "rgba(45,45,45, .5)",
            },
        },
        timeScale: {
            timeVisible: true,
        },
    });

    setLocale("en-US");
    parseCandleData(props.df, props.cType);
    addSeriesAndData(props);

    chart.timeScale().applyOptions({ barSpacing: 10000 });
    chart.timeScale().fitContent();

    if (props.autosize) {
        window.addEventListener("resize", resizeHandler);
    }
});

onUnmounted(() => {
    if (chart) {
        chart.remove();
        chart = null;
    }
    if (series) {
        series = null;
    }
    window.removeEventListener("resize", resizeHandler);
});

/*
 * Watch for changes to any of the component properties.

 * If an options property is changed then we will apply those options
 * on top of any existing options previously set (since we are using the
 * `applyOptions` method).
 *
 * If there is a change to the chart type, then the existing series is removed
 * and the new series is created, and assigned the data.
 *
 */
watch(
    () => props.autosize,
    (enabled) => {
        if (!enabled) {
            window.removeEventListener("resize", resizeHandler);
            return;
        }
        window.addEventListener("resize", resizeHandler);
    }
);

watch(
    () => props.type,
    (newType) => {
        if (series && chart) {
            chart.removeSeries(series);
        }
        addSeriesAndData(props);
    }
);

watch(
    () => data,
    (newData) => {
        if (!series) return;
        series.setData(newData);
    }
);
watch(
    () => [props.df, props.cType],
    ([newData, newType]) => {
        if (!series) return;
        parseCandleData(newData as any[], newType as typeof candleType.value);
        addSeriesAndData(props);
    },
    { deep: true, immediate: true }
);

watch(
    () => props.chartOptions,
    (newOptions) => {
        if (!chart) return;
        chart.applyOptions(newOptions as any);
    }
);

/* watch(
    () => props.seriesOptions,
    (newOptions) => {
        if (!series) return;
        series.applyOptions(newOptions);
    }
); */

/* watch(
    () => props.priceScaleOptions,
    (newOptions) => {
        if (!chart) return;
        chart.priceScale("").applyOptions(newOptions as any);
    }
); */

/* watch(
    () => props.timeScaleOptions,
    (newOptions) => {
        if (!chart) return;
        chart.timeScale().applyOptions(newOptions as any);
    }
); */
</script>

<style lang="scss">
#chart {
    height: calc(100vh - 300px);
    color: white;
    position: relative;
}
.bg-gray-1000 {
    background-color: rgb(12, 17, 27);
}
.legend {
    position: absolute;
    left: 12px;
    top: 12px;
    z-index: 10;
    font-size: 14px;
    font-family: sans-serif;
    line-height: 18px;
    font-weight: 500;
}
</style>
type DeepPartial, , type TimeChartOptions
