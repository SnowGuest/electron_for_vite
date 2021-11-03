<template>
    <Menu win-name="win" :menu-option="['close', 'maxMize', 'minMize']"></Menu>
    <router-view></router-view>
</template>

<script lang="ts" setup>
import Menu from "@/components/header.vue";
</script>

<style lang="less">
#app {
  display: flex;
  flex-direction: column;
  background: #ffffff;
}
</style>
