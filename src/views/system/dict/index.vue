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
        <a-table-column title="标题" data-index="title" />
        <a-table-column title="图标" data-index="icon">
          <template #cell="{ record }">
            <component :is="record.icon" />
            {{ record.icon }}
          </template>
        </a-table-column>

        <a-table-column title="序号" data-index="orderNo" />
        <a-table-column title="类型" data-index="type">
          <template #cell="{ record }">
            <a-tag :color="colors[record.type]">{{ types[record.type] }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="路径" data-index="path" />
        <a-table-column title="缓存" data-index="cacheable">
          <template #cell="{ record }">
            <a-tag color="green" v-if="record.cacheable">开启</a-tag>
            <a-tag v-else>禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="hide">
          <template #cell="{ record }">
            <a-tag v-if="record.hide">隐藏</a-tag>
            <a-tag v-else color="green">显示</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="权限" data-index="perm" />

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
      <a-form-item field="title" label="标题">
        <a-input v-model="crud.form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="parentId" label="上级">
        <a-tree-select
          v-model="crud.form.parentId"
          :data="formMenus"
          placeholder="请选择上级菜单"
        />
      </a-form-item>

      <a-form-item field="icon" label="图标">
        <a-input v-model="crud.form.icon" placeholder="请输入图标" />
      </a-form-item>
      <a-form-item field="orderNo" label="序号">
        <a-input-number v-model="crud.form.orderNo" placeholder="请输入序号" />
      </a-form-item>
      <a-form-item field="type" label="类型">
        <a-select v-model="crud.form.type" placeholder="请选择类型">
          <a-option value="CATEGORY">{{ types.CATEGORY }}</a-option>
          <a-option value="MENU">{{ types.MENU }}</a-option>
          <a-option value="LINK">{{ types.LINK }}</a-option>
          <a-option value="BUTTON">{{ types.BUTTON }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="requiredPath" field="path" label="路径">
        <a-input v-model="crud.form.path" placeholder="请输入路径" />
      </a-form-item>
      <a-form-item field="perm" label="权限">
        <a-input v-model="crud.form.perm" placeholder="请输入权限" />
      </a-form-item>
      <a-form-item field="cacheable" label="缓存">
        <a-switch v-model="crud.form.cacheable" />
      </a-form-item>
      <a-form-item field="hide" label="隐藏">
        <a-switch v-model="crud.form.hide" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import useCrud from '@/components/crud'
import { computed, ref, h } from 'vue'
export default {
  name: 'Menu',
  setup() {
    const { crud, formComponent } = useCrud({
      uri: '/api/menus',
      title: '菜单',
      defaultForm: {
        type: 'CATEGORY'
      }
    })

    const colors = {
      CATEGORY: 'red',
      MENU: 'orangered',
      LINK: 'orange',
      BUTTON: 'gold'
    }
    const types = {
      CATEGORY: '分类',
      MENU: '菜单',
      LINK: '外链',
      BUTTON: '按钮'
    }
    const requiredPath = computed(() => {
      return ['MENU', 'LINK'].includes(crud.form.type)
    })

    const formRules = ref({
      title: [
        { required: true, message: '缺少标题' },
        { minLength: 2, maxLength: 255, message: '长度位2个字符到255之间' }
      ],
      orderNo: [{ required: true, message: '缺少序号' }],
      path: [
        {
          required: requiredPath,
          message: '菜单和链接该类型缺少路径'
        },
        { minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }
      ],
      perm: [
        { minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }
      ]
    })

    const formMenus = computed(() => {
      const rebuild = (data, collector) => {
        for (const item of data) {
          const node = {
            key: item.id,
            title: item.title,
            children: [],
            disabled: ['BUTTON', 'LINK'].includes(item.type),
            icon: () => h(item.icon)
          }
          collector.push(node)
          if (item.children && item.children.length) {
            rebuild(item.children, node.children)
          }
        }
      }

      const result = []
      rebuild(crud.data, result)
      return result
    })

    return {
      crud,
      colors,
      types,
      formRules,
      requiredPath,
      formComponent,
      formMenus
    }
  }
}
</script>
