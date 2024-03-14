<template>
  <a-tree
    :checkable="true"
    v-model:checked-keys="value"
    :data="options"
    :field-names="{
      key: 'id',
      title: 'title',
      children: 'children'
    }"
    check-strictly
  />
</template>

<script>
import { onMounted, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { getMenuDicts } from '@/api/system/menu'
export default {
  props: {
    modelValue: {
      type: Array,
      required: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const value = useVModel(props, 'modelValue', emit)
    const options = ref([])
    onMounted(() => {
      getMenuDicts().then((res) => {
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
