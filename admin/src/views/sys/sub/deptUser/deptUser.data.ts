import { h } from 'vue'
import { BasicColumn, FormSchema } from '@/components/Table'
import { Avatar } from 'ant-design-vue'
import { User } from '@service/model/sys/user'
import { Sex, UserIdentity } from '@admin/tokens'
import { getManagementDeptList } from '@service/sys/myDept'

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
        src:
          (record as unknown as User).avatar || '/src/assets/images/可莉.jpg',
        alt: 'User',
      })
    },
  },
  {
    title: '性别',
    dataIndex: 'sex',
    customRender: ({ record }) => {
      const sex = (record as unknown as User).sex
      const enable = ~~sex === 0
      const text = enable ? '男' : '女'
      return h('span', {}, text)
    },
  },
]

const telRex =
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/

/** 表单信息 */
export const formSchema: FormSchema[] = [
  { field: 'id', label: 'id', component: 'InputNumber', show: false },
  {
    field: 'deptIds',
    component: 'Input',
    label: '部门',
    show: false,
  },
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
    label: '登录密码',
    field: 'password',
    component: 'InputPassword',
    ifShow: ({ values }) => {
      return !values.id
    },
    rules: [{ required: true, message: '新增用户必须先设置密码' }],
  },
  {
    label: '确认密码',
    field: 'passwordRepeat',
    component: 'InputPassword',
    ifShow: ({ values }) => {
      return !values.id
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('不能为空')
            }
            if (value !== values.password) {
              return Promise.reject('两次输入的密码不一致!')
            }
            return Promise.resolve()
          },
        },
      ]
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
        required: true,
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
    field: 'avatar',
    label: '头像',
    component: 'Input',
    slot: 'avatar',
    ifShow: ({ values }) => !!values.id,
  },
  {
    field: 'userIdentity',
    label: '用户身份',
    component: 'Select',
    componentProps: {
      options: [
        { label: '员工', value: UserIdentity.EMPLOYEES },
        { label: '上级', value: UserIdentity.SUPERIOR },
      ],
    },
  },
  {
    field: 'departIds',
    component: 'ApiTreeSelect',
    label: '负责的部门',
    componentProps: {
      api: getManagementDeptList,
      fieldNames: {
        children: 'children',
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      multiple: true,
    },
    ifShow: ({ values }) => values.userIdentity === UserIdentity.SUPERIOR,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
]
