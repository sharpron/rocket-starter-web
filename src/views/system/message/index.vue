<template>
  <crud
    ref="crudRef"
    :options="options"
    :columns="columns"
    permissionPrefix="message"
  >
    <template #tool-left>
      <a-button
        type="primary"
        v-permission="['message:publish', 'message:publish']"
        @click="send.visible = true"
      >
        <template #icon><icon-send /></template>
        发送消息
      </a-button>
    </template>
  </crud>
  <a-modal
    v-model:visible="send.visible"
    title="发送消息"
    :ok-loading="send.loading"
    :on-before-ok="sendMessage"
    :mask-closable="false"
  >
    <a-form ref="sendFormRef" :rules="send.rules" :model="send.form">
      <a-form-item field="type" label="消息类型">
        <a-radio-group v-model="send.form.type" type="button">
          <a-radio
            v-for="messageType in messageTypes"
            :key="messageType.value"
            :value="messageType.value"
            >{{ messageType.label }}</a-radio
          >
        </a-radio-group>
      </a-form-item>
      <a-form-item
        v-if="send.form.type === 'SEND'"
        :rules="[{ required: true, message: '接收人不能为空' }]"
        field="receiver"
        label="接收人"
      >
        <a-input v-model="send.form.receiver" placeholder="请输入接收人" />
      </a-form-item>

      <a-form-item field="content" label="内容">
        <a-textarea
          v-model="send.form.content"
          placeholder="输入想要发送的内容."
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import Crud from '@/components/crud/crud.vue'
import { computed, reactive, ref } from 'vue'
import { checkPermission } from '@/utils/permission'
import { publish, send as sendPrivate } from '@/api/message'
import { Message } from '@arco-design/web-vue'
export default {
  name: 'MessagePage',
  components: {
    Crud
  },
  setup() {
    const options = {
      uri: '/api/messages',
      title: '消息管理',
      defaultSort: ['id,desc']
    }

    const columns = [
      {
        title: '发送人',
        dataIndex: 'sender',
        query: true
      },
      {
        title: '接收人',
        dataIndex: 'receiver',
        query: true
      },
      {
        title: '类型',
        dataIndex: 'type',
        inputType: 'SELECT',
        query: true,
        options: [
          { value: 'PUBLISH', label: '通知公告', color: 'green' },
          { value: 'SEND', label: '私信' }
        ]
      },
      {
        title: '内容',
        dataIndex: 'content'
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime'
      }
    ]

    const send = reactive({
      visible: false,
      loading: false,
      form: {},
      rules: {
        type: [{ required: true, message: '类型不能为空' }],
        content: [
          { required: true, message: '内容不能为空' },
          { max: 255, message: '最大不能超过255个字符' }
        ]
      }
    })

    const messageTypes = computed(() => {
      const types = []
      if (checkPermission('message:publish')) {
        types.push({
          value: 'PUBLISH',
          label: '通知公告'
        })
      }

      if (checkPermission('message:send')) {
        types.push({
          value: 'SEND',
          label: '私信'
        })
      }
      return types
    })

    if (messageTypes.value.length > 0) {
      send.form.type = messageTypes.value[0].value
    }

    const crudRef = ref()
    const sendFormRef = ref()
    const sendMessage = (done) => {
      sendFormRef.value.validate().then((errors) => {
        if (errors) {
          done(false)
          return
        }
        const request =
          send.form.type === 'PUBLISH'
            ? publish({
                content: send.form.content
              })
            : sendPrivate({
                receiver: send.form.receiver,
                content: send.form.content
              })

        request
          .then(() => {
            done(true)
            send.visible = false
            crudRef.value.crud.refreshData()
            send.form = {}
            Message.success('发送成功')
          })
          .catch(() => {
            done(false)
          })
      })
    }

    return {
      options,
      columns,
      send,
      sendMessage,
      crudRef,
      sendFormRef,
      messageTypes
    }
  }
}
</script>
