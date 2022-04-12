import type {
  GetMenuListResultModel,
  GetRouterListResultModel,
  Menu,
  Params,
  PermissionUrl,
} from '../model'
import { defaultRequest } from '../../request'

enum Api {
  GetRouterList = '/getRouterList',
  Menu = '/system/menu',
  CheckMenuHasChildren = '/system/menu/checkMenuHasChildren',
  Perm = '/system/menu/getPerm',
  GetAllUrl = '/system/menu/getAllPermissionUrl',
  GetUrlList = '/system/menu/getPermissionUrlList',
}

/**
 * @description: 获取用户菜单路由
 */

export const getRouterList = () => {
  return defaultRequest.get<GetRouterListResultModel>({
    url: Api.GetRouterList,
  })
}

/**
 * 获取菜单列表
 * @returns 菜单列表
 */
export const getMenuList = () => {
  return defaultRequest.get<GetMenuListResultModel>({ url: Api.Menu })
}

/**
 * 获取所有接口路径及方法
 * @returns 接口路径及方法集合
 */
export const getAllUrl = () => {
  return defaultRequest.get<PermissionUrl[]>({ url: Api.GetAllUrl })
}

/**
 * 获取所有接口路径及方法
 * @returns 接口路径及方法集合
 */
export const getUrlList = (id: number) => {
  return defaultRequest.get<PermissionUrl[]>({ url: Api.GetUrlList + '/' + id })
}

/**
 * 添加菜单
 * @param params 菜单数据
 * @returns
 */
export const addMenu = (params?: Menu) => {
  return defaultRequest.post({ url: Api.Menu, params })
}

/**
 * 修改菜单
 * @param params 菜单数据
 * @returns
 */
export const editMenu = (params?: Menu) => {
  return defaultRequest.put({ url: Api.Menu, params })
}

/**
 * 删除菜单
 * @param ids 菜单id
 * @returns
 */
export const delMenu = (id: number) => {
  return defaultRequest.delete({ url: Api.Menu + '/' + id })
}

/**
 * 检查菜单是否有子菜单
 * @param id 菜单id
 * @returns
 */
export const checkMenuHasChildren = (id: number) => {
  return defaultRequest.get({ url: Api.CheckMenuHasChildren + '/' + id })
}

/**
 * 获取所有权限树结构
 * @returns
 */
export const getPerm = () => {
  return defaultRequest.get<Params[]>({ url: Api.Perm })
}
