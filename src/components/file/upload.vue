<template>
  <a-upload
    :file-list="fileList"
    :custom-request="customRequest"
    :limit="limit"
    action="/"
    @change="onChange"
  />
</template>

<script>
import { watch, ref } from 'vue'
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
    const fileList = ref([])

    watch(
      () => props.modelValue,
      (val) => {
        if (val) {
          const data = Array.isArray(val) ? val : [val]
          fileList.value = data.map((e, index) => ({
            uid: index + '',
            name: e.docName,
            url: baseUrl + 'api/files?path=' + e.docPath,
            response: e,
            status: 'done'
          }))
        } else {
          fileList.value = []
        }
      },
      { immediate: true }
    )

    const customRequest = (option) => {
      const { onError, onSuccess, fileItem } = option
      upload(fileItem.file)
        .then((res) => {
          const { rawFileName, path } = res.data
          onSuccess({
            docName: rawFileName,
            docPath: path
          })
        })
        .catch((err) => {
          onError(err)
        })
    }

    const onChange = (newVal) => {
      if (newVal.length === 0) {
        context.emit('update:modelValue', null)
      } else if (newVal.every((e) => e.status === 'done')) {
        if (props.limit === 1) {
          context.emit('update:modelValue', newVal[0].response)
        } else {
          context.emit(
            'update:modelValue',
            newVal.map((e) => e.response)
          )
        }
      }
    }

    return {
      customRequest,
      fileList,
      onChange
    }
  }
}
</script>
