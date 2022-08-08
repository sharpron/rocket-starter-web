<template>
  <a-card :bordered="false">
    <a-row style="margin-bottom: 16px">
      <a-col :span="16">
        <a-space>
          <a-button type="primary" @click="crud.openAdd">
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
          <a-button
            type="primary"
            status="danger"
            :disabled="crud.selectedKeys.length === 0"
            :loading="crud.deleteLoading"
            @click="crud.batchDelete"
          >
            <template #icon>
              <icon-minus />
            </template>
            删除
          </a-button>
        </a-space>
      </a-col>
      <a-col :span="8" style="text-align: right">
        <a-button @click="crud.exportData" :loading="crud.exportLoading">
          <template #icon>
            <icon-download />
          </template>
          导出
        </a-button>
      </a-col>
    </a-row>
    <a-table
      row-key="id"
      :loading="crud.dataLoading"
      :pagination="crud.pagination"
      v-model:selectedKeys="crud.selectedKeys"
      :data="crud.data"
      :bordered="false"
      @page-change="crud.onPageChange"
      @page-size-change="crud.onPageSizeChange"
      :row-selection="crud.rowSelection"
      default-expand-all-rows
    >
      <template #columns>
        <a-table-column title="名称" data-index="name" />
        <a-table-column title="序号" data-index="orderNo" />

        <a-table-column
          title="操作"
          align="center"
          :width="120"
          data-index="operations"
        >
          <template #cell="{ record }">
            <a-space>
              <a-button @click="crud.openEdit(record)"> 修改 </a-button>
              <a-popconfirm
                content="确认删除该项?"
                @ok="crud.deleteByIds([record.id])"
              >
                <a-button status="danger"> 删除 </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-card>

  <a-modal
    v-model:visible="crud.editDialog"
    :title="crud.editTitle"
    :ok-loading="crud.saveLoading"
    :on-before-ok="crud.save"
  >
    <a-form ref="formComponent" :model="crud.form" :rules="formRules">
      <a-form-item field="name" label="名称">
        <a-input v-model="crud.form.name" placeholder="请输入部门名称" />
      </a-form-item>
      <a-form-item field="orderNo" label="序号">
        <a-input-number v-model="crud.form.orderNo" placeholder="请输入序号" />
      </a-form-item>
      <a-form-item field="parentId" label="上级">
        <a-tree-select
          v-model="crud.form.parentId"
          :data="crud.data"
          :field-names="{
            key: 'id',
            title: 'name',
            children: 'children'
          }"
          placeholder="请选择上级部门"
        ></a-tree-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import useCrud from '@/components/crud'
export default {
  name: 'Dept',
  setup() {
    const { crud, formComponent } = useCrud({
      uri: '/api/departments',
      title: '部门'
    })

    const formRules = {
      name: [
        { required: true, message: '缺少名称' },
        { minLength: 2, maxLength: 255, message: '长度位2个字符到255之间' }
      ],
      orderNo: [{ required: true, message: '缺少序号' }],
      parentId: [{ required: true, message: '缺少上级部门' }]
    }

    return {
      crud,
      formRules,
      formComponent
    }
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}
</style>
