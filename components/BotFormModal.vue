<template>
    <UModal v-model="modalOpen">
        <UCard>
            <template #header>
                <h3>{{ mode }} bot</h3>
            </template>
            <UForm
                class="flex flex-col gap-2"
                @submit="handleSubmit"
                :state="formState"
            >
                <div class="grid sm:grid-cols-2 gap-3 items-end">
                    <UFormGroup label="Bot name">
                        <UInput
                            v-model="formState.name"
                            required
                            placeholder="Enter bot name..."
                        />
                    </UFormGroup>
                    <UFormGroup>
                        <TuSelect
                            v-model="formState.symbol"
                            class="w-full"
                            searchable
                            innerHint="Search pair..."
                            placeholder="Symbol"
                            required
                            :options="
                                selectSymbols.map((el) => ({
                                    ...el,
                                    value: el.value.toString(),
                                }))
                            "
                        />
                    </UFormGroup>
                </div>
                <UFormGroup label="Start amount">
                    <UInput
                        required
                        v-model="formState.start_amt"
                        placeholder="Enter start amount..."
                        type="number"
                        step="any"
                    />
                </UFormGroup>
                <div class="grid grid-cols-2 gap-3">
                    <TuSelect
                        required
                        :options="
                            platforms.map((el) => ({
                                label: el.toUpperCase(),
                                value: el.toLocaleLowerCase(),
                            }))
                        "
                        placeholder="Platform"
                        v-model="formState.platform"
                    />
                    <TuSelect
                        required
                        :options="
                            ['Market', 'Limit'].map((el) => ({
                                label: el,
                                value: el,
                            }))
                        "
                        placeholder="Order type"
                        v-model="formState.order_type"
                    />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <TuSelect
                        required
                        :options="toSelectStrategies(strategies)"
                        v-model="formState.strategy"
                        searchable
                        placeholder="Strategy"
                        innerHint="Search strategy..."
                    />
                    <TuSelect
                        required
                        :options="selectIntervals"
                        v-model="formState.interval"
                        placeholder="Interval"
                    />
                </div>
                <UFormGroup label="Description">
                    <UTextarea
                        v-model="formState.desc"
                        placeholder="Bot description..."
                    />
                </UFormGroup>
                <div class="flex items-center flex-row justify- gap-5">
                    <UCheckbox label="Demo" v-model="formState.demo" />
                </div>
                <p v-if="err.length" class="text-center text-xs text-red-400">
                    {{ err?.replace("tuned:", "") }}
                </p>
                <UFormGroup class="mt-3">
                    <UButton
                        :loading="btnLoading"
                        type="submit"
                        label="Submit"
                    />
                </UFormGroup>
            </UForm>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import type { ISelectItem } from "~/utils/interfaces";
import TuSelect from "./TuSelect.vue";
import { useAppStore } from "~/src/stores/app";
import { selectIntervals } from "~/utils/constants";
import { useUserStore } from "~/src/stores/user";
const userStore = useUserStore();

const { strategies, platforms } = storeToRefs(useAppStore());

const props = withDefaults(
    defineProps<{
        mode?: "Create" | "Edit";
        modelValue: boolean;
        bot?: IObj;
        onDone?: (bot: IObj) => any;
    }>(),
    {
        mode: "Create",
    }
);

const emit = defineEmits(["update:modelValue"]);
const modalOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const formState = ref<IObj>({ demo: true, platform: "bybit" }),
    err = ref(""),
    setErr = (val: string) => (err.value = val);
const btnLoading = ref(false),
    setBtnLoading = (val: boolean) => (btnLoading.value = val);

const handleSubmit = async () => {
    try {
        setErr("");
        let data = {...formState.value};
        delete data.id;
        const { mode, bot, onDone } = props;
        console.log(data.symbol);
        data.symbol = data.symbol.split(",");
        data =
            mode == "Create"
                ? { ...data, user: userStore.user?.username }
                : { key: "multi", val: { ...data } };
        console.log(data);
        setBtnLoading(true);
        const url = mode == "Create" ? "/bots/create" : `/bots/${bot!.id}/edit`;

        const res = await localApi(true).post(url, data);
        onDone?.(res.data);
        setBtnLoading(false);
        modalOpen.value = false;
    } catch (e: any) {
        console.log(e);
        const _err =
            typeof e.response?.data == "string" &&
            e.response?.data?.startsWith("tuned:")
                ? e.response.data.replace("tuned:", "")
                : "Something went wrong";
        setErr(_err);
        setBtnLoading(false);
    }
};
watchEffect(() => {
    if (props.bot) formState.value = { ...formState.value, ...props.bot };
});
</script>
