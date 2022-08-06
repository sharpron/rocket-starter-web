<template>
  <div class="container">
    <div class="login-form-wrapper">
      <div class="login-form-title">账号密码登录</div>
      <a-divider orientation="left"></a-divider>
      <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
        <a-form-item field="username" :rules="[{ required: true, message: '账号不能为空' }]"
          :validate-trigger="['change', 'blur']" hide-label>
          <a-input v-model="userInfo.username" autocomplete="username" placeholder="账号：">
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" :rules="[{ required: true, message: '密码不能为空' }]"
          :validate-trigger="['change', 'blur']" hide-label>
          <a-input-password v-model="userInfo.password" autocomplete="current-password" placeholder="密码：" allow-clear>
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item field="captcha" :rules="[{ required: true, message: '验证码不能为空' }]"
          :validate-trigger="['change', 'blur']" hide-label>
          <a-input v-model="userInfo.captcha" placeholder="验证码：" allow-clear>
            <template #prefix>
              <icon-lock />
            </template>
          </a-input>
          <img class="captcha" alt="验证码" :src="captcha.codeUrl" @click="loadCaptcha" />
        </a-form-item>
        <a-space :size="16" direction="vertical">
          <div class="login-form-password-actions">
            <a-checkbox v-model="userInfo.rememberMe" @change="setRememberPassword;">
              记住我
            </a-checkbox>
          </div>
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
      await userStore.login({
        ...values,
        captchaKey: captcha.value.captchaKey
      })

      const { redirect, ...othersQuery } = router.currentRoute.value.query

      router.push({
        path: redirect || '/',
        query: {
          ...othersQuery
        }
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
  }
}
</script>

<style scoped>
.container {
  position: relative;
  background: var(--color-fill-1);
}

.login-form-wrapper {
  background: var(--color-bg-1);
  position: absolute;
  left: 50%;
  transform: translate(-50%, 50%);
}

.login-form-wrapper {
  width: 320px;
}

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

.login-form-wrapper {
  padding: 25px;
  border: 1px solid #eee;
}
</style>
