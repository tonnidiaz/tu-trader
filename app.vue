<template>
    <Html lang="en" class="dark" data-theme="">
         <TMeta/>
         
         <NuxtLayout>
 
             <NuxtPage></NuxtPage>
             <div id="ctx-overlay"></div>
         </NuxtLayout> 
     </Html>
 </template>
 <script setup lang="ts">
  import "@/src/styles/page-progress.css";
 import "@/src/styles/styles.scss";
 import "@/src/styles/styles2.scss";
 import "@/src/styles/daisy.scss";

 //import "@/src/assets/pace-1.2.4/pace.js"

 useHead({
    script: [{src: '/assets/pace-1.2.4/pace.min.js'}]
 })
 </script>
  