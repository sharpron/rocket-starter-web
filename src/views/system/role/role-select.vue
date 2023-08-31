<template>
  <a-select
    v-model="value"
    :placeholder="placeholder || '请选择角色'"
    :multiple="multiple"
  >
    <a-option v-for="option in options" :key="option.id" :value="option.id">{{
      option.name
    }}</a-option>
  </a-select>
</template>

<script>
import { getRoleDicts } from '@/api/system/role'
import { onMounted, ref } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  props: {
    modelValue: {
      type: [Number, Array],
      required: false
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
      getRoleDicts().then((res) => {
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
