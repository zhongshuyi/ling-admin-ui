import { FormSchema } from '@/components/Form'
import { Sex } from '@admin/tokens'

const telRex =
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/

/** 表单信息 */
export const formSchema: FormSchema[] = [
  { field: 'id', label: 'id', component: 'InputNumber', show: false },
  {
    label: '姓名:',
    field: 'realName',
    component: 'Input',
    required: true,
  },
  {
    label: '邮箱:',
    field: 'email',
    component: 'Input',
    rules: [{ required: true, type: 'email', message: '必须是邮箱的格式' }],
  },
  {
    label: '电话:',
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
    label: '性别:',
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
    label: '备注:',
    field: 'remark',
    component: 'InputTextArea',
  },
]

export const passwordFormSchema: FormSchema[] = [
  {
    field: 'passwordOld',
    label: '当前密码',
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'passwordNew',
    label: '新密码',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '新密码',
    },
    rules: [
      {
        required: true,
        message: '请输入新密码',
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',

    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('密码不能为空')
            }
            if (value !== values.passwordNew) {
              return Promise.reject('两次输入的密码不一致!')
            }
            return Promise.resolve()
          },
        },
      ]
    },
  },
]
