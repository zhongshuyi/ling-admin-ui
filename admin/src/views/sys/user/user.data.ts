import { h } from 'vue'
import { BasicColumn, FormSchema } from '@/components/Table'
import { Avatar } from 'ant-design-vue'
import { User } from '@service/model/sys/user'
import { Sex } from '@admin/tokens'

import { getList } from '@admin/service/modules/sys/role'
import { getDeptList } from '@admin/service/modules/sys/dept'

/**
 * 搜索表单
 */
export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'realName',
    label: '昵称',
    component: 'Input',
    colProps: { span: 8 },
  },
]

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '昵称',
    dataIndex: 'realName',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    customRender: ({ record }) => {
      return h(Avatar, {
        src: (record as unknown as User).avatar,
        alt: 'User',
      })
    },
  },
  {
    title: '性别',
    dataIndex: 'sex',
  },
]

const telRex =
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/

/** 表单信息 */
export const formSchema: FormSchema[] = [
  { field: 'id', label: 'id', component: 'InputNumber', show: false },
  {
    label: '用户名',
    field: 'username',
    component: 'Input',
    required: true,
    dynamicDisabled: ({ values }) => {
      return !!values.id
    },
  },
  {
    label: '真实姓名',
    field: 'realName',
    component: 'Input',
    required: true,
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    rules: [{ required: true, type: 'email', message: '必须是邮箱的格式' }],
  },
  {
    label: '电话号码',
    field: 'tel',
    component: 'Input',
    rules: [
      {
        required: false,
        pattern: telRex,
        message: '必须是中国大陆手机号的格式',
      },
    ],
  },
  {
    field: 'sex',
    label: '性别',
    component: 'Select',
    componentProps: {
      options: [
        { label: '男', value: Sex.MAN },
        { label: '女', value: Sex.WOMAN },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'roles',
    label: '角色',
    component: 'ApiSelect',
    componentProps: {
      mode: 'multiple',
      api: getList,
      labelField: 'roleName',
      valueField: 'id',
    },
  },
  {
    field: 'depts',
    component: 'ApiTreeSelect',
    label: '远程下拉树',
    required: true,
    componentProps: {
      api: getDeptList,
      fieldNames: {
        children: 'children',
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      multiple: true,
    },
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'Input',
    slot: 'avatar',
    ifShow: ({ values }) => !!values.id,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
]
