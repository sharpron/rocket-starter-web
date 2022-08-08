<template>
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
            <a-col :span="8">
              <a-form-item field="description" label="内容">
                <a-input
                  v-model="crud.query.description"
                  allow-clear
                  placeholder="输入用户名查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="spendTime" label="时间">
                <number-range v-model="crud.query.spendTime" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="status" label="状态">
                <a-select
                  allow-clear
                  v-model="crud.query.status"
                  placeholder="选择状态进行查询"
                >
                  <a-option value="OK">成功</a-option>
                  <a-option value="FAIL">失败</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="clientIp" label="客户端IP">
                <a-input
                  allow-clear
                  v-model="crud.query.clientIp"
                  placeholder="输入客户端IP地址查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="clientRegion" label="位置">
                <a-input
                  v-model="crud.query.clientRegion"
                  allow-clear
                  placeholder="输入位置查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="userAgent" label="浏览器">
                <a-input
                  v-model="crud.query.userAgent"
                  allow-clear
                  placeholder="输入浏览器信息查询"
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
      :data="crud.data"
      :bordered="false"
      @page-change="crud.onPageChange"
      @page-size-change="crud.onPageSizeChange"
      :row-selection="crud.rowSelection"
    >
      <template #columns>
        <a-table-column
          title="内容"
          tooltip
          :width="180"
          data-index="description"
        />
        <a-table-column title="参数" tooltip ellipsis data-index="params" />
        <a-table-column title="间隔(ms)" data-index="spendTime" />
        <a-table-column title="时间" :width="180" data-index="status">
          <template #cell="{ record }">
            {{ parseTime(record.createTime) }}
          </template>
        </a-table-column>

        <a-table-column title="状态" :width="120" data-index="status">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 'OK'" color="green">正常</a-tag>
            <a-tag v-else color="red">失败</a-tag>
          </template>
        </a-table-column>
        <a-table-column
          title="客户端IP"
          :width="140"
          data-index="clientIp"
          tooltip
        />
        <a-table-column
          title="客户端位置"
          data-index="clientRegion"
          tooltip
          ellipsis
        />
        <a-table-column
          title="浏览器"
          data-index="userAgent"
          ellipsis
          tooltip
        />
      </template>
    </a-table>
  </a-card>
</template>

<script>
import useCrud from '@/components/crud'
import NumberRange from '@/components/number-range/index.vue'
import { parseTime } from '@/utils/time'
export default {
  name: 'LogPage',
  setup() {
    const { crud } = useCrud({
      uri: '/api/logs',
      title: '日志'
    })
    return {
      crud,
      parseTime
    }
  },
  components: { NumberRange }
}
</script>
