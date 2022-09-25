<template>
  <div class="container">
    <LoginBackground />
    <div class="login-form-wrapper">
      <div class="login-form-title">账号密码登录</div>
      <a-divider orientation="left"></a-divider>
      <a-form
        ref="loginFormRef"
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
  <a-modal
    v-model:visible="expirePass.visible"
    title="密码已过期，请修改密码"
    :ok-loading="expirePass.loading"
    :on-before-ok="doModifyPass"
    :mask-closable="false"
  >
    <a-form
      ref="expirePassformRef"
      :model="expirePass.form"
      :rules="expirePass.rules"
    >
      <a-form-item field="newPass" label="新密码">
        <a-input-password
          v-model="expirePass.form.newPass"
          placeholder="请输入新密码"
          allow-clear
        />
      </a-form-item>

      <a-form-item field="confirmPass" label="确认密码">
        <a-input-password
          v-model="expirePass.form.confirmPass"
          placeholder="请再次确认新密码"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getCaptcha } from '@/api/system/auth'
import { ref, onMounted, reactive } from 'vue'
import useUserStore from '@/store/user'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import LoginBackground from './background.vue'
import { PASSWORD_REGEX } from '@/utils/validate.js'

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
    const loginFormRef = ref()

    const expirePass = reactive({
      visible: false,
      loading: false,
      form: {
        newPass: '',
        confirmPass: ''
      },
      rules: {
        newPass: [
          { required: true, message: '新密码不能为空' },
          { match: PASSWORD_REGEX, message: '必须有字母数字特殊符号[8, 30]' }
        ],
        confirmPass: [
          { required: true, message: '确认密码不能为空' },
          {
            validator: (value, callback) => {
              if (value !== expirePass.form.newPass) {
                const errorMessage = '确认密码和新密码不一致'
                callback(errorMessage)
              } else {
                callback()
              }
            }
          }
        ]
      }
    })

    const handleSubmit = async ({ values, errors }) => {
      if (errors) {
        return
      }
      loading.value = true
      try {
        const status = await userStore.login({
          ...values,
          captchaKey: captcha.value.captchaKey
        })

        if (status === 'PASSWORD_EXPIRE') {
          loading.value = false
          // 密码已过期，需要修改密码
          expirePass.visible = true
          Message.warning('密码已过期，需要修改密码')
          return
        }
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

    const expirePassformRef = ref()

    const doModifyPass = async (done) => {
      const formErrors = await loginFormRef.value.validate()
      if (formErrors) {
        done(false)
        return
      }

      const errors = await expirePassformRef.value.validate()
      if (errors) {
        done(false)
        return
      }

      expirePass.loading = true

      try {
        const status = await userStore.login({
          ...userInfo.value,
          newPassword: expirePass.form.newPass,
          captchaKey: captcha.value.captchaKey
        })
        if (status === 'MODIFY_EXPIRE_SUCCESS') {
          done(true)
          expirePass.loading = false
          expirePass.visible = false
          Message.success('密码修改成功，请使用新密码重新登录')
        } else {
          expirePass.loading = false
          Message.error('未知错误')
        }
      } catch (err) {
        expirePass.loading = false
        done(false)
      }
    }
    return {
      captcha,
      userInfo,
      loading,
      loadCaptcha,
      loginFormRef,
      handleSubmit,
      expirePassformRef,
      expirePass,
      doModifyPass
    }
  },
  components: { LoginBackground }
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
