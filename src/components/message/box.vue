<template>
  <a-list
    :bordered="false"
    style="width: 350px"
    :max-height="400"
    :data="data"
    @reach-bottom="loadMore"
  >
    <template #scroll-loading>
      <a-typography-text v-if="last" type="secondary">
        没有更多数据了..
      </a-typography-text>
      <a-spin v-else />
    </template>
    <template #item="{ item, index }">
      <a-list-item
        :key="index"
        :style="{
          opacity: item.read ? 0.5 : 1
        }"
      >
        <a-list-item-meta
          :description="item.content"
          @click="readMessage(item)"
        >
          <template #title>
            <a-space :size="4">
              <span>{{ item.sender }}</span>
              <a-typography-text type="secondary">
                {{ item.type === 'PUBLISH' ? '发布的通知' : '的私信' }}
              </a-typography-text>
            </a-space>
          </template>
          <template #description>
            <a-typography-paragraph
              :ellipsis="{
                rows: 1
              }"
              style="margin-bottom: 0"
              >{{ item.content }}</a-typography-paragraph
            >
            <a-typography-text type="secondary" style="font-size: 12px">
              {{ item.sendTime }}
            </a-typography-text>
          </template>
          <template #avatar>
            <a-avatar shape="square"> M </a-avatar>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
    <template #empty>
      <a-result v-if="data.length === 0" status="404">
        <template #subtitle> 暂无消息 </template>
      </a-result>
    </template>
  </a-list>
</template>
<script>
import { findSelfByPage, read } from '@/api/message'
import { ref } from 'vue'
export default {
  props: {
    unreadChange: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const data = ref([])
    const last = ref(false)
    const page = ref(0)

    const loadMore = () => {
      findSelfByPage({
        size: 10,
        page: page.value,
        sort: ['id,desc']
      }).then((res) => {
        data.value.push(...res.data.content)
        last.value = res.data.last
        page.value = page.value + 1
      })
    }

    const emptyList = () => {}
    const allRead = () => {}

    const receiveMessage = (item) => {
      data.value.unshift(item)
    }

    const readMessage = (item) => {
      if (item.read) return
      read({ ids: item.id }).then(() => {
        props.unreadChange(-1)
        item.read = true
      })
    }

    return {
      data,
      last,
      emptyList,
      allRead,
      loadMore,
      readMessage,
      receiveMessage
    }
  }
}
</script>
