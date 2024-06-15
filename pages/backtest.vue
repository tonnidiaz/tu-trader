<template>
    <div>
        <TMeta :title="`Backtest - ${SITE}`" />
        <div class="w-100p h-100p relative md:p-5 p-2 flex flex-col">
            <div
                class="md:p-4 p-2 my-2 border-md border-card border-1 br-10 flex-1 overflow-y-scroll max-h-80vh"
            >
                <h2 class="font-bold fs-20">RESULTS</h2>
                <div class="my-2 flex gap-10">
                    <TuStats
                        :stats="[
                            { title: 'Trades', subtitle: res.trades ?? 0 },
                            {
                                title: 'Profit',
                                subtitle: `${res.ccy ?? ''} ${formatter
                                    .format(res.profit ?? 0)
                                    .replace('$', '')}`,
                            },
                            {
                                title: 'W',
                                subtitle: `${(res.gain ?? 0).toFixed(2)}%`,
                            },
                            {
                                title: 'L',
                                subtitle: `${(res.loss ?? 0).toFixed(2)}%`,
                            },
                        ]"
                    />
                </div>
                <div class="mt-4 overflow-y-scroll">
                    <BacktestTable v-if="true" :rows="parseData(res)" />
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
                    <span>{{ formState?.symbol }}</span>
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
                            <TuSelect
                                placeholder="Platform"
                                :options="selectPlatforms(platforms)"
                                v-model="formState.platform"
                                required
                            />

                            <div class="flex items-center gap-2">
                                <UFormGroup>
                                    <UCheckbox
                                        color="primary"
                                        label="Offline"
                                        variant="primary
                                "
                                        v-model="formState.offline"
                                    />
                                </UFormGroup>
                                <UFormGroup>
                                    <UCheckbox
                                        color="primary"
                                        label="Use file"
                                        variant="primary
                                "
                                        v-model="formState.useFile"
                                    />
                                </UFormGroup>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <UInput
                                :required="formState.useFile"
                                size="sm"
                                type="file"
                                @change="(e) => (formState.file = e[0])"
                            />
                           
                        </div>
                        <div class="flex items-center gap-3 justify-center">
                            <UCheckbox
                                    color="primary"
                                    label="Parsed"
                                    variant="primary
                                "
                                    v-model="formState.isParsed"
                                />
                                <UCheckbox
                                    color="primary"
                                    label="Heikin-ashi"
                                    variant="primary
                                "
                                    v-model="formState.isHa"
                                />
                        </div>

                        <div class="grid grid-cols-2 items-center gap-4 w-full">
                            <div class="flex items-center gap-2">
                                <TuSelect
                                    class="flex-1"
                                    searchable
                                    innerHint="Search strategy..."
                                    placeholder="Strategy"
                                    :options="toSelectStrategies(strategies)"
                                    v-model="formState.strategy"
                                    required
                                />
                                <a
                                    target="_blank"
                                    title="More info on strategies"
                                    href="/utils/strategies"
                                >
                                    <span class="text-primary"
                                        ><i class="fi fi-br-interrogation"></i
                                    ></span>
                                </a>
                            </div>

                            <TuSelect
                                placeholder="Interval"
                                :options="intervals"
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
                                    ><TuSelect
                                        placeholder="Margin"
                                        :options="margins"
                                        v-model="formState.lev"
                                    ></TuSelect
                                ></UFormGroup>
                                <UFormGroup label="Pair"
                                    ><TuSelect
                                        placeholder="Pair"
                                        :options="selectSymbols"
                                        v-model="formState.symbol"
                                        searchable
                                        innerHint="Search pair..."
                                    ></TuSelect
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
                        <UButton type="submit" class="w-full"> Start </UButton>
                    </UForm>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import $ from "jquery";
import TuDatePicker from "~/components/TuDatePicker.vue";
import TuSelect from "~/components/TuSelect.vue";
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

const formState = reactive<IObj>({
    strategy: 2,
    interval: 15,
    bal: 1000,
    offline: true,
    lev: 1,
    platform: 0,
    symbol: ["SOL", "USDT"].toString(),
    date: {
        start: "2023-01-01 00:00:00",
        end: "2023-10-28 23:59:00",
    },
});

const getData = (ts: string) => res.value.data[ts];
const parseData = (data: IObj) => {
    let dataKeys = Object.keys(data.data);
    const dataLength = dataKeys.length;
    dataKeys =
        dataLength > 501
            ? [
                  ...dataKeys.slice(0, 500),
                  ...dataKeys.slice(dataLength - 1, dataLength),
              ]
            : dataKeys;
    let d = dataKeys.map((ts, i) => {
        let obj = data.data[ts];
        const _side = obj.side.toLowerCase();
        const isSell = _side.startsWith("sell");
        obj = {
            ...obj,
            side: {
                value: obj.side.toUpperCase(),
                class: obj.balance
                    ? isSell
                        ? "!text-red-500"
                        : "!text-primary"
                    : "!text-white",
            },
            balance: `${!isSell ? data.base : data.ccy} ${
                obj.balance ?? "N/A"
            }\t${obj.profit ?? ""}`,
            class: `${isSell ? "bg-gray-800" : ""} ${
                !obj.balance ? "linethrough bg-red-500" : ""
            }`,
        };
        return obj;
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
        msg.value = { msg: "IO DISCONNECTED" };
    });
    socket.on("connect", () => {
        console.log("IO CONNECTED");
        msg.value = { msg: "IO CONNECTED" };
    });
});

const handleSubmit = async (e: any) => {
    try {
        let fd: IObj = {
            ...formState,
            strategy: formState.strategy,
            lev: formState.lev,
            symbol: formState.symbol.split(","),
            interval: formState.interval,
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
