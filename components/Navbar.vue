<template>
       <div class="navbar flex -tems-center justify-between p-4 w-full">
            <div class="navbar-start">
                <div class="dropdown hidden">
                    <label tabindex="0" class="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                    </label>
                    <ul
                        tabindex="0"
                        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li><a>Homepage</a></li>
                        <li>
                        <NuxtLink to="/@enid">Enid</NuxtLink>
                    </li>
                        <li>
                        <NuxtLink to="/ce">CE</NuxtLink>
                    </li>
      
                    </ul>
                </div>
            </div>
            <div class="navbar-center flex">
                <a href="/" class="btn btn-ghost normal-case text-xl">{{SITE}}</a>
            </div>
            <div class="navbar-end flex">
             
            <UButton :ui="{rounded: 'rounded-full'}" color="black" tabindex="0" variant="ghost">
                    <i class="fi fi-rr-search"></i>
                </UButton>
                <UButton :ui="{rounded: 'rounded-full'}" variant="ghost" color="black">
                    <div class="indicator">
                        <span><i class="fi fi-rr-bell"></i></span>
                        <span
                            class="badge badge-xs badge-primary indicator-item"
                        ></span>
                    </div>
                </UButton>
                       <CtxMenu v-if="user" :open="menuOpen" :set-is-open="(val : boolean) =>menuOpen = val">
                        <template v-slot:toggler>
                        <div class="avatar btn btn-sm btn-circle ml-4">
                            <div class="w-25px h-25px rounded-full ring text-center"> <span class="text-xl fw-7">T</span></div>
                        </div>
                     </template>
                     <template v-slot:children>
                        <li> <span>Item 1</span></li>
                        <li> <span>Item 1</span></li>
                        <li> <span>Item 1</span></li>
             
                    </template>
                        
                    </CtxMenu>
                    <NuxtLink v-else
                        :to="`/auth/login?red=${$route.fullPath}`"
                        class="btn btn-sm btn-outline btn-primary"
                    >
                        Login
                    </NuxtLink>
            </div>
        </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/src/stores/user';

    const menuOpen = ref(false)
    const { user } = storeToRefs(useUserStore())
</script>