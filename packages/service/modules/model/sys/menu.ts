import { BooleanValueEnum, MenuTypeEnum, Status } from 'tokens'

export interface RouteItem {
  path: string
  component: any
  meta: any
  name?: string
  alias?: string | string[]
  redirect?: string
  caseSensitive?: boolean
  children?: RouteItem[]
}

/**
 * @description: 路由返回参数
 */
export type GetRouterListResultModel = RouteItem[]

/**
 * 菜单列表返回参数
 */
export type GetMenuListResultModel = Menu[]

export type Menu = {
  id: number
  parentId: number
  perms?: string
  orderNo: number
  path?: string
  title: string
  component?: string
  ignoreKeepAlive?: string
  affix?: BooleanValueEnum
  icon?: string
  frameSrc?: string
  transitionName?: string
  hideBreadcrumb?: BooleanValueEnum
  hideChildrenInMenu?: BooleanValueEnum
  hideTab?: BooleanValueEnum
  hideMenu?: BooleanValueEnum
  isLink?: BooleanValueEnum
  menuType?: MenuTypeEnum
  remark?: string
  status?: Status
  isFrame?: BooleanValueEnum
  showTitle?: string
  children?: Menu[]
}

export type MenuParams = {
  title?: string
  status?: Status
}

/**
 * 权限返回参数
 */
export type Params = {
  id: number
  order: number
  name: string
  parentId: number
  children?: Params[]
  showName?: string
}
