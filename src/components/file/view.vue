<template>
  <a-link :href="link" icon>{{ name }}</a-link>
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
      return '/api/files?path=' + doc.value.docPath
    })
    const name = computed(() => {
      return doc.value.docName
    })
    return {
      link,
      name
    }
  }
}
</script>
