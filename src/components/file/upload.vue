<template>
  <a-upload
    :custom-request="customRequest"
    :default-file-list="fileList"
    :limit="limit"
    action="/"
  />
</template>

<script>
import { computed, ref, toRef } from 'vue'
import { upload } from '@/api/upload'
export default {
  name: 'FileUpload',
  props: {
    modelValue: {
      type: [Object, Array],
      default: null
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  emits: ['update:model-value'],
  setup(props, context) {
    const value = toRef(props, 'modelValue')

    const fileList = computed(() => {
      if (value.value) {
        const data = Array.isArray(value.value) ? value.value : [value.value]
        return data.map((e, index) => ({
          uid: index + '',
          name: e.docName,
          path: '/api/files?path=' + e.docPath
        }))
      }
      return []
    })

    const files = ref(value.value)

    const customRequest = (option) => {
      const { onError, onSuccess, fileItem } = option

      upload(fileItem.file)
        .then((res) => {
          const { data } = res
          const doc = {
            docName: data.rawFileName,
            docPath: data.path
          }

          if (props.limit === 1) {
            context.emit('update:model-value', doc)
          } else {
            files.value.push(doc)
            context.emit('update:model-value', files)
          }

          onSuccess()
        })
        .catch((err) => {
          onError(err)
        })
    }

    return {
      customRequest,
      fileList
    }
  }
}
</script>
