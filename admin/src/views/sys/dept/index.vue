<template>
  <PageWrapper
    dense
    contentFullHeight
    contentClass="flex flex-col lg:flex-row overflow-scroll"
  >
    <BasicTable
      @register="registerTable"
      class="m-4"
      @fetch-success="onFetchSuccess"
    >
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">新增部门</a-button>
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
              icon: 'ant-design:plus-outlined',
              tooltip: '增加下级',
              onClick: handleAdd.bind(null, record.id),
            },
            {
              icon: 'ant-design:lock-outlined',
              tooltip: '部门权限',
              onClick: handleDeptPerm.bind(null, record.id),
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
    <DeptDrawer @register="deptRegisterDrawer" @success="success" />
    <DeptPermDrawer @register="deptPermRegisterDrawer" @success="success" />
  </PageWrapper>
</template>

<script lang="ts" setup name="Test">
import { PageWrapper } from '@/components/Page'
import { BasicTable, TableAction, useTable } from '@/components/Table'

import { useDrawer } from '@/components/Drawer'
import DeptDrawer from './DeptDrawer.vue'
import DeptPermDrawer from './DeptPermDrawer.vue'

import { columns } from './dept.data'

import { checkDeptHasChildren, delDept, getDeptList } from '@service/sys/dept'
import { useMessage } from '@/hooks/web/useMessage'
import { nextTick } from 'vue'

const { createConfirm } = useMessage()

const [deptRegisterDrawer, { openDrawer }] = useDrawer()
const [deptPermRegisterDrawer, { openDrawer: openDeptPermDrawer }] = useDrawer()
const [registerTable, { reload, getDataSource, expandAll }] = useTable({
  title: '部门管理',
  isTreeTable: true,
  pagination: false,
  striped: false,
  api: getDeptList,
  rowKey: 'id',
  columns,
  useSearchForm: false,
  showTableSetting: true,
  bordered: true,
  handleSearchInfoFn(info) {
    return info
  },
  actionColumn: {
    width: 160,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
})

const handleAdd = (id = -1) => {
  openDrawer(true, {
    parentId: id,
    deptTree: getDataSource(),
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
  checkDeptHasChildren(record.id).then((v) => {
    let message = ''
    if (v) {
      message = '该部门有子部门,确认全部删除吗?'
    } else {
      message = '确认删除该部门吗'
    }
    createConfirm({
      title: () => '提示',
      content: () => message,
      onOk: () => {
        delDept(record.id).then(() => {
          reload()
        })
      },
      iconType: 'warning',
      mask: true,
      maskClosable: true,
    })
  })
}

function handleDeptPerm(deptId: number) {
  openDeptPermDrawer(true, {
    deptId,
  })
}

const success = () => {
  reload()
}

/**
 * 加载成功后
 */
const onFetchSuccess = () => {
  // 演示默认展开所有表项
  nextTick(expandAll)
}
</script>

<style lang="less" scoped></style>
