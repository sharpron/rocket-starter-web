<template>
  <a-tree-select
    v-model="modelValue"
    :data="deptDicts"
    :placeholder="placeholder || '请选择管理部门'"
    :field-names="{
      key: 'id',
      title: 'name',
      children: 'children'
    }"
    @change="onChange"
    :multiple="multiple"
  />
</template>

<script>
import { getDeptDicts } from '@/api/system/dept'
import { onMounted, ref, toRef } from 'vue'
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
  emits: ['update:model-value'],
  setup(_props, context) {
    const deptDicts = ref([])

    onMounted(() => {
      getDeptDicts().then((res) => {
        deptDicts.value = res.data
      })
    })

    const onChange = (val) => {
      context.emit('update:model-value', val)
    }
    return {
      deptDicts,
      onChange
    }
  }
}
</script>
