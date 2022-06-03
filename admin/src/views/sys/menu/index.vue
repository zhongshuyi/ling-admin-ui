<template>
  <PageWrapper
    dense
    contentFullHeight
    contentClass="flex flex-col lg:flex-row h-full p-4"
  >
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'ant-design:plus-outlined',
              tooltip: '增加下级',
              onClick: handleAddSub.bind(null, record),
              ifShow: record.menuType !== MenuType.BUTTON,
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
                placement: 'left',
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="Menu">
import { ref } from 'vue'
import { PageWrapper } from '@/components/Page'
import { BasicTable, TableAction, useTable } from '@/components/Table'
import MenuDrawer from './MenuDrawer.vue'

import {
  checkMenuHasChildren,
  delMenu,
  getMenuList,
} from '@admin/service/modules/sys/menu'

import { MenuType } from '@admin/tokens'
import {
  GetMenuListResultModel,
  MenuParams,
} from '@admin/service/modules/model/sys/menu'

import { columns, filter, searchFormSchema } from './menu.data'

import { useDrawer } from '@/components/Drawer'

import { useMessage } from '@/hooks/web/useMessage'

const { createConfirm } = useMessage()

const params = ref<MenuParams>({})

const afterFetch = (v: GetMenuListResultModel) => {
  if (params.value.title || params.value.status) {
    const result: GetMenuListResultModel = []
    filter(v, params.value, result)
    return result
  } else {
    return v
  }
}

const beforeFetch = (v: MenuParams) => {
  params.value = v
}

const [registerDrawer, { openDrawer }] = useDrawer()
const [registerTable, { reload }] = useTable({
  title: '菜单列表',
  api: getMenuList,
  columns,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
  },
  searchInfo: params,
  afterFetch,
  beforeFetch,
  isTreeTable: true,
  pagination: false,
  striped: false,
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  showIndexColumn: false,
  canResize: false,
  actionColumn: {
    width: 120,
    align: 'right',
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
    fixed: undefined,
  },
})

/**
 * 点击添加菜单回调
 */
const handleCreate = () => {
  openDrawer(true, {
    isUpdate: false,
  })
}

/**
 * 点击添加菜单回调
 */
const handleAddSub = (record: Recordable) => {
  openDrawer(true, {
    isUpdate: false,
    parentId: record.id,
  })
}

/**
 * 点击编辑回调
 */
const handleEdit = (record: Recordable) => {
  openDrawer(true, {
    record,
    isUpdate: true,
  })
}

/**
 * 点击删除后操作
 */
const handleDelete = (record: Recordable) => {
  checkMenuHasChildren(record.id).then((v) => {
    if (v) {
      createConfirm({
        title: () => '提示',
        content: () => '该菜单有子菜单,确认全部删除吗?',
        iconType: 'warning',
        onOk: () => {
          delMenu(record.id).then(() => {
            reload()
          })
        },
        mask: true,
        maskClosable: true,
      })
    } else {
      delMenu(record.id).then(() => {
        reload()
      })
    }
  })
}

/**
 * 增加/修改 表单提交后
 */
const handleSuccess = () => {
  reload()
}

/**
 * 加载成功后
 */
const onFetchSuccess = () => {
  // 演示默认展开所有表项
  // nextTick(expandAll)
}
</script>
<style lang="less"></style>
