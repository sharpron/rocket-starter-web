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
    >
      <template #columns>
        <a-table-column title="名称" data-index="name" />
        <a-table-column title="状态" width="150" data-index="hide">
          <template #cell="{ record }">
            <a-tag v-if="record.hide">隐藏</a-tag>
            <a-tag v-else color="green">显示</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="描述" data-index="description" />

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
        <a-input v-model="crud.form.name" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="disabled" label="禁用">
        <a-switch v-model="crud.form.disabled" />
      </a-form-item>

      <a-form-item field="menuIds" label="管理部门">
        <a-tree-select
          v-model="crud.form.deptIds"
          :data="deptDicts"
          placeholder="请选择管理部门"
          :field-names="{
            key: 'id',
            title: 'name',
            children: 'children'
          }"
          :multiple="true"
        ></a-tree-select>
      </a-form-item>
      <a-form-item field="menuIds" label="菜单">
        <a-tree
          :checkable="true"
          v-model:checked-keys="crud.form.menuIds"
          :check-strictly="checkStrictly"
          :data="menuDicts"
          :field-names="{
            key: 'id',
            title: 'title',
            children: 'children'
          }"
        />
      </a-form-item>

      <a-form-item field="description" label="描述">
        <a-textarea
          v-model="crud.form.description"
          placeholder="请输入描述信息"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import useCrud from '@/components/crud'
import { onMounted, ref } from 'vue'
import { getMenuDicts } from '@/api/system/menu'
import { getDeptDicts } from '@/api/system/dept'
export default {
  name: 'Role',
  setup() {
    const { crud, formComponent } = useCrud({
      uri: '/api/roles',
      title: '角色'
    })

    const formRules = ref({
      name: [
        { required: true, message: '缺少名称' },
        { minLength: 2, maxLength: 255, message: '长度位2个字符到255之间' }
      ],
      description: [{ maxLength: 255, message: '最多255个字符' }]
    })

    const menuDicts = ref([])
    onMounted(() => {
      getMenuDicts().then((res) => {
        menuDicts.value = res.data
      })
    })

    const deptDicts = ref([])
    onMounted(() => {
      getDeptDicts().then((res) => {
        deptDicts.value = res.data
      })
    })

    return {
      crud,
      formRules,
      formComponent,
      menuDicts,
      deptDicts
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
