<template>
    <div>
        <TMeta :title="`Backtest - ${SITE}`" />
        <div class="w-100p h-100p relative md:p-5 p-2 flex flex-col">
            <div
                class="md:p-4 p-2 my-2 border-md border-card border-1 br-10 flex-1 overflow-y-scroll max-h-80vh"
            >
                <h2 class="font-bold fs-20">RESULTS</h2>
                <div class="my-2 flex gap-10">
                    <div class="stats shadow">
                        <TuStat title="Trades" :value="res.trades ?? 0" />
                        <TuStat
                            title="Profit"
                            :value="`${res.ccy ?? ''} ${formatter
                                .format(res.profit ?? 0)
                                .replace('$', '')}`"
                        />
                        <TuStat title="G" :value="`${res.gain ?? 0}%`" />
                        <TuStat title="L" :value="`${res.loss ?? 0}%`" />
                    </div>
                </div>
                <div class="mt-4 overflow-y-scroll">
                    <table
                        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                        <thead
                            class="text-xs uppercase bg-gray-700 text-gray-400"
                        >
                            <tr>
                                <th scope="col" class="px-6 py-3">Timestamp</th>
                                <th scope="col" class="px-6 py-3">Side</th>
                                <th scope="col" class="px-6 py-3">Close</th>
                                <th scope="col" class="px-6 py-3">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(ts, i) in Object.keys(res.data)"
                                class="odd:bg-gray-900 even:bg-gray-800 border-gray-700"
                            >
                                <th
                                    scope="row"
                                    class="px-6 py-4 font-medium text-gray-200 whitespace-nowrap dark:text-white"
                                >
                                    {{ ts }}
                                </th>
                                <td
                                    :class="
                                        'px-6 py-4 ' +
                                        (getData(ts)['side'].toLowerCase() ==
                                        'buy'
                                            ? 'text-success'
                                            : 'text-error')
                                    "
                                >
                                    {{ getData(ts)["side"].toUpperCase() }}
                                </td>
                                <td class="px-6 py-4 text-gray-300">
                                    {{ res.ccy }}
                                    {{ getData(ts)["close"] ?? getData(ts).c }}
                                </td>
                                <td class="px-6 py-4 text-gray-300">
                                    {{
                                        getData(ts)["side"] == "buy"
                                            ? res.base
                                            : res.ccy
                                    }}
                                    {{ getData(ts)["balance"] }}
                                    &nbsp;&nbsp;{{ getData(ts)["profit"] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div
                ref="paramsAreaRef"
                class="p-4 border-1 border-card br-10 params-area bg-base-100 shadow-lg"
            >
                <div class="flex justify-between items-center w-100p mb-2">
                    <span>{{ fd?.symbol?.value.toString() }}</span>
                    <button
                        @click="onCtrlBtnClick"
                        class="ctrl-btn btn btn-primary mb-2"
                    >
                        <i class="fi fi-rr-angle-down"></i>
                    </button>
                </div>
                <div class="content">
                    <TuForm :on-submit="handleSubmit">
                        <div class="flex flex-col items-center">
                            <div
                                class="form-field flex items-center flex-col md:flex-row justify-center gap-4"
                            >
                                <div class="flex items-center gap-4">
                                    <select
                                        name="strategy"
                                        id="str"
                                        class="select select-bordered"
                                        onMouseDown="{getStrategies}"
                                        title="Click to update strategies"
                                        @change="(e: any) => { fd = {...fd,strategy: e.target.value }}"
                                        :value="fd.strategy"
                                    >
                                        <option value="" disabled>
                                            Strategy
                                        </option>
                                        <option
                                            v-for="(e, i) in strategies"
                                            :value="i + 1"
                                            :title="e.desc"
                                        >
                                            {e.name}
                                        </option>
                                    </select>
                                    <select
                                        class="select select-bordered"
                                        @change="(e: any) => { fd = {...fd,interval: e.target.value }}"
                                        :value="fd.interval"
                                    >
                                        <option value="" disabled>
                                            Interval
                                        </option>
                                        <option
                                            v-for="(e, i) in [5, 15, 30, 60]"
                                            :value="e"
                                        >
                                            {{ e }}m
                                        </option>
                                    </select>
                                </div>

                                <div
                                    class="flex items-center gap-2"
                                    title="Use previously downloaded data if available"
                                >
                                    <label for="offline"> Offline: </label>
                                    <input
                                        @change="(e: any) => { fd = {...fd,offline: e.target.checked }}"
                                        class="checkbox"
                                        type="checkbox"
                                        name="offline"
                                        id="offline"
                                        :checked="fd.offline"
                                    />
                                </div>
                            </div>
                            <div
                                class="form-field m-auto text-center flex items-center md:items-end flex-col md:flex-row justify-center gap-4"
                            >
                                <label>
                                    <div class="label">
                                        <span class="label-text">
                                            Initial balance:
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        class="input input-bordered w-full sm:w-auto"
                                        placeholder="Enter balance..."
                                        :value="fd.bal"
                                        @change="(e: any) => {
                                                const val: any = e.target.value;
                                                if (isNaN(val)) return;
                                                fd = {
                                                    ...fd,
                                                    bal: e.target.value,
                                                }
                                            }"
                                    />
                                </label>
                                <div class="flex gap-4">
                                    <select
                                        class="select select-bordered"
                                        @change="(e: any) => { fd = {...fd,lev: e.target.value }}"
                                        default-value=""
                                    >
                                        <option value="" disabled>
                                            Margin
                                        </option>
                                        <option
                                            v-for="(e, i) in [1, 2, 3, 4, 5]"
                                            :value="e"
                                        >
                                            x{{ e }}
                                        </option>
                                    </select>
                                    <TuSelect
                                        @change="(e: any) => { fd = {...fd,symbol: e.target.value }}"
                                        :options="selectSymbols"
                                        :value="fd.symbol"
                                        placeholder="Pair"
                                    />
                                </div>
                            </div>
                            <div
                                class="mt-2 flex flex-col md:flex-row justify-center gap-5"
                            >
                                <label>
                                    <div class="label">
                                        <span class="label-text"> From: </span>
                                    </div>
                                    <TuField
                                        type="datetime-local"
                                        :default-value="fd.start"
                                        @change="(e: any) => { fd = {...fd,start: e.target.value }}"
                                        hint=""
                                    />
                                </label>
                                <label>
                                    <div class="label">
                                        <span class="label-text"> To: </span>
                                    </div>
                                    <TuField
                                        type="datetime-local"
                                        :default-value="fd.end"
                                        :disabled="!fd.start"
                                        :min="fd.start ? fd.start : null"
                                        :max="
                                            fd.start
                                                ? fd.start.split('-')[0] +
                                                  '-12-31T23:59'
                                                : undefined
                                        "
                                        @change="(e: any) => { fd = {...fd,end: e.target.value }}"
                                        hint=""
                                    />
                                </label>
                            </div>
                            <div
                                class="form-field m-auto text-center mt-5 w-full relative"
                            >
                                <div
                                    v-if="msg.msg"
                                    class="my-2 p-2 bg-base-300 border-card border-1 br-5"
                                >
                                    <span>{{ msg.msg }}</span>
                                </div>
                                <button
                                    :disabled="
                                        !(fd.bal > 0 && fd.symbol != null) ||
                                        (Object.keys(msg).length > 0 &&
                                            !msg.err)
                                    "
                                    class="btn btn-primary w-full"
                                    type="submit"
                                >
                                    START
                                </button>
                            </div>
                        </div>
                    </TuForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import $ from "jquery"

const initRes = { data: {} };
const res = ref<IObj>(initRes);
const fd = ref<IObj>({
    strategy: 1,
    interval: 15,
    bal: 1000,
    offline: true,
    start: "2021-01-01 00:00",
    end: "2021-10-28 23:59",
    symbol: selectSymbols.find((el) => el.value.toString() == "SOL,USDT"),
});

const msg = ref<IObj>({}),
    strategies = ref<any[]>([]),
    paramsAreaRef = ref<any>();

const getData = (ts: string) => res.value.data[ts];

const onBacktest = (data: any) => {
    console.log("ON BACKTEST");
    if (data.data) {
        console.log(data.data);
        res.value = data.data;
        msg.value = {};
    } else if (data.err) {
        msg.value = { msg: data.err, err: true };
    } else {
        console.log(data);
        msg.value = { msg: data };
    }
};
onMounted(() => {
    socket.on("backtest", onBacktest);
    socket.on("disconnect", (r, d) => {
        console.log("IO DISCONNECTED");
        console.log(r);
        console.log(d);
    });
});

const handleSubmit = async (e: any) => {
    try {
        let data = fd.value;
        const start = data.start
            ? data.start.split("T").join(" ") + ":00 GMT+2"
            : null;
        const end = data.end
            ? data.end.split("T").join(" ") + ":00 GMT+2"
            : null;
        data = {
            ...data,
            start,
            end,
            username: "tonnidiaz",
            symbol: data.symbol.value,
        };
        console.log(data);
        res.value = initRes;
        socket.emit("backtest", data);
    } catch (e) {
        console.log(e);
    }
};

const onCtrlBtnClick = (e: any) => {
    const paramsArea = paramsAreaRef.value;
    $(paramsArea!).toggleClass("open");
};
</script>
