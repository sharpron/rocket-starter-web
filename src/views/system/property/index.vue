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
              <a-form-item field="referenceKey" label="引用键">
                <a-input
                  v-model="crud.query.referenceKey"
                  allow-clear
                  placeholder="输入引用键查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="value" label="配置值">
                <a-input
                  v-model="crud.query.value"
                  allow-clear
                  placeholder="输入配置值查询"
                />
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
          <a-button
            v-permission="'property:create'"
            type="primary"
            @click="crud.openAdd"
          >
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
          <a-button
            v-permission="'property:remove'"
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
      :bordered="{ cell: true }"
      column-resizable
      @page-change="crud.onPageChange"
      @page-size-change="crud.onPageSizeChange"
      :row-selection="crud.rowSelection"
    >
      <template #columns>
        <a-table-column title="访问键" data-index="referenceKey" />
        <a-table-column title="配置值" data-index="value" />

        <a-table-column title="类型" data-index="valueType">
          <template #cell="{ record }">
            <a-tag :color="colors[record.valueType]">{{
              types[record.valueType]
            }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="描述" data-index="description" />

        <a-table-column title="修改时间" data-index="modifyTime" :width="160" />
        <a-table-column
          title="修改人"
          data-index="modifyBy"
          :width="100"
          tooltip
          ellipsis
        />
        <a-table-column title="创建时间" data-index="createTime" :width="160" />
        <a-table-column
          title="创建人"
          data-index="createBy"
          :width="100"
          tooltip
          ellipsis
        />

        <a-table-column
          title="操作"
          align="center"
          :width="120"
          fixed="right"
          data-index="operations"
        >
          <template #cell="{ record }">
            <a-space>
              <a-button
                v-permission="'property:modify'"
                @click="crud.openEdit(preHandle(record))"
              >
                修改
              </a-button>
              <a-popconfirm
                content="确认删除该项?"
                @ok="crud.deleteByIds([record.id])"
              >
                <a-button v-permission="'property:remove'" status="danger">
                  删除
                </a-button>
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
      <a-form-item field="referenceKey" label="访问键">
        <a-input v-model="crud.form.referenceKey" placeholder="请输入访问键" />
      </a-form-item>
      <a-form-item field="valueType" label="值类型">
        <a-radio-group v-model="crud.form.valueType" type="button">
          <a-radio value="STR">字符串</a-radio>
          <a-radio value="NUMBER">数字</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item field="value" label="配置值" :rules="valueRules">
        <a-input-number
          v-if="crud.form.valueType === 'NUMBER'"
          v-model="crud.form.value"
          placeholder="请输入配置值"
        />
        <a-input v-else v-model="crud.form.value" placeholder="请输入配置值" />
      </a-form-item>
      <a-form-item field="description" label="描述">
        <a-textarea
          v-model="crud.form.description"
          placeholder="输入描述信息"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import useCrud from '@/components/crud'
import { computed } from 'vue'
export default {
  name: 'PropertyPage',
  setup() {
    const { crud, formComponent } = useCrud({
      uri: '/api/properties',
      title: '系统属性',
      defaultForm: {
        valueType: 'STR'
      },
      defaultSort: ['id,desc']
    })

    const colors = {
      STR: 'green',
      NUMBER: 'red'
    }
    const types = {
      STR: '字符串',
      NUMBER: '数字'
    }

    const formRules = {
      referenceKey: [
        { required: true, message: '缺少键' },
        { minLength: 2, maxLength: 255, message: '长度位2个字符到255之间' }
      ],
      valueType: [{ required: true, message: '缺少值类型' }],
      description: [
        { minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }
      ]
    }

    const valueRules = computed(() =>
      crud.form.valueType === 'STR'
        ? [{ minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }]
        : [{ required: true, message: '缺少值' }]
    )

    const preHandle = (record) => {
      const data = { ...record }
      if (record.valueType === 'NUMBER') {
        data.value = parseInt(record.value)
      }
      return data
    }

    return {
      crud,
      colors,
      types,
      formRules,
      formComponent,
      valueRules,
      preHandle
    }
  }
}
</script>
