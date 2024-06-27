<template>
    <aside>
        <ul class="menu flex flex-col sm:gap-5 sidebar">
            <menu-item
            title="Home"
                inner-class="justify-center"
                icon="fi fi-rr-house-window"
                to="/"
            />
            
            <menu-item title="Backtest"
                
                inner-class="justify-center"
                icon="fi fi-rr-blood-test-tube-alt"
                to="/backtest"
            ></menu-item>
            <menu-item title="Candles test"
                
                inner-class="justify-center"
                icon="fi fi-rr-chart-candlestick"
                to="/test/candles"
            ></menu-item>
            <menu-item title="Chart test"
                
                inner-class="justify-center"
                icon="fi fi-r-chart-candlestick"
                to="/test/chart"
            ></menu-item>
            <!--    <li class="tooltip tooltip-right" data-tip="Contact us">
       <NuxtLink to="/contact">
        <i class="fi fi-rr-envelope"></i>
       </NuxtLink>
   </li>
   <li class="tooltip tooltip-right" data-tip="About us">
       <NuxtLink to="/about">
        <i class="fi fi-rr-info"></i>
       </NuxtLink>
   </li> -->
        </ul>
    </aside>
</template>

<script setup lang="ts"></script>
