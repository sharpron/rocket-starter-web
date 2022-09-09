<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <img
          alt="logo"
          src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
        />
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          Arco Pro
        </a-typography-title>
        <icon-menu-fold
          v-if="appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip content="搜索">
          <a-button class="nav-btn" :shape="'circle'">
            <template #icon>
              <icon-search />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <message-component />
      </li>
      <li>
        <a-tooltip :content="`点击切换为${isDark ? '暗黑' : '亮色'}模式`">
          <a-button class="nav-btn" :shape="'circle'" @click="toggleDark()">
            <template #icon>
              <icon-moon-fill v-if="isDark" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li v-if="supportFullScreen">
        <a-tooltip :content="isFullscreen ? '退出全屏' : '进入全屏'">
          <a-button class="nav-btn" :shape="'circle'" @click="switchFullscreen">
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!-- <li>
      <a-tooltip content="样式配置">
        <a-button class="nav-btn" :shape="'circle'" @click="setVisible">
          <template #icon>
            <icon-settings />
          </template>
        </a-button>
      </a-tooltip>
    </li> -->
      <li>
        <a-dropdown trigger="click">
          <a-avatar
            :size="32"
            :style="{ marginRight: '8px', cursor: 'pointer' }"
          >
            <img alt="avatar" :src="defaultAvatar" />
          </a-avatar>
          <template #content>
            <a-doption>
              <a-space @click="$router.push('/user/info')">
                <icon-user />
                <span> 用户中心 </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span> 退出登录 </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import defaultAvatar from '@/assets/images/default-avatar.png'
import useAppStore from '@/store/app'
import useUserStore from '@/store/user'

import { useDark, useToggle, useFullscreen } from '@vueuse/core'

import MessageComponent from '@/components/message/index.vue'

export default defineComponent({
  name: 'LayoutNavbar',
  components: { MessageComponent },
  setup() {
    const appStore = useAppStore()
    const isDark = useDark({
      onChanged(dark) {
        if (dark) {
          document.body.setAttribute('arco-theme', 'dark')
        } else {
          document.body.removeAttribute('arco-theme')
        }
      }
    })
    const toggleDark = useToggle(isDark)

    const {
      isFullscreen,
      isSupported,
      toggle: switchFullscreen
    } = useFullscreen()

    const userStore = useUserStore()
    const handleLogout = () => {
      userStore.logout()
    }

    return {
      appStore,
      supportFullScreen: isSupported,
      isFullscreen,
      switchFullscreen,
      defaultAvatar,
      isDark,
      toggleDark,
      handleLogout
    }
  }
})
</script>
<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  box-sizing: border-box;
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;
  :deep(.locale-select) {
    border-radius: 20px;
  }
  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }
  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }
}
</style>
