<template>
    <Head>
            <Title>
                {{ title ?? _title }}
            </Title>
            <Meta name="description" :content="`${desc}\n${_description}`"/>
            <Meta property="og:type" content="website"/>
            <Meta property="og:url" :content="url ?? ROOT"/>
            <Meta property="og:title" :content="title ?? _title"/>
            <Meta property="og:description" :content="`${desc}\n${_description}`"/>
            <Meta property="og:image" :content="src ?? ROOT + '/assets/images/meta/home.png'"/>

            <Meta property="twitter:card" content="summary_large_image"/>
            <Meta property="twitter:url" :content="url ?? ROOT"/>
            <Meta property="twitter:title" :content="title ?? _title"/>
            <Meta property="twitter:description" :content="`${desc}\n${_description}`"/>
            <Meta property="twitter:image" :content="src ?? ROOT + '/assets/images/meta/home.png'"/>

            <Meta name="author" :content="DEVELOPER"/>
            <Meta name="publisher" :content="DEVELOPER"/>
            <Meta name="copyright" :content="SITE"/>

        
    </Head>
  </template>

  <script setup lang="ts">
import { SITE, DEVELOPER , SITE_SLOGAN} from "../utils/constants";

const {ROOT} = useRuntimeConfig().public

    const _title = `${SITE} - ${SITE_SLOGAN}`;
  const _description = `${SITE} is a Tunedbass site`;
  
  defineProps({
    title: { type: String },
    src: { type: String },
    desc: { type: String, default: "" },
    url: { type: String },
    keywords: { type: String, default: "" },
  })

useHead({
    script: [

        // Google Analyticts 
        {
            async: true,
            src: "https://www.googletagmanager.com/gtag/js?id=G-NMN9VWLJ6B"
        },
        {
            innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NMN9VWLJ6B');
            `
        }
    ]
})

  </script>
