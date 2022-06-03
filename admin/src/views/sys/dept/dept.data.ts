import { FormSchema } from '@/components/Form'
import { BasicColumn } from '@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '部门名称',
    dataIndex: 'deptName',
    width: 300,
    align: 'left',
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 50,
  },
  {
    title: '电话',
    dataIndex: 'phone',
    minWidth: 200,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    minWidth: 200,
  },
  {
    title: '负责人',
    dataIndex: 'leader',
    width: 100,
  },
]

export const schemas: FormSchema[] = [
  { field: 'id', component: 'InputNumber', ifShow: false, label: 'id' },
  { field: 'deptName', component: 'Input', label: '名称', required: true },
  {
    field: 'parentId',
    label: '上级部门',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    defaultValue: 0,
  },
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 0,
    required: true,
    componentProps: {
      min: 0,
    },
  },
  {
    field: 'phone',
    label: '电话',
    component: 'Input',
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
  },
  {
    field: 'leader',
    label: '负责人',
    component: 'Input',
  },
]
