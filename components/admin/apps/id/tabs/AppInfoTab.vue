<template>
    <div class="p-3">
        <div
            v-if="form"
            class="rounded-b-box rounded-tr-box relative overflow-x-auto"
        >
            <fieldset class="pd-15 border-card card fieldset shadow-lg">
                <legend>{{ app?.name }}</legend>
                <TuForm @submit="onFormSubmit" action="#">
                    <div class="form-control">
                        <label class="label" for="name">App name:</label>
                        <input
                            class="input input-md bordered border-neutral w-full bg-1"
                            name="name"
                            id="name"
                            v-model="form.name"
                            placeholder="Enter app name..."
                            required
                        />
                    </div>
                    <div class="form-control">
                        <label class="label" for="name">App ID:</label>
                        <input
                            class="input input-md bordered border-neutral w-full bg-1"
                            name="name"
                            id="name"
                            v-model="form.uid"
                            placeholder="e.g. com.example.app"
                            required
                        />
                    </div>
                    <div class="form-control">
                        <label for="description" class="label"
                            >App description:
                        </label>
                        <textarea
                            class="textarea textarea-md bordered border-neutral w-full bg-1"
                            name="description"
                            id="description"
                            v-model="form.description"
                            placeholder="Enter app description..."
                        />
                    </div>

                    <div class="flex my-2 gap-5px flex-wrap">
                        <div
                            class="form-control flex items-center"
                            v-for="(p, i) in Object.keys(platforms)"
                        >
                            <label class="label cursor-pointer" :for="p">
                                <input
                                    :id="p"
                                    class="checkbox checkbox-secondary checkbox-sm"
                                    type="checkbox"
                                    v-model="form.platforms"
                                    :value="p"
                                />
                                <span class="label-text"
                                    >&nbsp; {{ platforms[p].name }}
                                </span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-md btn-primary w-full">
                        Submit
                    </button>
                </TuForm>
            </fieldset>
        </div>
        <div class="p-6" v-else>
            <Loader class="relative" />
        </div>
    </div>
</template>
<script setup lang="ts">
import axios from "axios";
import { sleep } from "~/utils/funcs";

const props = defineProps({
    app: { type: Object },
});
const form = ref<{ [key: string]: any }>();

const onFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
        const res = await axios.post("/api/app/edit", form.value);
        console.log(res.data);
    } catch (e) {
        console.log(e);
        alert('Failed to update app!')
    }
};

onMounted(() => {
    form.value = props.app;
});
</script>
