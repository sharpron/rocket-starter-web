import { computed, onMounted, reactive, ref, readonly, toRef, unref } from 'vue'
import useCrudApi from '@/api/crud'
import { downloadFile } from '@/utils/file'
import { Message } from '@arco-design/web-vue'

const DEFAULT_PAGE = 1

export default function useCrud(options) {
  const crudApi = useCrudApi(options.uri)
  const pagination = reactive({
    pageSize: 20,
    current: DEFAULT_PAGE,
    showPageSize: true,
    showTotal: true,
    showJumper: true,
    total: 0,
    hideOnSinglePage: true,
    ...options.pagination
  })
  const query = ref({})
  const data = ref([])

  const dataLoading = ref(false)

  const getPageable = () => ({
    page: pagination.current - 1,
    size: pagination.pageSize
  })

  const loadData = () => {
    dataLoading.value = true
    crudApi
      .find(getPageable(), query.value)
      .then((res) => {
        const serverData = res.data
        if (Array.isArray(serverData)) {
          data.value = serverData
          pagination.total = serverData.length
        } else {
          data.value = serverData.content
          pagination.total = serverData.totalElements
        }
        dataLoading.value = false
      })
      .catch(() => {
        dataLoading.value = false
      })
  }

  const refreshData = () => {
    pagination.current = DEFAULT_PAGE
    loadData()
  }

  onMounted(() => {
    refreshData()
  })

  const resetQuery = () => {
    query.value = {}
    refreshData()
  }

  const onPageChange = (page) => {
    pagination.current = page
    loadData()
  }

  const onPageSizeChange = (pageSize) => {
    pagination.pageSize = pageSize
    refreshData()
  }

  const exportData = () => {
    crudApi.exportData(getPageable(), query.value).then((res) => {
      downloadFile(res, options.title, 'xlsx')
    })
  }

  const form = ref({ ...options.defaultForm })
  const editDialog = ref(false)
  const saveLoading = ref(false)
  const formComponent = ref()
  // 是否是修改模式
  const isEdit = computed(() => {
    return form.value.id
  })

  const saveMode = computed(() => {
    return isEdit.value ? '修改' : '创建'
  })

  const editTitle = computed(() => {
    return options.title + saveMode.value
  })

  const openAdd = () => {
    form.value = { ...options.defaultForm }
    editDialog.value = true
  }

  const openEdit = (data) => {
    form.value = { ...data }
    editDialog.value = true
  }

  const save = (done) => {
    formComponent.value.validate().then(errors => {
      if (errors) {
        done(false)
        return
      }
      saveLoading.value = true
      const request = isEdit.value ? crudApi.update(form.value) : crudApi.create(form.value)
      request
        .then(() => {
          Message.success(options.title + saveMode.value + '成功')
          saveLoading.value = false
          done(true)
          refreshData()
        })
        .catch(() => {
          saveLoading.value = false
          done(false)
        })
    })
  }

  const deleteLoading = ref(false)
  const deleteByIds = (ids) => {
    deleteLoading.value = true
    crudApi
      .deleteByIds(ids)
      .then(() => {
        Message.success(options.title + '删除成功')
        deleteLoading.value = false
      })
      .catch(() => {
        saveLoading.value = false
      })
  }

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false
  })

  return {
    crud: reactive({
      data,
      pagination,
      query,
      resetQuery,
      dataLoading,
      refreshData,
      onPageChange,
      onPageSizeChange,
      exportData,
      saveLoading,
      saveMode,
      save,
      deleteByIds,
      rowSelection,
      form,
      editTitle,
      editDialog,
      openAdd,
      openEdit,
    }),
    formComponent
  }
}


export function useTest() {
  const formComponent = ref()
  return reactive(formComponent)
}