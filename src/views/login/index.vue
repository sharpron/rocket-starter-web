<template>
  <div class="container">
    <background />
    <div class="login-form-wrapper">
      <div class="login-form-title">账号密码登录</div>
      <a-divider orientation="left"></a-divider>
      <a-form
        ref="loginForm"
        :model="userInfo"
        class="login-form"
        layout="vertical"
        @submit="handleSubmit"
      >
        <a-form-item
          field="username"
          :rules="[{ required: true, message: '账号不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="userInfo.username"
            autocomplete="username"
            placeholder="账号："
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          :rules="[{ required: true, message: '密码不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input-password
            v-model="userInfo.password"
            placeholder="密码："
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item
          field="captcha"
          :rules="[{ required: true, message: '验证码不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="userInfo.captcha"
            placeholder="验证码："
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input>
          <a-image
            width="100"
            style="cursor: pointer"
            :src="captcha.codeUrl"
            @click="loadCaptcha"
            :preview="false"
          />
        </a-form-item>
        <a-space :size="16" direction="vertical">
          <a-button type="primary" html-type="submit" long :loading="loading">
            登录
          </a-button>
        </a-space>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getCaptcha } from '@/api/system/auth'
import { ref, onMounted } from 'vue'
import useUserStore from '@/store/user'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import Background from './background.vue'

export default {
  name: 'LoginPage',
  setup() {
    const captcha = ref({})
    const loadCaptcha = () => {
      getCaptcha().then(({ data }) => {
        captcha.value = {
          codeUrl: data.base64Data,
          captchaKey: data.key
        }
      })
    }
    onMounted(() => {
      loadCaptcha()
    })
    const userInfo = ref({})
    const loading = ref(false)
    const userStore = useUserStore()
    const router = useRouter()
    const handleSubmit = async ({ values, errors }) => {
      if (errors) {
        return
      }
      loading.value = true
      try {
        await userStore.login({
          ...values,
          captchaKey: captcha.value.captchaKey
        })
      } catch (err) {
        loading.value = false
        return
      }
      const { redirect, ...othersQuery } = router.currentRoute.value.query
      router.push({
        path: redirect || '/',
        query: {
          ...othersQuery
        },
        replace: true
      })
      Message.success('登录成功')
    }
    return {
      captcha,
      userInfo,
      loading,
      loadCaptcha,
      handleSubmit
    }
  },
  components: { Background }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  height: 100%;

  .login-form-wrapper {
    background: rgba(255, 255, 255, 0.7);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 25px;
    width: 300px;
    border-radius: 5px;

    .login-form-title {
      color: var(--color-text-2);
      font-weight: 700;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 3px;
      text-align: center;
    }

    .login-form-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    .login-form-password-actions {
      display: flex;
      justify-content: space-between;
    }

    .captcha {
      cursor: pointer;
    }
  }
}
</style>
