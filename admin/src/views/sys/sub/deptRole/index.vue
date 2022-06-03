<template>
  <Empty v-show="props.deptId === -1" description="请先选择部门" />
  <BasicTable
    v-show="props.deptId !== -1"
    @register="registerTable"
    :search-info="searchInfo"
  >
    <template #toolbar>
      <a-button type="primary" @click="handleCreate"> 新增部门角色</a-button>
    </template>
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            onClick: handleEdit.bind(null, record),
          },
          {
            icon: 'ant-design:delete-outlined',
            tooltip: '删除',
            color: 'error',
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
            onClick: handlePerm.bind(null, record),
          },
        ]"
      />
    </template>
  </BasicTable>
  <DeptRoleDrawer @register="registerDrawer" @success="handleSuccess" />
  <DeptRolePermTree @register="registerDeptRolePermTreeDrawer" />
</template>

<script lang="ts" setup name="DeptRole">
import { reactive, watch } from 'vue'
import { Empty } from 'ant-design-vue'
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { useDrawer } from '@/components/Drawer'

import DeptRoleDrawer from './DeptRoleDrawer.vue'
import DeptRolePermTree from './DeptRolePermTree.vue'

import { delDeptRole, getDeptRolePage } from '@service/sys/myDept'
import { columns, searchFormSchema } from './deptRole.data'

const [registerDrawer, { openDrawer }] = useDrawer()
const [
  registerDeptRolePermTreeDrawer,
  { openDrawer: openDeptRolePermTreeDrawer },
] = useDrawer()

const props = defineProps({
  deptId: Number,
})

/** 携带的搜索参数 */
const searchInfo = reactive<Recordable>({})

const [registerTable, { reload }] = useTable({
  title: '角色列表',
  api: getDeptRolePage,
  columns,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
  },
  handleSearchInfoFn(info) {
    return info
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  striped: false,
  showIndexColumn: false,
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

function handleDelete(record: Recordable) {
  delDeptRole(record.id).then(() => reload())
}

function handleSuccess() {
  reload()
}

function handlePerm(record: Recordable) {
  openDeptRolePermTreeDrawer(true, {
    deptRoleId: record.id,
    deptId: props.deptId,
  })
}

// 选择部门后重新获取用户列表
watch(props, () => {
  if (props.deptId) {
    searchInfo.deptId = props.deptId
    reload()
  }
})
</script>

<style lang="less" scoped></style>
