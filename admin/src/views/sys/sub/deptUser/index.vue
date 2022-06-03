<template>
  <BasicTable @register="registerTable" class="w-full" :searchInfo="searchInfo">
    <template #toolbar>
      <a-button type="primary" @click="handleCreate">新增账号</a-button>
    </template>
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑用户资料',
            onClick: handleEdit.bind(null, record),
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            tooltip: '删除此账号',
            popConfirm: {
              title: '是否确认删除',
              confirm: handleDelete.bind(null, record),
            },
          },
          {
            icon: 'ant-design:user-switch-outlined',
            tooltip: '设置部门角色',
            onClick: handDeptRole.bind(null, record),
          },
        ]"
      />
    </template>
  </BasicTable>
  <DeptUserDrawer @register="permRegisterDrawer" @success="success" />
</template>

<script lang="ts" name="DeptUser" setup>
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { useDrawer } from '@/components/Drawer'
import { useMessage } from '@/hooks/web/useMessage'
import { columns, searchFormSchema } from './deptUser.data'
import { reactive, watch } from 'vue'

import DeptUserDrawer from './DeptUserDrawer.vue'
import { delUser } from '@service/sys/user'
import { getSubDeptUserList } from '@service/sys/myDept'

const props = defineProps({
  deptId: Number,
})

const emit = defineEmits(['handDeptRole'])

const [permRegisterDrawer, { openDrawer }] = useDrawer()
const [registerTable, { reload }] = useTable({
  title: '账号列表',
  api: getSubDeptUserList,
  rowKey: 'id',
  columns,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  useSearchForm: true,
  showTableSetting: true,
  striped: false,
  bordered: true,
  handleSearchInfoFn(info) {
    return info
  },
  actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
})

const { createMessage } = useMessage()

/** 新增按钮 */
function handleCreate() {
  if (props.deptId && props.deptId != -1) {
    openDrawer(true, {
      isUpdate: false,
    })
  } else {
    createMessage.error('未选择部门,请先选择部门')
  }
}

/** 编辑按钮 */
function handleEdit(record: Recordable) {
  openDrawer(true, {
    record,
    isUpdate: true,
  })
}

/** 删除按钮 */
function handleDelete(record: Recordable) {
  delUser(record.id).then(() => {
    reload()
  })
}

function handDeptRole(record: Recordable) {
  emit('handDeptRole', record.id)
}

/** 携带的搜索参数 */
const searchInfo = reactive<Recordable>({ deptId: -1 })

// 选择部门后重新获取用户列表
watch(props, () => {
  if (props.deptId) {
    searchInfo.deptId = props.deptId
    reload()
  }
})

const success = () => {
  reload()
}
</script>

<style lang="less" scoped></style>
