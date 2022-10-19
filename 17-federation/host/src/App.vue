<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from "./components/HelloWorld.vue";
import { defineAsyncComponent } from "vue";
// 导入远程模块
import RemoteApp from "remote_app/App";
// 工具函数
import { add } from "remote_app/utils";

// 异步组件
const AsyncRemoteButton = defineAsyncComponent(
  () => import("remote_app/Button")
);

const data: number = add(1, 2);
</script>

<template>
  <div>
    <a href="https://vitejs.dev"
       target="_blank">
      <img src="/vite.svg"
           class="logo"
           alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/"
       target="_blank">
      <img src="./assets/vue.svg"
           class="logo vue"
           alt="Vue logo" />
    </a>
  </div>
  <RemoteApp />
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <AsyncRemoteButton />
  <p>应用 2 工具函数计算结果: 1 + 2 = {{ data }}</p>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
