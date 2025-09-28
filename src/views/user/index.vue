<template>
  <a-card class="header" :bordered="false">
    <a-space
      :size="12"
      direction="vertical"
      style="display: flex"
      align="center"
    >
      <a-avatar :size="64">
        <template #trigger-icon>
          <icon-camera />
        </template>
        <img :src="defaultAvatar" />
      </a-avatar>
      <a-typography-title :heading="6" style="margin: 0">
        {{ userStore.nickname }}
      </a-typography-title>
      <div class="user-msg">
        <a-space :size="18">
          <div>
            <icon-user />
            <a-typography-text>{{ userStore.username }}</a-typography-text>
          </div>
          <div>
            <icon-user-group />
            <a-typography-text>
              {{ userStore.deptName }}
            </a-typography-text>
          </div>
          <div>
            <icon-mobile />
            <a-typography-text>{{ userStore.mobile }}</a-typography-text>
          </div>
          <div>
            <icon-email />
            <a-typography-text>{{ userStore.email }}</a-typography-text>
          </div>
        </a-space>
      </div>

      <a-space align="end">
        <a-button type="text" @click="modifyUser.visible = true"
          ><template #icon><icon-edit /></template>修改信息</a-button
        >
        <a-button type="text" @click="modifyPass.visible = true"
          ><template #icon><icon-lock /></template>修改密码</a-button
        >
      </a-space>
    </a-space>
  </a-card>

  <a-card title="操作日志" style="margin-top: 30px">
    <a-table
      row-key="id"
      :loading="crud.dataLoading"
      :pagination="crud.pagination"
      :data="crud.data"
      :bordered="{ cell: true }"
      column-resizable
      @page-change="crud.onPageChange"
      @page-size-change="crud.onPageSizeChange"
    >
      <template #columns>
        <a-table-column
          title="操作描述"
          tooltip
          :width="180"
          data-index="description"
        />
        <a-table-column title="参数" tooltip ellipsis data-index="params" />
        <a-table-column title="间隔(ms)" data-index="spendTime">
          <template #cell="{ record }">
            <a-tag v-if="record.spendTime < 100" color="green">{{
              record.spendTime
            }}</a-tag>
            <a-tag v-else-if="record.spendTime < 500" color="orange">{{
              record.spendTime
            }}</a-tag>
            <a-tag v-else color="red">{{ record.spendTime }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="时间" :width="180" data-index="createTime" />

        <a-table-column title="状态" :width="120" data-index="status">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 'OK'" color="green">正常</a-tag>
            <a-tag v-else color="red">失败</a-tag>
          </template>
        </a-table-column>
        <a-table-column
          title="客户端IP"
          :width="140"
          data-index="clientIp"
          tooltip
        />
        <a-table-column
          title="客户端位置"
          data-index="clientRegion"
          tooltip
          ellipsis
        />
        <a-table-column
          title="浏览器"
          data-index="userAgent"
          ellipsis
          tooltip
        />
      </template>
    </a-table>
  </a-card>

  <a-modal
    v-model:visible="modifyUser.visible"
    title="修改信息"
    :ok-loading="modifyUser.saveLoading"
    :on-before-ok="doModifyUser"
    :mask-closable="false"
  >
    <a-form
      ref="modifyUserformRef"
      :model="modifyUser.form"
      :rules="modifyUser.rules"
    >
      <a-form-item field="nickname" label="昵称">
        <a-input
          v-model="modifyUser.form.nickname"
          placeholder="请输入昵称"
          allow-clear
        />
      </a-form-item>

      <a-form-item field="mobile" label="手机号">
        <a-input
          v-model="modifyUser.form.mobile"
          placeholder="请输入手机号"
          allow-clear
        />
      </a-form-item>

      <a-form-item field="email" label="邮箱">
        <a-input
          v-model="modifyUser.form.email"
          placeholder="请输入邮箱"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:visible="modifyPass.visible"
    title="修改密码"
    :ok-loading="modifyPass.saveLoading"
    :on-before-ok="doModifyPass"
    :mask-closable="false"
  >
    <a-form
      ref="modifyPassformRef"
      :model="modifyPass.form"
      :rules="modifyPass.rules"
    >
      <a-form-item field="oldPass" label="原密码">
        <a-input-password
          v-model="modifyPass.form.oldPass"
          placeholder="请输入原密码"
          allow-clear
        />
      </a-form-item>

      <a-form-item field="newPass" label="新密码">
        <a-input-password
          v-model="modifyPass.form.newPass"
          placeholder="请输入新密码"
          allow-clear
        />
      </a-form-item>

      <a-form-item field="confirmPass" label="确认密码">
        <a-input-password
          v-model="modifyPass.form.confirmPass"
          placeholder="请再次输入新密码"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import defaultAvatar from '@/assets/images/default-avatar.png'
import userBg from '@/assets/images/user-bg.jpg'
import useUserStore from '@/store/user'
import useCrud from '@/components/crud'
import { reactive, ref } from 'vue'
import { modifySelfInfo, modifySelfPass } from '@/api/system/user'
import { Message } from '@arco-design/web-vue'
import { PASSWORD_REGEX, MOBILE_REGEX } from '@/utils/validate.js'

export default {
  name: 'UserInfo',
  setup() {
    const userStore = useUserStore()

    const { crud } = useCrud({
      uri: '/api/logs/me',
      title: '日志',
      defaultSort: ['id,desc']
    })

    const modifyUser = reactive({
      visible: false,
      form: {
        nickname: userStore.nickname,
        mobile: userStore.mobile,
        email: userStore.email
      },
      saveLoading: false,
      rules: {
        nickname: [{ required: true, message: '昵称不能为空' }],
        mobile: [
          { required: true, message: '手机号不能为空' },
          {
            match: MOBILE_REGEX,
            message: '手机号格式不正确'
          }
        ],
        email: [{ required: true, message: '邮箱不能为空' }]
      }
    })

    const modifyUserformRef = ref()

    const doModifyUser = (done) => {
      modifyUserformRef.value.validate().then((errors) => {
        if (errors) {
          done(false)
          return
        }
        modifyUser.saveLoading = true
        modifySelfInfo(modifyUser.form)
          .then(() => {
            Message.success('修改用户成功')
            modifyUser.visible = false
            done(true)
            userStore.loadUserInfo()
          })
          .catch(() => {
            done(false)
          })
          .finally(() => {
            modifyUser.saveLoading = false
          })
      })
    }

    const modifyPass = reactive({
      visible: false,
      form: {},
      saveLoading: false,
      rules: {
        oldPass: [{ required: true, message: '原密码不能为空' }],
        newPass: [
          { required: true, message: '新密码不能为空' },
          { match: PASSWORD_REGEX, message: '必须有字母数字特殊符号[8, 30]' }
        ],
        confirmPass: [
          { required: true, message: '确认密码不能为空' },
          {
            validator: (value, callback) => {
              if (value !== modifyPass.form.newPass) {
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

    const modifyPassformRef = ref()

    const doModifyPass = (done) => {
      modifyPassformRef.value.validate().then((errors) => {
        if (errors) {
          done(false)
          return
        }
        modifyPass.saveLoading = true
        modifySelfPass({
          oldPass: modifyPass.form.oldPass,
          newPass: modifyPass.form.newPass
        })
          .then(() => {
            Message.success('修改密码成功')
            modifyPass.visible = false
            done(true)
          })
          .catch(() => {
            done(false)
          })
          .finally(() => {
            modifyPass.saveLoading = false
          })
      })
    }

    return {
      defaultAvatar,
      userBg,
      userStore,
      crud,
      modifyUser,
      modifyUserformRef,
      doModifyUser,

      modifyPass,
      modifyPassformRef,
      doModifyPass
    }
  }
}
</script>

<style scoped lang="less">
.header {
  background: url(../../assets/images/user-bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}

.user-msg {
  :deep(.arco-typography) {
    margin-left: 4px;
  }
}
</style>
