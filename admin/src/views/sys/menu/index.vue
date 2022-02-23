<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
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
  </div>
</template>
<script lang="ts" setup name="Menu">
import type { Ref } from 'vue'
import { nextTick, ref } from 'vue'
import { BasicTable, useTable, TableAction } from '@/components/Table'
import MenuDrawer from './MenuDrawer.vue'

import {
  getMenuList,
  delMenu,
  checkMenuHasChildren,
} from '@admin/service/modules/sys/menu'

import {
  GetMenuListResultModel,
  MenuParams,
} from '@admin/service/modules/model/sys/menu'

import { columns, searchFormSchema, filter } from './menu.data'

import { useDrawer } from '@/components/Drawer'

import { useMessage } from '@/hooks/web/useMessage'
const { notification, createConfirm } = useMessage()

const params: Ref<MenuParams> = ref({})

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
const [registerTable, { reload, expandAll }] = useTable({
  title: '菜单列表',
  api: getMenuList,
  columns,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
  },
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
    width: 80,
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
  console.log(record)
  checkMenuHasChildren(record.id).then((v) => {
    console.log(v)
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
        notification.success({
          message: '提示',
          description: `删除成功`,
          duration: 3,
        })
      })
      reload()
    }
  })
}

/**
 * 增加/修改 表单提交后
 */
const handleSuccess = () => {
  reload()
  notification.success({
    message: '提示',
    description: `操作成功`,
    duration: 3,
  })
}

/**
 * 加载成功后
 */
const onFetchSuccess = () => {
  // 演示默认展开所有表项
  nextTick(expandAll)
}
</script>
<style lang="less"></style>
