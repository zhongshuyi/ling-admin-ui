import { BasicColumn, FormSchema } from '@/components/Table'
import { Sex, UserIdentity } from '@admin/tokens/src/enums'
import { useUserStore } from '@/store/user'
import { h } from 'vue'
import { TestDome } from '@service/model/demo/testDome'

const userInfo = useUserStore().getUserInfo

export const columns: BasicColumn[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '班级',
    dataIndex: 'classNo',
    width: 180,
    sorter: true,
  },

  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    customRender: ({ record }) => {
      const sex = (record as unknown as TestDome).sex
      let text
      switch (sex) {
        case Sex.MAN:
          text = '男'
          break
        case Sex.WOMAN:
          text = '女'
          break
        default:
          text = '未知'
      }
      return h('span', {}, text)
    },
  },
  {
    title: '学号',
    dataIndex: 'studentNo',
    width: 200,
    sorter: true,
  },
  {
    title: '电话',
    dataIndex: 'tel',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'classNo',
    label: '班级',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'sex',
    label: '性别',
    component: 'Select',
    componentProps: {
      options: [
        { label: '男', value: Sex.MAN },
        { label: '女', value: Sex.WOMAN },
        { label: '未知', value: Sex.UNKNOWN },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'studentNo',
    label: '学号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'tel',
    label: '电话号码',
    component: 'Input',
    colProps: { span: 8 },
  },
]

export const formSchema: FormSchema[] = [
  { field: 'id', label: 'id', component: 'InputNumber', show: false },
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    required: true,
  },
  {
    field: 'classNo',
    label: '班级',
    component: 'Input',
    required: true,
  },
  {
    field: 'sex',
    label: '性别',
    component: 'Select',
    componentProps: {
      options: [
        { label: '男', value: Sex.MAN },
        { label: '女', value: Sex.WOMAN },
        { label: '未知', value: Sex.UNKNOWN },
      ],
    },
    required: true,
  },
  {
    field: 'studentNo',
    label: '学号',
    component: 'Input',
    required: true,
  },
  {
    field: 'tel',
    label: '电话号码',
    component: 'Input',
    required: true,
  },
  {
    field: 'deptId',
    label: '数据所属部门',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    ifShow:
      userInfo.userIdentity !== UserIdentity.EMPLOYEES ||
      (userInfo.depts && userInfo.depts.length > 1),
  },
]
