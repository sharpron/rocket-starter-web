import { computed, onMounted, reactive, ref } from 'vue'
import useCrudApi from '@/api/crud'
import { downloadFile } from '@/utils/file'
import { Message, Modal } from '@arco-design/web-vue'
import { parseTime } from '@/utils/time'

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
  const query = ref({ ...options.defaultQuery })
  const sort = ref([...(options.defaultSort || [])])
  const data = ref([])

  const dataLoading = ref(false)

  const pageable = computed(() => ({
    page: pagination.current - 1,
    size: pagination.pageSize,
    sort: sort.value
  }))

  const formatTreeDataIfNeed = (data) => {
    data.forEach((e) => {
      if (e.children ? e.children.length === 0 : true) {
        delete e.children
      } else {
        formatTreeDataIfNeed(e.children)
      }
    })
    return data
  }

  const loadData = () => {
    dataLoading.value = true
    crudApi
      .find(pageable.value, query.value)
      .then((res) => {
        const serverData = res.data
        if (Array.isArray(serverData)) {
          data.value = formatTreeDataIfNeed(serverData)
          pagination.total = serverData.length
        } else {
          data.value = formatTreeDataIfNeed(serverData.content)
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
    query.value = { ...options.defaultQuery }
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

  const exportLoading = ref(false)
  const exportData = () => {
    exportLoading.value = true
    crudApi
      .exportData(pageable.value, query.value)
      .then((res) => {
        downloadFile(res.data, options.title, 'csv')
      })
      .finally(() => {
        exportLoading.value = false
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
    return saveMode.value + options.title
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
    formComponent.value.validate().then((errors) => {
      if (errors) {
        done(false)
        return
      }
      saveLoading.value = true
      const request = isEdit.value
        ? crudApi.update(form.value)
        : crudApi.create(form.value)
      request
        .then(() => {
          Message.success(options.title + saveMode.value + '成功')
          saveLoading.value = false
          done(true)
          // 编辑模式直接刷新当页
          if (isEdit.value) {
            loadData()
          } else {
            refreshData()
          }
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
        // 重新加载当页数据
        loadData()
        deleteLoading.value = false
      })
      .catch(() => {
        saveLoading.value = false
      })
  }

  const selectedKeys = ref([])
  const batchDelete = () => {
    Modal.warning({
      title: '系统提示',
      content: `您将要删除${selectedKeys.value.length}条数据，删除后不可恢复！是否确认?`,
      hideCancel: false,
      onOk() {
        deleteByIds(selectedKeys.value)
      }
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
      exportLoading,
      exportData,
      saveLoading,
      saveMode,
      save,
      isEdit,
      deleteByIds,
      rowSelection,
      form,
      editTitle,
      editDialog,
      openAdd,
      openEdit,
      selectedKeys,
      batchDelete,
      parseTime
    }),
    formComponent
  }
}
