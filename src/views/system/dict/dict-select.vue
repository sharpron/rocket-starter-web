<template>
  <a-select
    :model-value="modelValue"
    @change="onChange"
    :placeholder="placeholder"
  >
    <a-option v-for="option in options" :key="option.id" :value="option.id">{{
      option.name
    }}</a-option>
  </a-select>
</template>
<script>
import { onMounted, ref } from 'vue'
import { getDictItemsAsDict } from '@/api/system/dict-item'
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
  emits: ['update:model-value'],
  setup(props, context) {
    const options = ref([])

    onMounted(() => {
      getDictItemsAsDict({ dictName: props.dictName }).then((res) => {
        options.value = res.data
      })
    })

    const onChange = (val) => {
      context.emit('update:model-value', val)
    }
    return {
      options,
      onChange
    }
  }
}
</script>
