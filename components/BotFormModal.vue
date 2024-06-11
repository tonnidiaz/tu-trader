<template>
    <UModal>
        <UCard>
            <template #header>
                <h3>{{ mode }} bot</h3>
            </template>
            <UForm @submit="handleSubmit" :state="formState">
                <UFormGroup label="Bot name">
                    <UInput
                        v-model="formState.name"
                        required
                        placeholder="Enter bot name..."
                    />
                </UFormGroup>
                <div class="flex gap-2 form-group">
                    <UFormGroup>
                        <TuSelect
                            v-model="formState.uname"
                            class="w-full"
                            searchable
                            innerHint="Search pair..."
                            placeholder="Pair"
                            :options="selectSymbols"
                        />
                    </UFormGroup>
                </div> 
                <UFormGroup class="mt-3">
                    <UButton type="submit" label="Submit" />
                </UFormGroup>
            </UForm>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import type { ISelectItem } from "~/utils/interfaces";
import TuSelect from "./TuSelect.vue";


const props = withDefaults(
    defineProps<{ mode?: "Create" | "Edit"; bot?: IObj }>(),
    {
        mode: "Create",
    }
);

const formState = ref<IObj>({  });

const handleSubmit = () => {
    console.log(formState.value.symbol);
};
watchEffect(() => {
    if (props.bot) formState.value = {... formState.value, ...props.bot};
});
</script>
