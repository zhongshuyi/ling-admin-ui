import { FormSchema } from '@/components/Form/index'

export const schemas: FormSchema[] = [
  { field: 'id', component: 'InputNumber', ifShow: false, label: 'id' },
  { field: 'deptName', component: 'Input', label: '名称', required: true },
  {
    field: 'parentId',
    label: '上级部门',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        title: 'deptName',
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
