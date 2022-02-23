import { defaultRequest } from '../../request'
import { BasicPageParams } from '../model'
import { Role } from '../model/sys/role'

enum Api {
  Role = '/system/role',
  List = '/system/role/list',
  Perm = '/system/role/perm',
  DataScope = '/system/role/dataScope',
}
/**
 * 分页获取角色列表
 * @param params 分页信息
 * @returns 分页后列表
 */
export const getRoleListByPage = (params: BasicPageParams) => {
  return defaultRequest.get<Role[]>({ url: Api.Role, params })
}

/**
 * 获取角色列表
 * @param params 分页信息
 * @returns 角色列表
 */
export const getList = () => {
  return defaultRequest.get<Role[]>({ url: Api.List })
}

/**
 * 增加角色
 * @param params 角色信息
 * @returns 是否成功
 */
export const addRole = (params?: Role) => {
  return defaultRequest.post({ url: Api.Role, params })
}

/**
 * 修改角色
 * @param params 角色信息
 * @returns 是否成功
 */
export const editRole = (params?: Role) => {
  return defaultRequest.put({ url: Api.Role, params })
}

/**
 * 修改角色状态
 * @param id 角色id
 * @param newstate 新的状态
 * @returns 是否成功
 */
export const stateChanges = (id?: number, newstate?: number) => {
  return defaultRequest.put({ url: Api.Role + '/' + id + '/' + newstate })
}

/**
 * 删除角色
 * @param id 需要删除的角色的id
 * @returns 是否删除成功
 */
export const delRole = (id?: number) => {
  return defaultRequest.put({ url: Api.Role + '/' + id })
}

/**
 * 获取角色的权限列表
 * @param id 角色id
 * @returns
 */
export const getPermIds = (id?: number) => {
  return defaultRequest.get({ url: Api.Perm + '/' + id })
}

/**
 * 设置角色权限
 * @param id 角色id
 * @param ids 权限id数组
 * @returns
 */
export const setPermIds = (id?: number, ids?: any) => {
  return defaultRequest.put({ url: Api.Perm + '/' + id, params: ids })
}

/**
 * 获取角色自定义的数据权限
 * @param id 角色id
 * @returns 部门id集合
 */
export const getDataScope = (id?: number) => {
  return defaultRequest.get({ url: Api.DataScope + '/' + id })
}

/**
 * 设置角色自定义的数据权限
 * @param id 角色id
 * @param ids 部门id集合
 * @returns
 */
export const setDataScope = (id?: number, ids?: any) => {
  return defaultRequest.put({ url: Api.DataScope + '/' + id, params: ids })
}
