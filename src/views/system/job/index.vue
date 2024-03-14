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
              <a-form-item field="name" label="任务名称">
                <a-input
                  v-model="crud.query.name"
                  allow-clear
                  placeholder="输入任务名称查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="enabled" label="状态">
                <a-select
                  v-model="crud.query.enabled"
                  allow-clear
                  placeholder="选择状态查询"
                >
                  <a-option value="true">启用</a-option>
                  <a-option value="false">未启用</a-option>
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
          <a-button
            v-permission="'job:create'"
            type="primary"
            @click="crud.openAdd"
          >
            <template #icon>
              <icon-plus />
            </template>
            新增
          </a-button>
          <a-button
            v-permission="'job:remove'"
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
        <a-table-column title="任务名称" data-index="name" />
        <a-table-column title="运行BEAN" data-index="runnableBeanName" />
        <a-table-column title="运行参数" data-index="params" />
        <a-table-column title="执行时间(cron)" data-index="cronExpression" />

        <a-table-column title="状态" :width="120" data-index="enabled">
          <template #cell="{ record }">
            <a-tag v-if="record.enabled" color="green">启用</a-tag>
            <a-tag v-else>未启用</a-tag>
          </template>
        </a-table-column>

        <a-table-column
          title="描述"
          data-index="description"
          tooltip
          ellipsis
        />

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
          fixed="right"
          :width="220"
          align="center"
          data-index="operations"
        >
          <template #cell="{ record }">
            <a-space>
              <a-button
                v-permission="'job:modify'"
                @click="crud.openEdit(record)"
              >
                修改
              </a-button>
              <a-button
                v-permission="'job:modify'"
                status="danger"
                @click="openModifyPass(record)"
                >{{ record.enabled ? '禁用' : '启用' }}</a-button
              >
              <a-button
                v-permission="'job:execute'"
                status="danger"
                @click="openModifyPass(record)"
                >立即执行</a-button
              >
              <a-popconfirm
                content="确认删除该项?"
                @ok="crud.deleteByIds([record.id])"
              >
                <a-button v-permission="'job:remove'" status="danger">
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
      <a-form-item field="name" label="任务名称">
        <a-input v-model="crud.form.name" placeholder="请输入任务名称" />
      </a-form-item>
      <a-form-item field="runnableBeanName" label="BEAN">
        <a-input
          v-model="crud.form.runnableBeanName"
          placeholder="请输入可运行BEAN"
        />
      </a-form-item>
      <a-form-item field="params" label="参数">
        <a-input-number v-model="crud.form.params" placeholder="请输入参数" />
      </a-form-item>
      <a-form-item field="cronExpression" label="(cron)">
        <a-input-number
          v-model="crud.form.cronExpression"
          placeholder="请输入cron表达式"
        />
      </a-form-item>
      <a-form-item field="enabled" label="是否启用">
        <a-switch v-model="crud.form.enabled" />
      </a-form-item>
      <a-form-item field="description" label="描述">
        <a-textarea
          v-model="crud.form.description"
          placeholder="这里输入描述信息"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import useCrud from '@/components/crud'
export default {
  name: 'JobPage',
  setup() {
    const { crud, formComponent } = useCrud({
      uri: '/api/jobs',
      title: '定时任务'
    })

    const formRules = {
      name: [
        { required: true, message: '缺少名称' },
        { minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }
      ],
      runnableBeanName: [{ required: true, message: '缺少可运行BEAN' }],
      params: [{ maxLength: 255, message: '长度在最大255之间' }],
      cronExpression: [
        { required: true, message: '缺少执行时机(cron)' },
        { minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }
      ],
      description: [
        { minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }
      ]
    }

    return {
      crud,
      formRules,
      formComponent
    }
  }
}
</script>
