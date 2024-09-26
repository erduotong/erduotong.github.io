<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'

const startTime = new Date("2024-09-22T00:00:00+08:00") // 网站创建时间
// 计算网站运行时间
const time = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})
const calculateTime = () => {
  const now = new Date();
  const diff = now.getTime() - startTime.getTime();
  time.value.days = Math.floor(diff / (1000 * 60 * 60 * 24));
  time.value.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  time.value.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  time.value.seconds = Math.floor((diff % (1000 * 60)) / 1000);
}
calculateTime()
onMounted(() => {
  calculateTime();
  const interval = setInterval(calculateTime, 1000);
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<template>
  <footer class="footer-wrapper">
    <div class="footer">
      本站已运行 {{ time.days }} 天 {{ time.hours }} 小时 {{ time.minutes }} 分钟
      {{ time.seconds }} 秒
    </div>
    <div class="copyright">
      Copyright © 2024-present 耳朵同
    </div>
  </footer>
</template>

<!--suppress CssUnresolvedCustomProperty -->
<style scoped>
.footer-wrapper {
  position: relative;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;

  padding-block: 0.75rem;
  padding-inline: calc(var(--sidebar-space) + 2rem) 2rem;
  border-top: 1px solid var(--vp-c-border);

  background: var(--vp-c-bg);
  color: var(--vp-c-text-mute);

  text-align: center;

  transition: border-top-color var(--vp-t-color),
  background var(--vp-t-color),
  padding var(--vp-t-transform);

  @media (max-width: hope-config.$tablet) {
    padding-inline-start: 2rem;
  }

  @media (min-width: hope-config.$pc) {
    z-index: 50;
    padding-inline-start: 2rem;
  }

  @media print {
    margin: 0 !important;
    padding: 0 !important;
  }

  @media (max-width: hope-config.$mobile) {
    display: block;
  }

  .no-sidebar &,
  .sidebar-collapsed & {
    padding-inline-start: 2rem;
  }
}

.footer {
  margin: 0.5rem 1rem;
  font-size: 14px;

  @media print {
    display: none;
  }
}

.copyright {
  margin: 6px 0;
  font-size: 13px;
}

/*noinspection CssUnusedSymbol*/
.vp-page:not(.not-found) + .footer-wrapper {
  margin-top: -2rem;
}
</style>