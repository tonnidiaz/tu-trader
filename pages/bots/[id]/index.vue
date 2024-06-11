<template>

    <div v-if="_bot">
        <TMeta :title="`${_bot.name} - ${SITE}`"/>
        <fieldset class="formset border-card border-1 p-2 md:p-4">
                <legend>
                    <h1 class="text-gray-200">{{_bot.name}}</h1>
                </legend>
                <div class="flex gap-4 justify-center items-center">
                    <span class="fw-8">
                        {{_bot.base}}/{{_bot.ccy}}
                    </span>
                        <UBadge :label="_bot.active ? 'Active' : 'Paused'"  :color="_bot.active ? 'primary' : 'yellow'" class="badge badge-success"/>
                </div>
                <div class="flex gap-4 justify-center mt-3 items-center">
                    <UButton
                        @click="(e : any)=> activateBot(e.currentTarget, _bot!, (val: any)=> _bot = val)"
                        class="btn btn-neutral btn-sm"
                        color="gray"
                    >
                        {{_bot.active ? "Deactivate" : "Activate"}}
                    </UButton>
                    <UButton
                        class="btn btn-sm btn-rounded btn-neutral"
                        title="Modify"
                        color="gray"
                        @click="(_) =>{/*  botModal?.showModal() */}"
                    >
                        <span>
                            <i class="fi fi-br-pencil"></i>
                        </span>
                    </UButton>
                </div>
                </fieldset>
                <BotFormModal mode="Edit" :bot="{
                    name: _bot.name,
                    desc: _bot.desc,
                    demo: _bot.demo,
                    id: _bot._id,
                    symbol: [_bot.base, _bot.ccy]
                     /* pair: selectSymbols.find(
                        (el) =>
                            el.value.toString() ==
                            [_bot.base, _bot.ccy].toString()
                    ),
                   strategy: toSelectStrategies(appStore.strategies).find(
                        (el) => el.value == _bot.strategy
                    ),
                    interval: selectIntervals.find(
                        (el) => el.value == _bot.interval
                    ), */
                }" v-model="modalOpen"/>
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
const _bot = ref<IObj>(), modalOpen = ref(true),
    orders = ref<IObj[]>([]),
    orderType = ref<EOrder>(EOrder.all);

const route = useRoute();
const id = ref(route.params.id);
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
            ? el.prifit > 0
            : orderType.value == EOrder.lose
            ? el.profit < 0
            : true
    );
};
onMounted(() => {
    const bot = data.value;
    _bot.value = bot;
    //setOrders(bot.orders);
    if (bot.orders) filterOrders(bot.orders);
});

watch(orderType, (val) => {
    filterOrders(data.value.orders);
});
</script>
