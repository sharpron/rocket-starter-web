<template>
  <a-card :bordered="false" style="min-height: 1000px">
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
              <a-form-item field="username" label="用户名">
                <a-input
                  v-model="crud.query.username"
                  placeholder="输入用户名查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="nickname" label="昵称">
                <a-input
                  v-model="crud.query.nickname"
                  placeholder="输入昵称查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="mobile" label="号码">
                <a-input
                  v-model="crud.query.mobile"
                  placeholder="输入号码查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="email" label="邮箱">
                <a-input
                  v-model="crud.query.email"
                  placeholder="输入邮箱查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="deptId" label="部门">
                <a-input
                  v-model="crud.query.deptId"
                  placeholder="输入部门查询"
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
    >
      <template #columns>
        <a-table-column title="用户名" data-index="username" />
        <a-table-column title="昵称" data-index="nickname" />
        <a-table-column title="部门" data-index="deptName" />

        <a-table-column title="锁定状态" :width="120" data-index="locked">
          <template #cell="{ record }">
            <a-tag v-if="record.locked">锁定</a-tag>
            <a-tag v-else color="green">正常</a-tag>
          </template>
        </a-table-column>

        <a-table-column title="禁用状态" :width="120" data-index="disabled">
          <template #cell="{ record }">
            <a-tag v-if="record.disabled">禁用</a-tag>
            <a-tag v-else color="green">正常</a-tag>
          </template>
        </a-table-column>

        <a-table-column
          title="操作"
          fixed="right"
          :width="220"
          align="center"
          data-index="operations"
        >
          <template #cell="{ record }">
            <a-space>
              <a-button @click="crud.openEdit(record)"> 修改 </a-button>
              <a-button status="danger" @click="openModifyPass(record)"
                >改密</a-button
              >
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
      <a-form-item field="username" label="用户名">
        <a-input v-model="crud.form.username" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="nickname" label="昵称">
        <a-input v-model="crud.form.nickname" placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item field="mobile" label="手机号">
        <a-input-number v-model="crud.form.mobile" placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item field="email" label="邮箱">
        <a-input-number v-model="crud.form.email" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item field="locked" label="是否锁定">
        <a-switch v-model="crud.form.locked" />
      </a-form-item>
      <a-form-item field="disabled" label="是否禁用">
        <a-switch v-model="crud.form.disabled" />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:visible="modifyPass.visible"
    :title="`修改用户（${modifyPass.form.username}）密码`"
    :ok-loading="modifyPass.okLoading"
    :on-before-ok="confirmModifyPass"
  >
    <a-form
      ref="modifyFormComponent"
      :model="modifyPass.form"
      :rules="modifyPass.rules"
    >
      <a-form-item field="newPass" label="新密码">
        <a-input v-model="modifyPass.form.newPass" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item
        field="confirmPass"
        label="确认密码"
        :rules="[
          { required: true, message: '缺少确认密码' },
          { value: modifyPass.form.newPass, message: '确认密码不一致' }
        ]"
      >
        <a-input
          v-model="modifyPass.form.confirmPass"
          placeholder="请输入确认密码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import useCrud from '@/components/crud'
import { modifyPass as modifyPassApi } from '@/api/system/user'
import { computed, reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
export default {
  name: 'MenuPage',
  setup() {
    const { crud, formComponent } = useCrud({
      uri: '/api/users',
      title: '菜单'
    })

    const formRules = ref({
      username: [
        { required: true, message: '缺少用户名' },
        { minLength: 2, maxLength: 255, message: '长度位2个字符到255之间' }
      ],
      orderNo: [{ required: true, message: '缺少序号' }],
      perm: [
        { minLength: 2, maxLength: 255, message: '长度在2个字符到255之间' }
      ]
    })

    const modifyPass = reactive({
      form: {
        username: null,
        newPass: null,
        confirmPass: null
      },
      rules: {
        newPass: [
          { required: true, message: '缺少新密码' },
          { minLength: 6, maxLength: 255, message: '长度位2个字符到255之间' }
        ]
      },
      visible: false,
      okLoading: false
    })

    const openModifyPass = (user) => {
      modifyPass.form.username = user.username
      modifyPass.visible = true
    }

    const modifyFormComponent = ref()

    const confirmModifyPass = async () => {
      const errors = await modifyFormComponent.value.validate()
      if (errors) return

      modifyPass.okLoading = true
      modifyPassApi(modifyPass.form)
        .then(() => {
          Message.success('修改成功')
        })
        .finally(() => {
          modifyPass.okLoading = false
        })
    }

    return {
      crud,
      formRules,
      formComponent,
      modifyPass,
      openModifyPass,
      modifyFormComponent,
      confirmModifyPass
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
