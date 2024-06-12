<template>
    <div>
        <div ref="togglerRef" class="toggler pointer" @click="toggleMenu">
            <slot name="toggler" />
        </div>
        <ctx-body ref="menuRef" class=" hidden block" v-if="!isOpen" ><slot name="children"/></ctx-body>
        <Teleport v-else to="#ctx-overlay">
            <CtxBody
                    :style="`top: ${y ?? 0}%;left: ${x ?? 0}%`" ref="menuRef"><slot name="children"/></CtxBody>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import $ from "jquery";
import CtxBody from "./CtxBody.vue";
const x = ref(0),
    y = ref(0);

const menuRef = ref<any>(), menuSkeleton = ref<any>(), togglerRef = ref<HTMLDivElement>();

const props = defineProps({
  modelValue: Boolean
});
const emits = defineEmits(["update:model-value"])

const isOpen = computed({
    get: ()=> props.modelValue, set: (val)=> emits("update:model-value", val)
})

const toggleMenu = (e: any) => {
    
    e.preventDefault();
    e.stopPropagation();
    
    const toggler: HTMLDivElement = togglerRef.value!
    let _menu: HTMLDivElement = menuSkeleton.value!;
    const size = { w: $(_menu).width()!, h: $(_menu).height()! };
    const togglerRect = toggler.getBoundingClientRect()
    const winSize = {w: window.innerWidth, h: window.innerHeight}

    const clientX = togglerRect.left//winSize.w - (togglerSize.w ?? 0 / 2);
    const clientY = togglerRect.top //winSize.h - (togglerSize.h ?? 0 / 2);//{ clientX, clientY } = e;
    let _pos = { x: clientX + togglerRect.width / 2, y: clientY + togglerRect.height / 2 };
    const rightPos = clientX + size.w;
    const bottomPos = clientY + size.h;

    let deltaW = window.innerWidth - clientX;
    let deltaH = window.innerHeight - clientY;
    if (rightPos > window.innerWidth) {
        let newLeft = window.innerWidth - size.w - deltaW;
        _pos.x = newLeft;
    }

    if (bottomPos > window.innerHeight) {
        let newTop = window.innerHeight - size.h - deltaH;
        _pos.y = newTop;
    }

    x.value = _pos.x / window.innerWidth * 100
    y.value = _pos.y / window.innerHeight * 100
    isOpen.value = true
};

const route = useRoute()
const pth = ref(route.fullPath)
const updateListener = () => {
    document.body.addEventListener("mouseup", onDocClick);
};

const onDocClick = (e: any) => {
    const _menu = menuSkeleton.value;
    if (_menu && !_menu.contains(e.target)) {
        isOpen.value = false
    }
};

onMounted(()=>{
    updateListener()
})

watch(menuRef, (v)=>{
    if (v)
    menuSkeleton.value = v.menu;
})

watch(()=>route.fullPath, ()=>{
    isOpen.value = false
}, {deep: true, immediate: true})

</script>
