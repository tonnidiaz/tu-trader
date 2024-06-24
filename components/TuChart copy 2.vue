<!-- <template>
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
            <div class="legend flex items-center gap-3">
                {{ symbol.join("/") }}&nbsp;&bull;&nbsp;{{
                    interval ? `${interval}m` : ""
                }}&nbsp;
                <span v-for="k in Object.keys(legendContent)" 
                    >
                    <span v-if="k != 'ts'">{{ k.toLocaleUpperCase() }}
                    <span
                        :class="
                            Number(legendContent.c) > Number(legendContent.o)
                                ? 'text-green-500'
                                : 'text-red-500'
                        "
                        >{{ legendContent[k] }}</span
                    ></span>
                    
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
    type IChartApi,
    type Time,
} from "lightweight-charts";

const cursorPos = ref({ x: 0, y: 0 });
const props = defineProps<{
    type: string
}>({
    type: {
        type: String,
        default: "candlestick",
    },
    cType: {
        type: typeof candleType,
        default: "ha",
    },
    symbol: { type: Array, default: ["", ""] },
    interval: { type: Number },
    df: {
        type: Array,
        required: true,
    },
    autosize: {
        default: true,
        type: Boolean,
    },
    chartOptions: {
        type: Object,
    },
    seriesOptions: {
        type: Object,
    },
    timeScaleOptions: {
        type: Object,
    },
    priceScaleOptions: {
        type: Object,
    },
});

const data = ref<any[]>([])

const candleType = ref<"ha" | "std">("ha");
const parseCandleData = (data: any[], cType: typeof candleType.value) => {
    return data.map((el) => {
        const candle = cType == "ha" ? el.ha : el.std;
        return {
            time: new Date(el.ts).getTime() / 1000,
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

// Creates the chart series and sets the data.
const addSeriesAndData = (prps: typeof props) => {

    const _data = data.value
    const seriesConstructor = getChartSeriesConstructorName(prps.type);
    series = chart![seriesConstructor](prps.seriesOptions);
    series.setData(_data);

    chart!.subscribeCrosshairMove((param) => {
        let priceFormatted = "";
        if (param.time) {
            const dataPoint: CandlestickData<Time> = param.seriesData.get(
                series
            )! as any;
            legendContent.value = {
                ts: dataPoint.time,
                o: Number(dataPoint.open.toFixed(2)),
                h: Number(dataPoint.high.toFixed(2)),
                l: Number(dataPoint.low.toFixed(2)),
                c: Number(dataPoint.close.toFixed(2)),
            };
        }
        // legend is a html element which has already been created
    });
    return series;
};
const lockCursor = () => {

    const data = legendContent.value
    const time = data.ts!
    const price = data.c
    chart?.setCrosshairPosition(price, time, series,)
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

    addSeriesAndData(props);

    if (props.priceScaleOptions) {
        chart.priceScale("").applyOptions(props.priceScaleOptions);
    }

    if (props.timeScaleOptions || true) {
        chart.timeScale().applyOptions({ barSpacing: 10000 });
    }

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
watch([props.df, props.cType],
    ([newData, newType]) => {
        if (!series) return;
        parseCandleData(newData as any[], newType)
    }
);

watch(
    () => props.chartOptions,
    (newOptions) => {
        if (!chart) return;
        chart.applyOptions(newOptions as any);
    }
);

watch(
    () => props.seriesOptions,
    (newOptions) => {
        if (!series) return;
        series.applyOptions(newOptions);
    }
);

watch(
    () => props.priceScaleOptions,
    (newOptions) => {
        if (!chart) return;
        chart.priceScale("").applyOptions(newOptions as any);
    }
);

watch(
    () => props.timeScaleOptions,
    (newOptions) => {
        if (!chart) return;
        chart.timeScale().applyOptions(newOptions as any);
    }
);
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
 -->