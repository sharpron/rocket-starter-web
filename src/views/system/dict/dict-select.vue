<template>
  <a-select v-model="value" :placeholder="placeholder">
    <a-option v-for="option in options" :key="option.id" :value="option.id">{{
      option.name
    }}</a-option>
  </a-select>
</template>
<script>
import { onMounted, ref } from 'vue'
import { getDictItemsAsDict } from '@/api/system/dict-item'

import { useVModel } from '@vueuse/core'
export default {
  props: {
    modelValue: {
      type: [Number, Array],
      required: false
    },
    dictName: {
      type: String,
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
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const options = ref([])

    const value = useVModel(props, 'modelValue', emit)

    onMounted(() => {
      getDictItemsAsDict({ dictName: props.dictName }).then((res) => {
        options.value = res.data
      })
    })

    return {
      options,
      value
    }
  }
}
</script>
