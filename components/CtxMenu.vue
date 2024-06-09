<template>
    <div>
        <div ref="togglerRef" class="toggler pointer" @click="toggleMenu">
            <slot name="toggler" />
        </div>
        <ctx-body ref="menuRef" class=" hidden block" v-if="!open" ><slot name="children"/></ctx-body>
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
    y = ref(0),
    isOpen = ref(false);
const menuRef = ref<any>(), menuSkeleton = ref<any>(), togglerRef = ref<HTMLDivElement>();

interface ICtxMenuItem {
    onTap: (e: any) => Promise<boolean> | void;
    disabled?: boolean;
}
const props = defineProps({
    open: { type: Boolean },
    setIsOpen: { type: Function, required: true },
});

const toggleMenu = (e: any) => {
    
    e.preventDefault();
    e.stopPropagation();
    
    const toggler: HTMLDivElement = togglerRef.value!
    console.log(toggler);
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
    props.setIsOpen(true);
};

const updateListener = () => {
    document.body.addEventListener("mouseup", onDocClick);
};

const onDocClick = (e: any) => {
    const _menu = menuSkeleton.value;
    if (_menu && !_menu.contains(e.target)) {
        props.setIsOpen(false);
    }
};

onMounted(()=>{
    updateListener()
})

watch(menuRef, (v)=>{
    if (v)
    menuSkeleton.value = v.menu;
})
</script>
