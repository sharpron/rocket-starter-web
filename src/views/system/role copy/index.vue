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
          <a-button type="primary" status="danger">
            <template #icon>
              <icon-minus />
            </template>
            删除
          </a-button>
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            导出
          </a-button>
        </a-space>
      </a-col>
      <a-col :span="8" style="text-align: right"> </a-col>
    </a-row>
    <a-table
      row-key="id"
      :loading="crud.dataLoading"
      :pagination="crud.pagination"
      :data="crud.data"
      :bordered="false"
      @page-change="crud.onPageChange"
      @page-size-change="crud.onPageSizeChange"
      :row-selection="crud.rowSelection"
    >
      <template #columns>
        <a-table-column title="名称" data-index="name" />
        <a-table-column title="描述" data-index="icon" />
        <a-table-column title="状态" data-index="hide">
          <template #cell="{ record }">
            <a-tag v-if="record.hide">禁用</a-tag>
            <a-tag v-else color="green">正常</a-tag>
          </template>
        </a-table-column>

        <a-table-column
          title="操作"
          align="center"
          width="200"
          data-index="operations"
        >
          <template #cell="{ record }">
            <a-button type="text" size="small"> 修改 </a-button>
            <a-popconfirm
              content="确认删除该项?"
              @ok="crud.deleteByIds([record.id])"
            >
              <a-button type="text" size="small"> 删除 </a-button>
            </a-popconfirm>
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
      <a-form-item field="disabled" label="禁用">
        <a-switch v-model="crud.form.disabled" />
      </a-form-item>
      <a-form-item field="description" label="描述">
        <a-input v-model="crud.form.icon" placeholder="输入描述" />
      </a-form-item>
      <a-form-item field="menuIds" label="管理部门">
        <a-tree-select
          v-model="crud.form.deptIds"
          :data="treeData"
          placeholder="请选择菜单"
          :multiple="true"
        ></a-tree-select>
      </a-form-item>
      <a-form-item field="menuIds" label="菜单">
        <a-tree-select
          v-model="crud.form.menuIds"
          :data="treeData"
          placeholder="请选择菜单"
          :multiple="true"
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
      orderNo: [{ required: true, message: '缺少序号' }]
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
