<template>
  <a-tree-select
    v-model="value"
    :data="deptDicts"
    :placeholder="placeholder || '请选择管理部门'"
    :field-names="{
      key: 'id',
      title: 'name',
      children: 'children'
    }"
    :multiple="multiple"
  />
</template>

<script>
import { getDeptDicts } from '@/api/system/dept'
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
    const deptDicts = ref([])
    const value = useVModel(props, 'modelValue', emit)
    onMounted(() => {
      getDeptDicts().then((res) => {
        deptDicts.value = res.data
      })
    })

    return {
      deptDicts,
      value
    }
  }
}
</script>
