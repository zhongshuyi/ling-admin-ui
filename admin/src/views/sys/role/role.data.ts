import { h } from 'vue'
import { Switch } from 'ant-design-vue'

import { BasicColumn, FormSchema } from '@/components/Table'

import { useMessage } from '@/hooks/web/useMessage'
import { stateChanges } from '@admin/service/modules/sys/role'
import { Status } from '@admin/tokens/src/enums'
import { Role } from '@admin/service/modules/model/sys/role'

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: 200,
  },
  {
    title: '角色标识符',
    dataIndex: 'roleKey',
    width: 180,
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 50,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      const r = record as unknown as Role
      if (!Reflect.has(r, 'pendingStatus')) {
        r.pendingStatus = false
      }
      return h(Switch, {
        checked: r.status === Status.ENABLE,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        disabled: r.id === Status.DISABLE,
        loading: r.pendingStatus,
        onChange(checked: boolean) {
          r.pendingStatus = true
          const { createMessage } = useMessage()
          const newStatus = checked ? Status.ENABLE : Status.DISABLE
          stateChanges(r.id, newStatus)
            .then(() => {
              r.status = newStatus
              createMessage.success('已成功修改角色状态').then()
            })
            .catch(() => {
              createMessage.error('修改角色状态失败').then()
            })
            .finally(() => {
              r.pendingStatus = false
            })
        },
      })
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
]

export const formSchema: FormSchema[] = [
  { field: 'id', label: 'id', component: 'InputNumber', show: false },
  {
    field: 'roleName',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'roleKey',
    label: '角色标识符',
    required: true,
    component: 'Input',
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
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: Status.ENABLE,
    componentProps: {
      options: [
        { label: '启用', value: Status.ENABLE },
        { label: '停用', value: Status.DISABLE },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
]
