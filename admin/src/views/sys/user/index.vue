<template>
  <PageWrapper
    dense
    contentFullHeight
    contentClass="flex flex-col lg:flex-row overflow-scroll"
  >
    <UserDeptTree class="w-full lg:w-1/6" @select="handleSelect" />
    <BasicTable
      @register="registerTable"
      class="w-full lg:w-5/6"
      :searchInfo="searchInfo"
    >
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
          ]"
        />
      </template>
    </BasicTable>
    <UserDrawer @register="permRegisterDrawer" @success="success" />
  </PageWrapper>
</template>
<script lang="ts" setup name="User">
import { PageWrapper } from '@/components/Page'
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { useDrawer } from '@/components/Drawer'
import UserDeptTree from './UserDeptTree.vue'
import UserDrawer from './UserDrawer.vue'
import { columns, searchFormSchema } from './user.data'
import { reactive } from 'vue'
import { delUser, getUserList } from '@service/sys/user'

const [permRegisterDrawer, { openDrawer }] = useDrawer()
const [registerTable, { reload }] = useTable({
  title: '账号列表',
  api: getUserList,
  rowKey: 'id',
  columns,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  useSearchForm: true,
  showTableSetting: true,
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

/** 新增按钮 */
function handleCreate() {
  openDrawer(true, {
    isUpdate: false,
  })
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

/** 携带的搜索参数 */
const searchInfo = reactive<Recordable>({})

/** 选择部门后 */
const handleSelect = (key: number) => {
  searchInfo.deptId = key
  reload()
}

const success = () => {
  reload()
}
</script>
