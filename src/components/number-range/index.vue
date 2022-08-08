<template>
  <a-input-group>
    <a-input
      v-model="start"
      :allow-clear="allowClear"
      @update:model-value="change"
      placeholder="最小值"
    />
    <a-input v-model="end" @update:model-value="change" placeholder="最大值" />
  </a-input-group>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'NumberRange',
  props: {
    modelValue: {
      type: Array,
      default: () => [null, null]
    },
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:model-value'],
  setup(props, context) {
    const start = ref(props.modelValue[0])
    const end = ref(props.modelValue[1])
    const change = () => {
      context.emit('update:model-value', [start.value, end.value])
    }

    return {
      start,
      end,
      change
    }
  }
}
</script>
