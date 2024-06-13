<template>
    <NuxtLink
        :to="`/bots/${bot._id}`"
        class="border-1 border-card bg-base-200 p-4 br-10 bot-card"
    >
        <div class="flex gap- justify-between">
            <div class="flex gap-4 overflow-hidden">
                <div>
                    <UAvatar
                        :chip-color="bot.active ? 'primary' : 'yellow'"
                        borderColor="neutral"
                        shape="circle"
                        innerclass="ring relative w-35px h-35px flex items-center justify-center"
                    >
                        <span>
                            <i class="fi fi-br-user-robot"></i>
                        </span>
                    </UAvatar>
                </div>
                <div class="overflow-hidden">
                    <h4 class="text-gray-200 fw-6 fs-14">{{ bot.name }}</h4>
                    <h6 class="fs-11 fw-6 text-gray-400">
                        {{ bot.base }}/{{ bot.ccy }}
                    </h6>
                    <h6 class="fs-11 fw-6 text-gray-200">
                        {{ bot.orders?.length ?? 0}} orders
                    </h6>
                    <div class="mt-1 overflow-hidden">
                        <p
                            class="fs-13"
                            style="
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            "
                        >
                            {{ bot.desc }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="">
                <CtxMenu v-model="menuOpen"
                >
                    <template v-slot:toggler>
                        <UButton size="sm" :ui="{rounded: 'rounded-full'}" variant="ghost" color="gray"
                            ><span class="fs-16 relative top-1">
                                <i class="fi fi-br-menu-dots-vertical"></i> </span
                        ></UButton>
                    </template>
                    <template v-slot:children>
                        <li @click="activateBot(($event.target as any).parentElement, bot, updateBot)"><span>{{ bot.active ? 'Deactivate' : 'Activate' }}</span></li>
                        <li :class="!bot.orders.length ? 'disabled' : ''"  @click="clearBotOrders(($event.target as any).parentElement, bot, updateBot)"><span>Clear orders</span></li>
                    </template>
                </CtxMenu>
            </div>
        </div>
    </NuxtLink>
</template>
<script setup lang="ts">
const menuOpen = ref(false);
defineProps({
    bot: { type: Object, required: true },
    updateBot: { type: Function },
});
</script>
