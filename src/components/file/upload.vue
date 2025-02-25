<template>
  <a-upload
    v-model:file-list="fileList"
    :custom-request="customRequest"
    :limit="limit"
    action="/"
  />
</template>

<script>
import { computed, toRef } from 'vue'
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
  emits: ['update:modelValue'],
  setup(props, context) {
    const value = toRef(props, 'modelValue')
    const fileList = computed({
      get: () => {
        if (value.value) {
          const data = Array.isArray(value.value) ? value.value : [value.value]
          return data.map((e, index) => ({
            uid: index + '',
            name: e.docName,
            path: '/api/files?path=' + e.docPath
          }))
        }
        return []
      },

      set: (newVal) => {
        if (newVal.length === 0) {
          context.emit('update:modelValue', null)
          return
        }

        if (props.limit === 1) {
          context.emit('update:modelValue', newVal[0].doc)
        } else {
          context.emit(
            'update:modelValue',
            newVal.map((e) => e.doc).filter((e) => e || false)
          )
        }
      }
    })

    const customRequest = (option) => {
      const { onError, onSuccess, fileItem } = option
      upload(fileItem.file)
        .then((res) => {
          const { data } = res
          fileItem.doc = {
            docName: data.rawFileName,
            docPath: data.path
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
