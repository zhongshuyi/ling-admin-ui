<template>
  <PageWrapper
    dense
    contentFullHeight
    contentClass="flex flex-col lg:flex-row h-full p-4"
  >
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: record.id !== 1,
            },
            {
              icon: 'ant-design:delete-outlined',
              tooltip: '删除',
              color: 'error',
              ifShow: record.id !== 1,
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
          :dropDownActions="[
            {
              label: '角色权限',
              icon: 'clarity:note-edit-line',
              ifShow: record.id !== 1,
              onClick: handlePerm.bind(null, record),
            },
            {
              label: '数据权限',
              icon: 'clarity:note-edit-line',
              ifShow: record.id !== 1,
              onClick: handleDataScope.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
    <RolePermTree @register="permRegisterDrawer" />
    <DataScope @register="dataScopeRegisterDrawer" />
  </PageWrapper>
</template>
<script lang="ts" name="RoleManagement" setup>
import { PageWrapper } from '@/components/Page'
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { delRole, getRoleListByPage } from '@admin/service/modules/sys/role'

import { useDrawer } from '@/components/Drawer'
import RoleDrawer from './RoleDrawer.vue'
import RolePermTree from './RolePermTree.vue'
import DataScope from './DataScope.vue'

import { columns, searchFormSchema } from './role.data'

const [registerDrawer, { openDrawer }] = useDrawer()
const [permRegisterDrawer, { openDrawer: permOpenDrawer }] = useDrawer()
const [dataScopeRegisterDrawer, { openDrawer: dataScopePermOpenDrawer }] =
  useDrawer()

const [registerTable, { reload }] = useTable({
  title: '角色列表',
  api: getRoleListByPage,
  columns,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  striped: false,
  actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
    fixed: undefined,
  },
})

function handleCreate() {
  openDrawer(true, {
    isUpdate: false,
  })
}

function handleEdit(record: Recordable) {
  openDrawer(true, {
    record,
    isUpdate: true,
  })
}

function handlePerm(record: Recordable) {
  permOpenDrawer(true, {
    record,
  })
}

function handleDataScope(record: Recordable) {
  dataScopePermOpenDrawer(true, {
    record,
  })
}

function handleDelete(record: Recordable) {
  delRole(record.id).then(() => reload())
}

/**
 * 增加/修改 表单提交后
 */
const handleSuccess = () => {
  reload()
}
</script>
