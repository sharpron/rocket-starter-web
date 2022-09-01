<template>
  <a-popover trigger="click">
    <a-tooltip content="消息">
      <a-badge :count="unreadCount" dot>
        <a-button class="nav-btn" shape="circle">
          <icon-notification />
        </a-button>
      </a-badge>
    </a-tooltip>
    <template #content>
      <box ref="boxRef" :unread-change="unreadChange" />
    </template>
  </a-popover>
</template>
<script>
import { Client } from '@stomp/stompjs'
import { getUnreadCount } from '@/api/message'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Box from './box.vue'
import { Notification } from '@arco-design/web-vue'
export default {
  components: { Box },
  setup() {
    const client = new Client({
      brokerURL: `ws://${location.host}/api/websocket-endpoint`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    })

    const boxRef = ref()
    const unreadCount = ref(0)

    const onReceiveMessage = (message) => {
      const messageBody = JSON.parse(message.body)
      if (boxRef.value) {
        boxRef.value.receiveMessage(messageBody)
      }

      Notification.info({
        title:
          messageBody.type === 'PUBLISH'
            ? '通知公告'
            : `来自（${messageBody.sender}）私信`,
        content: messageBody.content,
        position: 'bottomRight',
        closable: true
      })

      unreadCount.value++
    }

    client.onConnect = function (frame) {
      // Do something, all subscribes must be done is this callback
      // This is needed because this will be executed after a (re)connect
      client.subscribe('/topic/messages', function (message) {
        // called when the client receives a STOMP message from the server
        onReceiveMessage(message)
      })

      client.subscribe('/user/queue/messages', function (message) {
        // called when the client receives a STOMP message from the server
        onReceiveMessage(message)
      })
    }

    client.onStompError = function (frame) {
      // Will be invoked in case of error encountered at Broker
      // Bad login/passcode typically will cause an error
      // Complaint brokers will set `message` header with a brief message. Body may contain details.
      // Compliant brokers will terminate the connection after any error
      console.log('Broker reported error: ' + frame.headers['message'])
      console.log('Additional details: ' + frame.body)
    }

    client.activate()

    onBeforeUnmount(() => {
      client.deactivate()
    })

    onMounted(() => {
      getUnreadCount().then((res) => {
        unreadCount.value = res.data
      })
    })
    const unreadChange = (val) => {
      unreadCount.value += val
    }
    return {
      unreadCount,
      unreadChange
    }
  }
}
</script>
