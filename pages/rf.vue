<template>
    <div class="p-4">
        <h1>Hello</h1>
        <TuChart :data="testCandles.map(el=>({time: new Date(el.ts).getTime() / 1000, open: el.o, high: el.h, low: el.l, close: el.c}))"/>
    </div>
</template>