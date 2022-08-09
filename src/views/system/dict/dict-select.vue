<template>
  <a-select v-model="value" @change="onChange" :placeholder="placeholder">
    <a-option v-for="option in options" :key="option.id" :value="option.id">{{
      option.name
    }}</a-option>
  </a-select>
</template>
<script>
import { onMounted, ref, toRef } from 'vue'
import { getDictItemsAsDict } from '@/api/system/dict-item'
export default {
  props: {
    modelValue: {
      type: [Number, Array],
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    }
  },
  emits: ['update:model-value'],
  setup() {
    const options = ref([])

    onMounted(() => {
      getDictItemsAsDict().then((res) => {
        options.value = res.data
      })
    })

    const value = toRef(props, 'modelValue')

    const onChange = (val) => {
      context.emit('update:model-value', val)
    }
    return {
      value,
      options,
      onChange
    }
  }
}
</script>
