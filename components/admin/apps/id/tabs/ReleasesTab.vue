<template>
    <div class="p-3">
        <div class="rounded-b-box rounded-tr-box relative overflow-x-auto">
            <fieldset class="pd-15 border-card card fieldset shadow-lg">
                <legend class="flex items-center justify-between w-full">
                    <span>Releases</span>
                    <label
                        for="add-release-modal"
                        class="btn btn-ghost fs-20 rounded-full"
                    >
                        <i class="fi fi-rr-add"></i>
                    </label>
                </legend>
                <div class="releases my-0">
                    <div v-if="releases.length">
 <div  v-for="rel in releases.reverse()"
                        class="collapse collapse-arrow  border border-card bg-neutral my-2"
                    >  <input type="checkbox" /> 

                        <div class="collapse-title text-xl font-medium fs-18 flex gap-3 items-center">
                       <span>v{{rel.version}} <span v-if="rel.is_lts" class="badge badge-sm badge-success">LTS</span> </span>   
                       <span class="text-primary">{{rel.size}} MB</span>
                        </div>
                        <div class="collapse-content">
                            <p class="badge badge-lg badge-accent fs-12">
                               {{new Date(rel.date_created).toLocaleDateString()}}
                            </p>
                            <div class="mt-2">
                                <h2 class="font-bold fs-18">Release notes</h2>
                                <ul class="mt-3 list-bullet">
                                    <li  v-for="(n, i) in rel.notes">{{n}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div v-else><Loader/></div>
                   
                </div>
                <Teleport to="body">
                    <div class="release-modal">
                        <input
                            type="checkbox"
                            id="add-release-modal"
                            class="modal-toggle"
                        />
                        <dialog id="add_rel_modal" class="modal modal-bottom sm:modal-middle">
                            <div class="modal-box p-2 sm:px-4">
                                <fieldset class="p-2 sm:p-4 rounded-xl card-border">
                                    <legend class="text-lg font-bold px-2">
                                        New Release
                                    </legend>
                                    <TuForm @submit="handleFormSubmit">
                                        <div class="grid grid-cols-3 gap-2">
                                            <div
                                                class="form-control col-span-2"
                                            >
                                                <label
                                                    for="version"
                                                    class="label cursor-pointer hidden"
                                                    >Version:</label
                                                >
                                                <input
                                                    required
                                                    v-model="form.version"
                                                    id="version"
                                                    placeholder="Enter version..."
                                                    type="text"
                                                    class="input input-md input-bordered"
                                                />
                                            </div>
                                            <div class="form-">
                                                <label
                                                    for="is_lts"
                                                    class="label"
                                                >
                                                    <span class="check-label">
                                                        Latest?
                                                    </span>
                                                    <input
                                                        v-model="form.is_lts"
                                                        type="checkbox"
                                                        name="is_lts"
                                                        id="is_lts"
                                                        class="checkbox checkbox-md checkbox-primary"
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div
                                            class="grid grid-cols-1 md:grid-cols-3 gap-2"
                                        >
                                            <div
                                                class="form-control md:col-span-2"
                                            >
                                                <label
                                                    for="file"
                                                    class="label cursor-pointer"
                                                    >File URL:</label
                                                >
                                                <input
                                                    required
                                                    v-model="form.file"
                                                    id="file"
                                                    placeholder="Enter file url..."
                                                    type="url"
                                                    class="input input-md input-bordered"
                                                />
                                            </div>
                                            <div class="form-control">
                                                <label
                                                    for="size"
                                                    class="label cursor-pointer"
                                                    >File size (in MB):</label
                                                >
                                                <input
                                                    required
                                                    v-model="form.size"
                                                    id="size"
                                                    placeholder="e.g. 12.34"
                                                    type="text"
                                                    class="w-full input input-md input-bordered"
                                                />
                                            </div>
                                        </div>

                                        <div class="form-control">
                                            <label
                                                for="notes"
                                                class="label cursor-pointer"
                                                >Release notes:</label
                                            >
                                            <textarea
                                                v-model="form.notes"
                                                id="notes"
                                                required
                                                placeholder="Enter release notes (Note per line)..."
                                                class="textarea textarea-md textarea-bordered"
                                            />
                                        </div>
                                        <div class="form-control mt-3">
                                            <button
                                                type="submit"
                                                class="btn btn-primary btn-md w-full"
                                            >
                                                Add release
                                            </button>
                                        </div>
                                    </TuForm>
                                </fieldset>
                            </div>
                            <label
                                class="modal-backdrop"
                                for="add-release-modal"
                                >Close</label
                            >
                        </dialog>
                    </div>
                </Teleport>
            </fieldset>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";

const form = ref<{ [key: string]: any }>({
    is_lts: true,
    notes: "Note 1\nNote2\nNote 3",
});
const releases = ref<any[]>([])
const props = defineProps({
    app: { type: Object, required: true },
});
const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    const data = { ...form.value, notes: form.value.notes.split("\n") };
    try {
        const res = await axios.request({
            url: `/api/app/release?id=${props.app._id}&action=add`,
            method: "post",
            data,
        });
        releases.value = res.data.releases
        hideModal()
    } catch (e) {
        console.log(e);
    }
};

onMounted(()=>{
    if (releases.value.length == 0){
         releases.value = props.app.releases
    }
   
})
</script>


<style lang="scss">
.list-bullet{
    list-style-type: circle;
    li{
        margin-left: 1.6rem;
    }
}
</style>