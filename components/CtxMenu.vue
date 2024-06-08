<template>
    <div>
        <div class="toggler pointer" @click="toggleMenu">
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
const menuRef = ref<any>(), menuSkeleton = ref<any>();

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

    let _menu: HTMLDivElement = menuSkeleton.value!;
    const size = { w: $(_menu).width()!, h: $(_menu).height()! };
    const { clientX, clientY } = e;
    let _pos = { x: clientX, y: clientY };
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

    (x.value = (_pos.x / window.innerWidth) * 100),
        (y.value = (_pos.y / window.innerHeight) * 100),
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
