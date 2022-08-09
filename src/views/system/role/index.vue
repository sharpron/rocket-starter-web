<template>
  <a-card :bordered="false" style="min-height: 100%">
    <a-row>
      <a-col :flex="1">
        <a-form
          :model="crud.query"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item field="name" label="名称">
                <a-input
                  v-model="crud.query.name"
                  allow-clear
                  placeholder="输入名称查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="disabled" label="状态">
                <a-select
                  v-model="crud.query.disabled"
                  allow-clear
                  placeholder="选择状态查询"
                >
                  <a-option value="true">禁用</a-option>
                  <a-option value="false">正常</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="description" label="描述">
                <a-input
                  v-model="crud.query.description"
                  allow-clear
                  placeholder="输入描述查询"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-divider style="height: 32px" direction="vertical" />
      <a-col :flex="'180px'" style="text-align: right">
        <a-space :size="18">
          <a-button type="primary" @click="crud.refreshData">
            <template #icon>
              <icon-search />
            </template>
            搜索
          </a-button>
          <a-button @click="crud.resetQuery">
            <template #icon>
              <icon-refresh />
            </template>
            重置
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-divider style="margin-top: 0" />
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
            <a-tag v-if="record.disabled">禁用</a-tag>
            <a-tag v-else color="green">正常</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="描述" data-index="description" />

        <a-table-column title="修改时间" data-index="modifyTime">
          <template #cell="{ record }">
            {{ crud.parseTime(record.createTime, '{y}-{m}-{d}') }}
          </template>
        </a-table-column>

        <a-table-column title="修改人" data-index="modifyBy" :width="80" />

        <a-table-column title="创建时间" data-index="createTime">
          <template #cell="{ record }">
            {{ crud.parseTime(record.createTime, '{y}-{m}-{d}') }}
          </template>
        </a-table-column>

        <a-table-column title="创建人" data-index="createBy" :width="80" />

        <a-table-column
          title="操作"
          align="center"
          :width="120"
          fixed="right"
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
        <dept-select
          v-model="crud.form.deptIds"
          placeholder="请选择管理部门"
          multiple
        />
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
import DeptSelect from '../dept/dept-select.vue'

export default {
  name: 'Role',
  components: { DeptSelect },
  setup() {
    const { crud, formComponent } = useCrud({
      uri: '/api/roles',
      title: '角色'
    })

    const formRules = ref({
      name: [
        { required: true, message: '缺少名称' },
        { minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }
      ],
      description: [{ maxLength: 255, message: '最多255个字符' }]
    })

    const menuDicts = ref([])
    onMounted(() => {
      getMenuDicts().then((res) => {
        menuDicts.value = res.data
      })
    })

    return {
      crud,
      formRules,
      formComponent,
      menuDicts
    }
  }
}
</script>
