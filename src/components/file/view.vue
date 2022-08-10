<template>
  <a-link :href="link">{{ name }}</a-link>
</template>

<script>
import { computed, toRef } from 'vue'
export default {
  name: 'FileView',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const doc = toRef(props, 'value')
    const link = computed(() => {
      return '/api/files?path=' + doc.docPath
    })
    const name = computed(() => {
      return doc.docName
    })
    return {
      link,
      name
    }
  }
}
</script>
