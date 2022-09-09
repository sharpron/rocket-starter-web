<template>
  <a-row :gutter="20">
    <a-col :span="12">
      <a-card :bordered="false">
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="crud.query"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item field="name" label="引用名称">
                    <a-input
                      v-model="crud.query.name"
                      allow-clear
                      placeholder="输入引用名称查询"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
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
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <a-space direction="vertical" :size="18">
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
          @row-click="onClickDict"
        >
          <template #columns>
            <a-table-column
              title="引用名称"
              data-index="name"
              :width="120"
              tooltip
              ellipsis
            />
            <a-table-column
              title="描述"
              data-index="description"
              :width="100"
              tooltip
              ellipsis
            />

            <a-table-column
              title="修改时间"
              data-index="modifyTime"
              tooltip
              ellipsis
            >
              <template #cell="{ record }">
                {{ crud.parseTime(record.createTime, '{y}-{m}-{d}') }}
              </template>
            </a-table-column>

            <a-table-column
              title="修改人"
              data-index="modifyBy"
              :width="80"
              tooltip
              ellipsis
            />

            <a-table-column
              title="创建时间"
              data-index="createTime"
              tooltip
              ellipsis
            >
              <template #cell="{ record }">
                {{ crud.parseTime(record.createTime, '{y}-{m}-{d}') }}
              </template>
            </a-table-column>

            <a-table-column
              title="创建人"
              data-index="createBy"
              :width="80"
              tooltip
              ellipsis
            />
            <a-table-column
              title="操作"
              align="center"
              fixed="right"
              :width="140"
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
          <a-form-item field="name" label="引用名称">
            <a-input v-model="crud.form.name" placeholder="请输入引用名称" />
          </a-form-item>
          <a-form-item field="description" label="描述">
            <a-input v-model="crud.form.description" placeholder="请输入描述" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-col>

    <a-col :span="12">
      <a-card :bordered="false">
        <a-row>
          <a-col :flex="1">
            <a-form
              :model="crud.query"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item field="name" label="引用名称">
                    <a-input
                      v-model="crud.query.name"
                      allow-clear
                      placeholder="输入引用名称查询"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item field="disabled" label="状态">
                    <a-select
                      allow-clear
                      v-model="crud.query.disabled"
                      placeholder="选择状态查询"
                    >
                      <a-option value="true">禁用</a-option>
                      <a-option value="false">正常</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <a-space direction="vertical" :size="18">
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
              <a-button type="primary" @click="dictItemCrud.openAdd">
                <template #icon>
                  <icon-plus />
                </template>
                新增
              </a-button>
              <a-button
                type="primary"
                status="danger"
                :disabled="dictItemCrud.selectedKeys.length === 0"
                :loading="dictItemCrud.deleteLoading"
                @click="dictItemCrud.batchDelete"
              >
                <template #icon>
                  <icon-minus />
                </template>
                删除
              </a-button>
            </a-space>
          </a-col>
          <a-col :span="8" style="text-align: right">
            <a-button
              @click="dictItemCrud.exportData"
              :loading="dictItemCrud.exportLoading"
            >
              <template #icon>
                <icon-download />
              </template>
              导出
            </a-button>
          </a-col>
        </a-row>
        <a-table
          row-key="id"
          :loading="dictItemCrud.dataLoading"
          :pagination="dictItemCrud.pagination"
          v-model:selectedKeys="dictItemCrud.selectedKeys"
          :data="dictItemCrud.data"
          :bordered="false"
          @page-change="dictItemCrud.onPageChange"
          @page-size-change="dictItemCrud.onPageSizeChange"
          :row-selection="dictItemCrud.rowSelection"
        >
          <template #columns>
            <a-table-column
              title="名称"
              data-index="name"
              :width="120"
              tooltip
              ellipsis
            />
            <a-table-column
              title="值"
              data-index="value"
              :width="120"
              tooltip
              ellipsis
            />
            <a-table-column
              title="序号"
              data-index="orderNo"
              tooltip
              ellipsis
            />
            <a-table-column title="状态" :width="60" data-index="hide">
              <template #cell="{ record }">
                <a-tag v-if="record.disabled">禁用</a-tag>
                <a-tag v-else color="green">正常</a-tag>
              </template>
            </a-table-column>

            <a-table-column
              title="修改时间"
              data-index="modifyTime"
              tooltip
              ellipsis
            >
              <template #cell="{ record }">
                {{ crud.parseTime(record.createTime, '{y}-{m}-{d}') }}
              </template>
            </a-table-column>

            <a-table-column
              title="修改人"
              data-index="modifyBy"
              :width="80"
              tooltip
              ellipsis
            />
            <a-table-column
              title="操作"
              align="center"
              fixed="right"
              :width="140"
              data-index="operations"
            >
              <template #cell="{ record }">
                <a-space>
                  <a-button @click="dictItemCrud.openEdit(record)">
                    修改
                  </a-button>
                  <a-popconfirm
                    content="确认删除该项?"
                    @ok="dictItemCrud.deleteByIds([record.id])"
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
        v-model:visible="dictItemCrud.editDialog"
        :title="dictItemCrud.editTitle"
        :ok-loading="dictItemCrud.saveLoading"
        :on-before-ok="dictItemCrud.save"
      >
        <a-form
          ref="dictItemFormComponent"
          :model="dictItemCrud.form"
          :rules="dictItemFormRules"
        >
          <a-form-item field="name" label="名称">
            <a-input
              v-model="dictItemCrud.form.name"
              placeholder="请输入名称"
            />
          </a-form-item>
          <a-form-item field="value" label="值">
            <a-input v-model="dictItemCrud.form.value" placeholder="请输入值" />
          </a-form-item>
          <a-form-item field="dictId" label="字典">
            <a-select
              v-model="dictItemCrud.form.dictId"
              placeholder="请选择字典"
              allow-clear
            >
              <a-option
                v-for="dict in crud.data"
                :key="dict.id"
                :value="dict.id"
                >{{ dict.name }}</a-option
              >
            </a-select>
          </a-form-item>

          <a-form-item field="disabled" label="禁用">
            <a-switch v-model="dictItemCrud.form.disabled" />
          </a-form-item>
          <a-form-item field="orderNo" label="序号">
            <a-input-number v-model="dictItemCrud.form.orderNo" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-col>
  </a-row>
</template>

<script>
import useCrud from '@/components/crud'
import { ref } from 'vue'
export default {
  name: 'DictPage',
  setup() {
    const { crud, formComponent } = useCrud({
      uri: '/api/dictionaries',
      title: '字典',
      defaultSort: ['id,desc']
    })

    const formRules = ref({
      name: [
        { required: true, message: '缺少引用名称' },
        { maxLength: 255, message: '长度在1个字符到255之间' }
      ],
      description: [
        { required: true, message: '缺少序号' },
        { minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }
      ]
    })

    const defaultForm = {}
    const { crud: dictItemCrud, formComponent: dictItemFormComponent } =
      useCrud({
        uri: '/api/dictionary-items',
        title: '字典项',
        defaultForm
      })

    // dict item form rules.
    const dictItemFormRules = ref({
      name: [
        { required: true, message: '缺少名称' },
        { maxLength: 255, message: '长度在1个字符到255之间' }
      ],
      value: [
        { required: true, message: '缺少值' },
        { maxLength: 255, message: '长度在1个字符到255之间' }
      ],
      dictId: [{ required: true, message: '缺少关联字典' }]
    })

    const onClickDict = (dict) => {
      dictItemCrud.query.dictId = dict.id
      defaultForm.dictId = dict.id
      dictItemCrud.refreshData()
    }

    return {
      crud,
      formComponent,
      formRules,
      onClickDict,

      dictItemCrud,
      dictItemFormComponent,
      dictItemFormRules
    }
  }
}
</script>
