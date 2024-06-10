<template>
    <div>
        <TMeta :title="`${username}'s bots - ${SITE}`" />
        <div class="p-5">
            <h1 class="text-xl text-gray-200">My bots</h1>
            <div class="mt-5">
                <div v-if="bots.length" class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                    <BotCard v-for="bot in bots"
                                    :bot="bot"
                                    :updateBot="updateBots"
                                />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from "~/src/stores/user";
import { useTuFetch } from "~/utils/api";

const userStore = useUserStore();
const { bots } = storeToRefs(userStore);

const route = useRoute();
const username = ref(route.params.username);
const newBotModalRef = ref<any>();

const { data, error } = await useTuFetch<any>(
    "/api/bots?user=" + username.value,
    {
        watch: [username],
    }
);
if (error.value) {
    console.log(error.value.statusCode);
    throw createError({
        statusCode: error.value?.statusCode,
        statusMessage: error.value.statusMessage,
    });
}

const updateBots = (bot: IObj) => {
    const _bots = [...bots.value];
    const botIndex = _bots.findIndex((el) => el._id == bot._id);
    _bots[botIndex] = bot;
    userStore.setBots(_bots);
};

onMounted(() => {
    userStore.setBots(data.value);
});
</script>
