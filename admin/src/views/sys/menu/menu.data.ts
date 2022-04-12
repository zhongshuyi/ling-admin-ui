import { FormSchema } from '@/components/Form'
import { BasicColumn } from '@/components/Table'
import { useI18n } from '@admin/locale'
import { Status, BooleanValueEnum, MenuType } from '@admin/tokens'
import { Icon } from '@/components/Icon'
import { MenuParams, Menu, GetMenuListResultModel } from '@service/model'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'

const { t } = useI18n()

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'title',
    width: 300,
    align: 'left',
    customRender: ({ record }) => {
      return h('span', {}, t((record as unknown as Menu).title))
    },
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: (record as unknown as Menu).icon })
    },
  },
  {
    title: '权限标识',
    dataIndex: 'perms',
    width: 180,
  },
  {
    title: '组件',
    dataIndex: 'component',
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 50,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = (record as unknown as Menu).status
      const enable = ~~status === 0
      const color = enable ? 'green' : 'red'
      const text = enable ? '启用' : '停用'
      return h(Tag, { color: color }, () => text)
    },
  },
]

const isMenu = (type: Number) => type === MenuType.MENU
const isButton = (type: Number) => type === MenuType.BUTTON

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '菜单名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: Status.ENABL },
        { label: '停用', value: Status.DISABLE },
      ],
    },
    colProps: { span: 8 },
  },
]

export const formSchema: FormSchema[] = [
  { field: 'id', label: 'id', component: 'InputNumber', show: false },
  {
    field: 'menuType',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: MenuType.DIRECTORY,
    componentProps: {
      options: [
        { label: '目录', value: MenuType.DIRECTORY },
        { label: '菜单', value: MenuType.MENU },
        { label: '权限/按钮', value: MenuType.BUTTON },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'title',
    label: '菜单名称',
    component: 'Input',
    required: true,
  },

  {
    field: 'parentId',
    label: '上级菜单',
    required: true,
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        title: 'showTitle',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
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
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    ifShow: ({ values }) => !isButton(values.menuType),
  },

  {
    field: 'path',
    label: '路由地址',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => !isButton(values.menuType),
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'perms',
    label: '权限标识',
    component: 'Input',
    ifShow: ({ values }) => isButton(values.menuType),
    dynamicRules: ({ values }) => {
      if (isButton(values.menuType)) {
        return [{ required: true }]
      } else {
        return []
      }
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
  },
  {
    field: 'transitionName',
    label: '动画名',
    component: 'Input',
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'frameSrc',
    label: '内嵌网址',
    component: 'Input',
    ifShow: ({ values }) =>
      values.isFrame == BooleanValueEnum.TRUE && isMenu(values.menuType),
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: Status.ENABL,
    componentProps: {
      options: [
        { label: '启用', value: Status.ENABL },
        { label: '禁用', value: Status.DISABLE },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'affix',
    label: '是否固定',
    component: 'RadioButtonGroup',
    defaultValue: BooleanValueEnum.FALSE,
    componentProps: {
      options: [
        { label: '固定', value: BooleanValueEnum.TRUE },
        { label: '不固定', value: BooleanValueEnum.FALSE },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'isExt',
    label: '是否外链',
    component: 'RadioButtonGroup',
    defaultValue: BooleanValueEnum.FALSE,
    componentProps: {
      options: [
        { label: '是', value: BooleanValueEnum.TRUE },
        { label: '否', value: BooleanValueEnum.FALSE },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },

  {
    field: 'ignoreKeepAlive',
    label: '是否缓存',
    component: 'RadioButtonGroup',
    defaultValue: BooleanValueEnum.FALSE,
    componentProps: {
      options: [
        { label: '是', value: BooleanValueEnum.TRUE },
        { label: '否', value: BooleanValueEnum.FALSE },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'hideMenu',
    label: '隐藏菜单',
    component: 'RadioButtonGroup',
    defaultValue: BooleanValueEnum.FALSE,
    componentProps: {
      options: [
        { label: '是', value: BooleanValueEnum.TRUE },
        { label: '否', value: BooleanValueEnum.FALSE },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'hideTab',
    label: '隐藏Tab',
    component: 'RadioButtonGroup',
    defaultValue: BooleanValueEnum.FALSE,
    componentProps: {
      options: [
        { label: '是', value: BooleanValueEnum.TRUE },
        { label: '否', value: BooleanValueEnum.FALSE },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'hideChildrenInMenu',
    label: '隐藏子菜单',
    component: 'RadioButtonGroup',
    defaultValue: BooleanValueEnum.FALSE,
    componentProps: {
      options: [
        { label: '是', value: BooleanValueEnum.TRUE },
        { label: '否', value: BooleanValueEnum.FALSE },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'hideBreadcrumb',
    label: '隐藏面包屑',
    component: 'RadioButtonGroup',
    defaultValue: BooleanValueEnum.FALSE,
    componentProps: {
      options: [
        { label: '是', value: BooleanValueEnum.TRUE },
        { label: '否', value: BooleanValueEnum.FALSE },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'isFrame',
    label: '内嵌菜单',
    component: 'RadioButtonGroup',
    defaultValue: BooleanValueEnum.FALSE,
    componentProps: {
      options: [
        { label: '是', value: BooleanValueEnum.TRUE },
        { label: '否', value: BooleanValueEnum.FALSE },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'permission',
    label: '权限选择',
    component: 'Input',
    slot: 'permissionUrl',
    ifShow: ({ values }) => isButton(values.menuType),
  },
]

/**
 * 通过搜索条件过滤菜单
 */
export const filter = (
  menus: GetMenuListResultModel,
  query: MenuParams | undefined,
  result: GetMenuListResultModel,
) => {
  menus.forEach((m) => {
    if (query?.title && m.title.indexOf(query?.title) !== -1) {
      if (query?.status) {
        if (query?.status === m.status) {
          result.push(m)
          return
        }
      } else {
        result.push(m)
        return
      }
    }
    if (query?.status && query?.status === m.status) {
      if (query?.title) {
        if (m.title.indexOf(query?.title) !== -1) {
          result.push(m)
          return
        }
      } else {
        result.push(m)
        return
      }
    }
    if (m.children && m.children.length > 0) {
      filter(m.children, query, result)
    }
  })
  return result
}
