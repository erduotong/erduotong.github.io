<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue'

const startTime = new Date("2024-09-22T00:00:00+08:00") // 网站创建时间
// 计算网站运行时间
const time = ref({
  days: 0,
  hours: '00' as string,
  minutes: '00' as string,
  seconds: '00' as string
})
const padZero = (num: number): string => String(num).padStart(2, '0');

const calculateTime = () => {
  const now = new Date();
  const diff = now.getTime() - startTime.getTime();
  time.value.days = Math.floor(diff / (1000 * 60 * 60 * 24));
  time.value.hours = padZero(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  time.value.minutes = padZero(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  time.value.seconds = padZero(Math.floor((diff % (1000 * 60)) / 1000));
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
      <!--suppress HtmlUnknownTarget -->
      <div>
        <span>订阅本站</span> |
        <!--suppress HtmlUnknownTarget -->
        <a href="/rss.xml">RSS</a> |
        <!--suppress HtmlUnknownTarget -->
        <a href="/atom">Atom</a> |
        <!--suppress HtmlUnknownTarget -->
        <a href="/feed.json">JSON</a>


      </div>
    </div>

    <div class="copyright">
      <div> Copyright © 2024-present 耳朵同</div>
      <ClientOnly>
        <div>本站已运行 {{ time.days }} 天 {{ time.hours }} 小时 {{ time.minutes }} 分钟
          {{ time.seconds }} 秒
        </div>
      </ClientOnly>
    </div>
  </footer>
</template>

<!--suppress CssUnresolvedCustomProperty -->
<style scoped>
.footer-wrapper {
  position: relative;

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-evenly;

  transition: border-top-color var(--vp-t-color),
  background var(--vp-t-color),
  padding var(--vp-t-transform);
  text-align: center;
  color: var(--vp-c-text-mute);

  border-top: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);

  padding-block: 0.75rem;

  padding-inline: calc(var(--sidebar-space) + 2rem) 2rem;

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
  font-size: 14px;
  margin: 0.5rem 1rem;

  @media print {
    display: none;
  }
}

.copyright {
  font-size: 13px;
  margin: 6px 0;
}

/*noinspection CssUnusedSymbol*/
.vp-page:not(.not-found) + .footer-wrapper {
  margin-top: -2rem;
}
</style>