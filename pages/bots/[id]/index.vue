<template>
    <div v-if="_bot">
        <TMeta :title="`${_bot.name} - ${SITE}`" />
        <fieldset class="fieldset w-full sm:w-96 m-auto border-card border-1 p-2 md:p-4">
            <legend>
                <h1 class="text-gray-200">{{ _bot.name }}</h1>
            </legend>
            <div class="flex gap-4 justify-center items-center">
                <span class="fw-8"> {{ _bot.base }}/{{ _bot.ccy }} </span>
                <UBadge
                    :label="_bot.active ? 'Active' : 'Paused'"
                    :color="_bot.active ? 'primary' : 'yellow'"
                    class="badge badge-success"
                />
            </div>
            <div class="flex gap-4 justify-center mt-3 items-center">
                <UButton
                    @click="(e : any)=> activateBot(e.currentTarget, _bot!, (val: any)=> _bot = val)"
                    class="btn btn-neutral btn-sm"
                    color="gray"
                >
                    {{ _bot.active ? "Deactivate" : "Activate" }}
                </UButton>
                <UButton
                    class="btn btn-sm btn-rounded btn-neutral"
                    title="Modify"
                    color="gray"
                    @click="modalOpen = true"
                >
                    <span>
                        <i class="fi fi-br-pencil"></i>
                    </span>
                </UButton>
            </div>
            <div class="my-3">
                <TuStats
                    class="items-center justify-center gap-2"
                    :stats="[
                        {title: 'L:', subtitle: _bot.orders?.filter((el: any) => el.profit < 0)
                                    ?.length ?? 0, click: ()=> orderType = EOrder.lose, classes: orderType == EOrder.lose ? 'text-primary' : ''},
                        {title: 'Total orders:', subtitle: _bot.orders
                                    ?.length ?? 0, click: ()=> orderType = EOrder.all, classes: orderType == EOrder.all ? 'text-primary' : ''},
                        {title: 'W:', subtitle: _bot.orders?.filter((el: any) => el.profit > 0)
                                    ?.length ?? 0, click: ()=> orderType = EOrder.win, classes: orderType == EOrder.win ? 'text-primary' : ''},
                                    ]"
                >
                </TuStats>
            </div>
            <div class="flex flex-col gap-2">
                <UAccordion :items="moreInfo">
                    <template #item>
                        <div class="flex flex-col gap-2 items-center">
                            <UFormGroup>
                                <UCheckbox
                                    label="Demo mode"
                                    disabled
                                    :modelValue="_bot.demo"
                                />
                            </UFormGroup>
                            <TuStats
                                :stats="[
                                    {
                                        title: 'Start amount',
                                        subtitle: _bot.start_amt ?? 0,
                                    },
                                    {
                                        title: 'Current amount',
                                        subtitle: (_bot.orders
                                            ? _bot.orders[
                                                  _bot.orders.length - 1
                                              ]?.ccy_amt ??0
                                            : 0
                                        ).toFixed(2),
                                    },
                                ]"
                            />
                            <TuStats
                                :stats="[
                                    {
                                        title: 'Interval',
                                        subtitle: `${_bot.interval}m`,
                                    },
                                    {
                                        title: 'Strategy',
                                        subtitle:
                                            strategies[_bot.strategy - 1]
                                                ?.name ?? 'null',
                                    },
                                ]"
                            />

                            <div class="mt-1">
                                <UTextarea
                                    placeholder="Bot description"
                                    disabled
                                    :model-value="_bot.desc"
                                />
                            </div>
                        </div>
                    </template>
                </UAccordion>
                <UAccordion multiple :items="[{ label: 'Orders' }]">
                    <template #item>
                        <div class="flex flex-col gap-2 items-center pl-4">
                            <UAccordion
                                v-for="(order, i) in orders ?? []"
                                :items="[
                                    {
                                        label: `${i + 1}. ${order.base}/${
                                            order.ccy
                                        } \t [${order.side}]`,
                                    },
                                ]"
                            >
                                <template #item>
                                    <div class="flex flex-col gap-3 font-monospace all">
                                        <div class="">
                                            <p class="flex justify-between">
                                                <span class="text-heading fw-6"
                                                    >Buy ID:</span
                                                >
                                                <span>{{
                                                    order.buy_order_id
                                                }}</span>
                                            </p>
                                            <p class="flex justify-between">
                                                <span class="text-heading fw-6"
                                                    >Sell ID:</span
                                                >
                                                <span>{{
                                                    order.order_id.length
                                                        ? order.order_id
                                                        : "-- -- --"
                                                }}</span>
                                            </p>
                                            <p class="flex justify-between mt-3"><span class="fw-6 text-heading">ID:</span><span>{{ order._id }}</span></p>
                                            <p class="flex justify-between mt-3"><span class="fw-6 text-heading">Profit:</span><span>{{ order.ccy }} {{ order.profit }}</span></p>
                                        </div>
                                            <div>
                                                <h6 class="fw-6">Entry time</h6>
                                                <div
                                                    class="flex justify-between ml-3"
                                                >
                                                    <span
                                                        class="text-heading fw-6"
                                                        >In:</span
                                                    ><span>{{ order.buy_timestamp?.i ? order.buy_timestamp?.i.slice(0, 16) : '-- -- --'
                                                    }}</span>
                                                </div>
                                                <div
                                                    class="flex justify-between ml-3"
                                                >
                                                    <span
                                                        class="text-heading fw-6"
                                                        >Out:</span
                                                    ><span>{{ order.buy_timestamp?.o ?order.buy_timestamp?.o.slice(0, 16) : '-- -- --'
                                                    }}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h6 class="fw-6">Exit time</h6>
                                                <div
                                                    class="flex justify-between ml-3"
                                                >
                                                    <span
                                                        class="text-heading fw-6"
                                                        >In:</span
                                                    ><span>{{
                                                      order.sell_timestamp?.i ? order.sell_timestamp?.i.slice(0, 16) : '-- -- --'
                                                    }}</span>
                                                </div>
                                                <div
                                                    class="flex justify-between ml-3"
                                                >
                                                    <span
                                                        class="text-heading fw-6"
                                                        >Out:</span
                                                    ><span>{{ order.sell_timestamp?.o  ?
                                                            order.sell_timestamp.o
                                                            .slice(0, 16) : '-- -- --'
                                                    }}</span>
                                                </div>
                                            </div>
                                            <div class=""><p class="flex justify-between"><span class="fw-6 text-heading">Entry amount:</span><span>{{ order.ccy }} {{ order.ccy_amt }}</span></p>
                                            <p class="flex justify-between"><span class="fw-6 text-heading">Exit amount:</span><span>{{ order.ccy }} {{ order.new_ccy_amt }}</span></p>
                                           </div>
                                             <div class="my-1">
                                                <p class=" flex justify-between"><span class="fw-6 text-heading">Entry price:</span><span>{{ order.ccy }} {{ order.buy_price ?? '-- -- --' }}</span></p>
                                            <p class="flex justify-between"><span class="fw-6 text-heading">Exit price:</span><span>{{ order.ccy }} {{ order.sell_price ?? '-- -- --' }}</span></p>
                                           
                                            </div>
                                             <p class="flex justify-between"><span class="fw-6 text-heading">Base amount:</span><span>{{ order.base }} {{ order.base_amt }}</span></p>
                                            <p class="flex justify-between"><span class="fw-6 text-heading">Buy fee:</span><span>{{ order.base }} {{ order.buy_fee }}</span></p>
                                            <p class="flex justify-between"><span class="fw-6 text-heading">Sell fee:</span><span>{{ order.ccy }} {{ order.sell_fee }}</span></p>
                                        <div class="grid grid-cols-2"></div>
                                    </div>
                                </template>
                            </UAccordion>
                        </div>
                    </template>
                </UAccordion>
            </div>
        </fieldset>
        <BotFormModal
            mode="Edit"
            :bot="{
                name: _bot.name,
                desc: _bot.desc,
                demo: _bot.demo,
                id: _bot._id,
                symbol: [_bot.base, _bot.ccy].toString(),
                interval: _bot.interval, strategy: _bot.strategy, start_amt: _bot.start_amt }"
            v-model="modalOpen" :onDone="(val)=>_bot = val"
        />
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from "~/src/stores/app";

const { strategies } = storeToRefs(useAppStore());

enum EOrder {
    all,
    win,
    lose,
}
const _bot = ref<IObj>(),
    modalOpen = ref(false),
    orders = ref<IObj[]>([]),
    orderType = ref<EOrder>(EOrder.all);

const route = useRoute();
const id = ref(route.params.id);

const moreInfo = [{ label: "More info", content: "Lorem Ipsum" }];

const { data, error } = await useTuFetch<any>("/api/bots/" + id.value, {
    watch: [id],
});
if (error.value) {
    console.log(error.value.statusCode);
    throw createError({
        statusCode: error.value?.statusCode,
        statusMessage: error.value.statusMessage,
    });
}

const filterOrders = (val: any[]) => {
    orders.value = val.filter((el: IObj) =>
        orderType.value == EOrder.win
            ? el.profit > 0
            : orderType.value == EOrder.lose
            ? el.profit < 0
            : true
    );
    console.log(orders.value?.length);
};
onMounted(() => {
    const bot = data.value;
    _bot.value = bot;
    //setOrders(bot.orders);
    if (bot.orders) filterOrders(bot.orders);
});

watch(orderType, (val) => {
    filterOrders(_bot.value?.orders ?? []);
});
</script>
