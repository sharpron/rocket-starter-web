<template>
  <a-card :bordered="false" style="min-height: 100%">
    <a-row v-if="queryColumns.length">
      <a-col :flex="1">
        <a-form
          :model="crud.query"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-row :gutter="16">
            <a-col
              v-for="(queryColumn, index) in queryColumns"
              :key="index"
              :span="8"
            >
              <a-form-item
                :field="queryColumn.editField || queryColumn.dataIndex"
                :label="queryColumn.title"
              >
                <a-select
                  v-if="queryColumn.inputType === 'SELECT'"
                  v-model="
                    crud.query[queryColumn.editField || queryColumn.dataIndex]
                  "
                  :placeholder="'选择' + queryColumn.title + '进行查询'"
                  allow-clear
                >
                  <a-option
                    v-for="option in queryColumn.options || []"
                    :key="option.value"
                    :value="option.value"
                    >{{ option.label }}</a-option
                  >
                </a-select>
                <dict-select
                  v-else-if="queryColumn.inputType === 'DICT'"
                  v-model="
                    crud.query[queryColumn.editField || queryColumn.dataIndex]
                  "
                  :dict-name="queryColumn.dictName"
                  :placeholder="'选择' + queryColumn.title + '进行查询'"
                />

                <a-range-picker
                  v-else-if="queryColumn.inputType === 'DATE'"
                  v-model="
                    crud.query[queryColumn.editField || queryColumn.dataIndex]
                  "
                  :show-time="queryColumn.showTime || false"
                  value-format="timestamp"
                />

                <a-select
                  v-if="queryColumn.inputType === 'SWITCH'"
                  v-model="
                    crud.query[queryColumn.editField || queryColumn.dataIndex]
                  "
                  :placeholder="'选择' + queryColumn.title + '进行查询'"
                  allow-clear
                >
                  <a-option
                    v-for="option in queryColumn.options || [
                      { value: 'true', label: '是' },
                      { value: 'false', label: '否' }
                    ]"
                    :key="option.value"
                    :value="option.value"
                    >{{ option.label }}</a-option
                  >
                </a-select>

                <a-input
                  v-else-if="
                    !queryColumn.inputType ||
                    queryColumn.inputType === 'TEXTAREA'
                  "
                  v-model="
                    crud.query[queryColumn.editField || queryColumn.dataIndex]
                  "
                  :placeholder="'输入' + queryColumn.title + '进行查询'"
                />
                <component
                  v-else
                  :is="components[queryColumn.inputType]"
                  v-model="
                    crud.query[queryColumn.editField || queryColumn.dataIndex]
                  "
                  :placeholder="'输入' + queryColumn.title + '进行查询'"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-divider
        :style="{ height: Math.ceil(queryColumns.length / 3) * 42 + 'px' }"
        direction="vertical"
      />
      <a-col
        :flex="queryColumns.length > 3 ? '86px' : '180px'"
        style="text-align: right"
      >
        <a-space
          :size="18"
          :direction="queryColumns.length > 3 ? 'vertical' : 'horizontal'"
        >
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
          <slot name="tool-left"></slot>
          <a-button
            type="primary"
            v-permission="permissionPrefix + ':create'"
            @click="crud.openAdd"
          >
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
          <a-button
            type="primary"
            status="danger"
            v-permission="permissionPrefix + ':remove'"
            :disabled="crud.selectedKeys.length === 0"
            :loading="crud.deleteLoading"
            @click="crud.batchDelete"
          >
            <template #icon>
              <icon-minus />
            </template>
            删除
          </a-button>
          <slot name="tool-right"></slot>
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
      default-expand-all-rows
    >
      <template #columns>
        <a-table-column
          v-for="(column, index) in tableColumns"
          :key="index"
          :title="column.title"
          :width="column.width || 120"
          :data-index="column.dataIndex"
          tooltip
          ellipsis
        >
          <template #cell="{ record }">
            <template
              v-if="keyColumns[column.dataIndex].inputType === 'SELECT'"
            >
              <a-tag
                :color="
                  selects[column.dataIndex][record[column.dataIndex]].color
                "
                >{{
                  selects[column.dataIndex][record[column.dataIndex]].label
                }}</a-tag
              >
            </template>
            <file-view
              v-else-if="keyColumns[column.dataIndex].inputType === 'UPLOAD'"
              :value="record[column.dataIndex]"
            />
            <template
              v-else-if="keyColumns[column.dataIndex].inputType === 'SWITCH'"
            >
              {{ record[column.dataIndex] ? '是' : '否' }}
            </template>
            <span v-else>{{ record[column.dataIndex] }}</span>
          </template>
        </a-table-column>

        <a-table-column
          title="修改时间"
          :width="120"
          data-index="modifyTime"
          tooltip
          ellipsis
        >
          <template #cell="{ record }">
            {{ crud.parseTime(record.createTime, '{y}-{m}-{d}') }}
          </template>
        </a-table-column>

        <a-table-column title="修改人" data-index="modifyBy" :width="80" />

        <a-table-column title="创建时间" :width="120" data-index="createTime">
          <template #cell="{ record }">
            {{ crud.parseTime(record.createTime, '{y}-{m}-{d}') }}
          </template>
        </a-table-column>

        <a-table-column title="创建人" data-index="createBy" :width="80" />

        <a-table-column
          title="操作"
          align="center"
          :width="opWidth || 150"
          fixed="right"
          data-index="operations"
        >
          <template #cell="{ record }">
            <a-space>
              <slot name="op-left" :record="record"></slot>
              <a-button
                v-permission="permissionPrefix + ':modify'"
                @click="crud.openEdit(record)"
              >
                修改
              </a-button>
              <a-popconfirm
                content="确认删除该项?"
                @ok="crud.deleteByIds([record.id])"
              >
                <a-button
                  v-permission="permissionPrefix + ':remove'"
                  status="danger"
                >
                  删除
                </a-button>
              </a-popconfirm>
              <slot name="op-right" :record="record"></slot>
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
    :mask-closable="false"
    :width="dialogWidth"
  >
    <a-form ref="formComponent" :model="crud.form">
      <a-form-item
        v-for="(formItem, index) in formItems"
        :key="index"
        :rules="formItem.rules || []"
        :field="formItem.editField || formItem.dataIndex"
        :label="formItem.title"
      >
        <a-select
          v-if="formItem.inputType === 'SELECT'"
          v-model="crud.form[formItem.editField || formItem.dataIndex]"
          :placeholder="'请选择' + formItem.title"
        >
          <a-option
            v-for="option in formItem.options || []"
            :key="option.value"
            :value="option.value"
            >{{ option.label }}</a-option
          >
        </a-select>
        <dict-select
          v-else-if="formItem.inputType === 'DICT'"
          v-model="crud.form[formItem.editField || formItem.dataIndex]"
          :dict-name="formItem.dictName"
          :placeholder="'请选择' + formItem.title"
        />
        <upload
          v-else-if="formItem.inputType === 'UPLOAD'"
          v-model="crud.form[formItem.editField || formItem.dataIndex]"
        />

        <a-date-picker
          v-else-if="formItem.inputType === 'DATE'"
          v-model="crud.form[formItem.editField || formItem.dataIndex]"
          :show-time="formItem.showTime || false"
          :placeholder="'请选择' + formItem.title"
        />

        <a-textarea
          v-else-if="formItem.inputType === 'TEXTAREA'"
          v-model="crud.form[formItem.editField || formItem.dataIndex]"
          :placeholder="'在这里输入' + formItem.title"
        />
        <a-switch
          v-else-if="formItem.inputType === 'SWITCH'"
          v-model="crud.form[formItem.editField || formItem.dataIndex]"
        />

        <a-input
          v-else-if="!formItem.inputType"
          v-model="crud.form[formItem.editField || formItem.dataIndex]"
          :placeholder="'请输入' + formItem.title"
        />
        <component
          v-else
          :is="components[formItem.inputType]"
          v-model="crud.form[formItem.editField || formItem.dataIndex]"
          :placeholder="'请输入' + formItem.title"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import useCrud from '@/components/crud'
import DictSelect from '@/views/system/dict/dict-select.vue'
import Upload from '@/components/file/upload.vue'
import FileView from '@/components/file/view.vue'

import { computed, toRef } from 'vue'
export default {
  name: 'CrudComponent',

  props: {
    options: {
      type: Object,
      required: true
    },
    permissionPrefix: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    components: {
      type: Object,
      default: () => ({})
    },
    dialogWidth: {
      type: Number,
      default: null
    },
    opWidth: {
      type: Number,
      default: null
    }
  },
  setup(props) {
    const { crud, formComponent } = useCrud(props.options)
    const columns = toRef(props, 'columns')
    const tableColumns = computed(() => {
      return columns.value.filter((e) => e.dataIndex || false)
    })

    const queryColumns = computed(() => {
      return tableColumns.value.filter((e) => e.query || false)
    })

    const keyColumns = computed(() => {
      return columns.value.reduce((p, v) => ({ ...p, [v.dataIndex]: v }), {})
    })

    const selects = computed(() => {
      const selectOption = {}
      columns.value.forEach((e) => {
        if (e.inputType === 'SELECT') {
          const optionMap = {}
          e.options.forEach((option) => {
            optionMap[option.value] = option
          })
          selectOption[e.dataIndex] = optionMap
        }
      })
      return selectOption
    })

    const formItems = computed(() => {
      return columns.value.filter((e) => e.edit !== false)
    })

    return {
      crud,
      formComponent,
      tableColumns,
      queryColumns,
      formItems,
      selects,
      keyColumns
    }
  },
  components: { DictSelect, Upload, FileView }
}
</script>
