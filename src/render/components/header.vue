<template>
  <header class="header">
    <nav class="drags">
      <ul class="menuLeft_List">
        <!--  -->
        <li
          v-if="props.menuOption?.includes('close')"
          @click="sendMain('close')"
          class="menuLeft_close"
        ></li>
        <!--  -->
        <li
          v-if="props.menuOption?.includes('minMize')"
          @click="sendMain('minMize')"
          class="menuLeft_minimize"
        ></li>
        <!-- -->
        <li
          v-if="props.menuOption?.includes('maxMize')"
          @click="sendMain('maxMize')"
          class="menuLeft_maximize"
        ></li>
      </ul>
      <nav class="menuRight">{{ title }}</nav>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import ipcRender from "@/uilts/ipcRender"
import type { IpcMainName } from "@/uilts/ipcRender"
import { ref } from "vue";
type MenuType = 'close' | 'maxMize' | 'minMize'
interface HeaderManuType {
  winName?: String
  menuOption?: Array<MenuType>
}
const props = defineProps<HeaderManuType>()
const title = ref<string>(document.title);
function sendMain(e: IpcMainName) {
  // 实例化ipcRender 对象
  const render = new ipcRender()
  
  render.onceCommand(e, 'send', { winName: props.winName })
}
</script>

<style lang="less" scoped>
.header {
  z-index: 999999999;
  background: #fff;
  height: 36px;
  width: 100%;
  padding: 5px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  .drags {
    height: 100%;
    user-select: none;
    -webkit-app-region: drag;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    position: relative;
    .menuRight {
      justify-self: center;
      margin: 0 auto;
    }
    .menuLeft_List {
      display: flex;
      margin-bottom: 0;
      align-items: center;
      column-gap: 8px;
      -webkit-app-region: no-drag;
      cursor: pointer;
      &:hover {
        .menuLeft_close::after,
        .menuLeft_close::before,
        .menuLeft_minimize::after,
        .menuLeft_minimize::before,
        .menuLeft_maximize::after,
        .menuLeft_maximize::before {
          display: block;
        }
      }
      li {
        border-radius: 50%;
        width: 16px;
        height: 16px;
        cursor: pointer;
        -webkit-app-region: no-drag;
      }
      .menuLeft_close {
        background: #ed6a5e;
        position: relative;

        &::after,
        &::before {
          content: "";
          position: absolute;
          background-color: #296017;
          width: 60%;
          height: 2px;
          border-radius: 20%;
          left: 20%;
          top: 45%;
          display: none;
        }
        &::before {
          transform: rotate(45deg);
        }
        &::after {
          transform: rotate(-45deg);
        }
      }
      .menuLeft_minimize {
        background: #f5bf4f;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60%;
          height: 2px;
          display: none;
          background-color: #296017;
          transform: translate(-50%, -50%);
        }
      }
      .menuLeft_maximize {
        background: #62c654;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background-color: #296017;
          display: none;
        }
        &::before {
          content: "";
          position: absolute;
          z-index: 2;
          transform: rotate(-45deg);
          width: 82%;
          top: 42%;
          left: 9%;
          height: 3px;
          display: none;
          background-color: #62c654;
        }
      }
    }
    * {
      user-select: none;
    }
  }
}
</style>