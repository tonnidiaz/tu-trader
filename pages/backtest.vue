<template>
    <div>
        <TMeta :title="`Backtest - ${SITE}`" />
        <div class="w-100p h-100p relative md:p-5 p-2 flex flex-col">
            <div
                class="md:p-4 p-2 my-2 border-md border-card border-1 br-10 flex-1 overflow-y-scroll max-h-80vh"
            >
                <h2 class="font-bold fs-20">RESULTS</h2>
                <div class="my-2 flex gap-10">
                    <TuStats :stats="[{title: 'Trades', subtitle: res.trades ?? 0}, {title: 'Profit', subtitle: `${res.ccy ?? ''} ${formatter
                                .format(res.profit ?? 0)
                                .replace('$', '')}`}, {title: 'W', subtitle: `${(res.gain ?? 0).toFixed(2)}%`}, {title: 'L', subtitle: `${(res.loss ?? 0).toFixed(2)}%`}]"/>
                  
                </div>
                <div class="mt-4 overflow-y-scroll">
                    <BacktestTable
                        v-if="true"
                        :rows="parseData(res)"
                    />
                    <table
                        v-else
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
                class="p-4 border- border-card br-10 params-area bg-gray-900 shadow-lg open"
            >
                <div class="flex justify-between items-center w-100p p-2 gap-2">
                    <span>{{ formState?.symbol?.value.toString() }}</span>
                    <UButton
                        @click="onCtrlBtnClick"
                        class="ctrl-btn btn btn-primary mb-2"
                    >
                        <i class="fi fi-rr-angle-down"></i>
                    </UButton>
                </div>

                <div class="content">
                    <UDivider class="mb-7 mt-2" />
                    <UForm
                        :state="formState"
                        class="space-y-5 flex flex-col items-center"
                        @submit="handleSubmit"
                    >
                    <div class="w-full grid grid-cols-2 gap-4 items-center">
                        <TuSelect placeholder="Platform" :options="selectPlatforms(platforms)" v-model="formState.platform" required/>
                        <UFormGroup>
                                <UCheckbox
                                    color="primary"
                                    label="Offline"
                                    variant="primary
                                "
                                    v-model="formState.offline"
                                />
                            </UFormGroup>
                    </div>
                        <div class="grid grid-cols-2 items-center gap-4 w-full">
                            <USelectMenu
                                searchable
                                searchable-placeholder="Search strategy..."
                                placeholder="Strategy"
                                :options="strategies"
                                option-attribute="name"
                                v-model="formState.strategy"
                                required
                            />
                            <USelectMenu
                                searchable
                                searchable-placeholder="Search interval..."
                                placeholder="Interval"
                                :options="intervals"
                                option-attribute="label"
                                v-model="formState.interval"
                                required
                            />
                          
                        </div>
                        <div class="flex items-end justify-center gap-4">
                            <UFormGroup label="Start balance">
                                <UInput
                                    type="text"
                                    
                                    placeholder="Enter start balance..."
                                    required
                                    v-model="formState.bal"
                                />
                            </UFormGroup>
                            <div class="flex gap-4">
                                <UFormGroup label="Margin"
                                    ><USelectMenu
                                        placeholder="Margin"
                                        :options="margins"
                                        option-attribute="label"
                                        v-model="formState.lev"
                                    ></USelectMenu
                                ></UFormGroup>
                                <UFormGroup label="Pair"
                                    ><USelectMenu
                                        placeholder="Pair"
                                        :options="selectSymbols"
                                        option-attribute="label"
                                        v-model="formState.symbol"
                                        searchable
                                        searchable-placeholder="Search pair..."
                                    ></USelectMenu
                                ></UFormGroup>
                            </div>
                        </div>
                        <div class="flex justify-center">
                            <UFormGroup>
                                <TuDatePicker v-model="formState.date" />
                            </UFormGroup>
                        </div>
                        <div
                            v-if="msg.msg"
                            class="my-2 text-center p-2 bg-base-300 border-card -1 br-5 w-full"
                        >
                            <span>{{ msg.msg }}</span>
                        </div>
                        <UButton
                            type="submit"
                            class="w-full"
                        >
                            Start
                        </UButton>
                    </UForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import $ from "jquery";
import TuDatePicker from "~/components/TuDatePicker.vue";
import { useAppStore } from "~/src/stores/app";
import { selectPlatforms } from "~/utils/constants";
const appStore = useAppStore();
const initRes = { data: {} };
const res = ref<IObj>(initRes);

const { strategies, platforms } = storeToRefs(appStore);
const msg = ref<IObj>({}),
    paramsAreaRef = ref<any>();

const intervals = [1, 5, 15, 30, 60].map((e) => ({ label: `${e}m`, value: e }));
const margins = [1, 2, 3, 4, 5].map((e) => ({ label: `x${e}`, value: e }));

const formState = reactive({
    strategy: strategies.value[6],
    interval: intervals[2],
    bal: 1000,
    offline: true,
    lev: margins[0],
    platform: 1,
    symbol: selectSymbols.find((el) => el.value.toString() == "SOL,USDT"),
    date: {
        start: "2023-01-01 00:00:00",
        end:  "2023-10-28 23:59:00",
    },
});

const getData = (ts: string) => res.value.data[ts];
const parseData = (data: IObj) => {
    let d = Object.keys(data.data).slice(0,50).map((ts, i) => {
        let obj =data.data[ts]
        obj = {...obj,  side: {value: obj.side.toUpperCase(), class:  i % 2 != 0 ? '!text-red-500' : '!text-primary'}, balance: `${i%2 == 0 ? data.base : data.ccy} ${obj.balance}\t${obj.profit ?? ''}`, class: i % 2 != 0 ? 'bg-gray-800' : ''}
        return obj
    });
    return d;
};

const onBacktest = (data: any) => {
    console.log("ON BACKTEST");
    if (data.data) {
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
        msg.value = {msg: 'IO DISCONNECTED'}
    });
    socket.on("connect", () => {
        console.log("IO CONNECTED");
        msg.value = {msg: 'IO CONNECTED'}
    });
});

const handleSubmit = async (e: any) => {
    try {
        let fd: IObj = {
            ...formState,
            strategy: strategies.value.indexOf(formState.strategy) + 1,
            lev: formState.lev.value,
            symbol: formState.symbol?.value,
            interval: formState.interval.value,
            ...formState.date,
        };
        delete fd["date"];
        fd = { ...fd, start: parseDate(fd.start), end: parseDate(fd.end) };
        console.log(fd);
        res.value = initRes;
        socket.emit("backtest", fd);
    } catch (e) {
        console.log(e);
    }
};

const onCtrlBtnClick = (e: any) => {
    const paramsArea = paramsAreaRef.value;
    $(paramsArea!).toggleClass("open");
};
</script>
