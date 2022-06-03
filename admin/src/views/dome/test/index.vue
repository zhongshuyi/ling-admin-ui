<template>
  <PageWrapper
    dense
    contentFullHeight
    contentClass="flex flex-col lg:flex-row overflow-scroll"
  >
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增示例</a-button>
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
        />
      </template>
    </BasicTable>
    <DomeDrawer @register="registerDrawer" @success="success" />
  </PageWrapper>
</template>
<script lang="ts" setup name="Dome">
import { PageWrapper } from '@/components/Page'
import { BasicTable, TableAction, useTable } from '@/components/Table'
import { useDrawer } from '@/components/Drawer'

import DomeDrawer from './DomeDrawer.vue'
import { delTestDome, getDomeListPage } from '@service/demo/testDome'
import { columns, searchFormSchema } from '@/views/dome/test/test.data'

const [registerDrawer, { openDrawer }] = useDrawer()
const [registerTable, { reload }] = useTable({
  title: 'dome列表',
  api: getDomeListPage,
  columns,
  formConfig: {
    labelWidth: 100,
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

const handleCreate = () => {
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
  delTestDome(record.id).then(() => {
    reload()
  })
}

const success = () => {
  reload()
}
</script>
<style lang="less" scoped></style>
