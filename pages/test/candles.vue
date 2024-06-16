<template>
    <div>
        <TMeta :title="`Candle test - ${SITE}`" />
        <div class="w-100p h-100p relative md:p-5 p-2 flex flex-col">
            <div
                class="md:p-4 p-2 my-2 border-md border-card border-1 br-10 flex-1 overflow-y-scroll max-h-80vh"
            >
                <h2 class="font-bold fs-20">RESULTS</h2>
     
                <div class="mt-4 overflow-y-scroll">
                    <CandleTestTable v-if="true" :rows="res.data" />
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

                        <div class="grid grid-cols-2 items-center gap-4 w-full">
                            <UFormGroup label="Pair"
                                    ><TuSelect
                                        placeholder="Pair"
                                        :options="selectSymbols"
                                        v-model="formState.symbol"
                                        searchable
                                        innerHint="Search pair..."
                                    ></TuSelect
                                ></UFormGroup>
                                <UFormGroup label="Interval">
                                     <TuSelect
                                placeholder="Interval"
                                :options="intervals"
                                v-model="formState.interval"
                                required
                            />
                                </UFormGroup>
                           
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
const initRes = { data: [] };
const res = ref<IObj>(initRes);
const {setStrategies} = appStore
const { strategies, platforms } = storeToRefs(appStore);
const msg = ref<IObj>({}),
    paramsAreaRef = ref<any>();

const intervals = [1, 5, 15, 30, 60].map((e) => ({ label: `${e}m`, value: e }));
const margins = [1, 2, 3, 4, 5].map((e) => ({ label: `x${e}`, value: e }));

const formState = reactive<IObj>({
    interval: 15,
    offline: true,
    platform: 0,
    symbol: ["SOL", "USDT"].toString(),
    date: {
        start: "2024-06-15 00:00:00",
        end: "2024-10-28 23:59:00",
    },
});

const getData = (ts: string) => res.value.data[ts];


const onBacktest = (data: any) => {
    console.log("ON BACKTEST");
    if (data.data) {
        res.value = data;
        console.log(data.data);
        msg.value = {};
    } else if (data.err) {
        msg.value = { msg: data.err, err: true };
    } else {
        console.log(data);
        msg.value = { msg: data };
    }
};
onMounted(() => {
    socket.on("test-candles", onBacktest);
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
            symbol: formState.symbol.split(","),
            interval: formState.interval,
            ...formState.date,
        };
        delete fd["date"];
        fd = { ...fd, start: parseDate(fd.start), end: parseDate(fd.end) };
        console.log(fd);
        res.value = initRes;
        socket.emit("test-candles", fd);
    } catch (e) {
        console.log(e);
    }
};

const onCtrlBtnClick = (e: any) => {
    const paramsArea = paramsAreaRef.value;
    $(paramsArea!).toggleClass("open");
};

onMounted(()=>{
    socket.on('strategies', ({data, err})=>{
            if (err) {console.log(err); return}
            setStrategies(data)
            console.log("GOT THE STRATEGIES");
        })
})
</script>
