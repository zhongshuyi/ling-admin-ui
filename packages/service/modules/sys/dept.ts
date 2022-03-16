import { defaultRequest } from '../../request'
import { Dept } from '../model/sys/dept'

enum Api {
  Dept = '/system/dept',
  CheckDeptHasChildren = '/system/dept/checkMenuHasChildren',
  DeptPerm = '/system/dept/DeptPerm',
  GetDeptIdsByUserId = '/system/dept/getDeptIdsByUserId',
}

/**
 * 获得部门列表
 * @returns
 */
export const getDeptList = () => {
  return defaultRequest.get<Dept[]>({ url: Api.Dept })
}

/**
 * 根据用户id查询部门id列表
 * @param userId 用户id
 * @returns 部门id集合
 */
export const getDeptIdsByUserId = (userId: number) => {
  return defaultRequest.get<number[]>({
    url: Api.GetDeptIdsByUserId + '/' + userId,
  })
}

/**
 * 获得部门详细信息
 * @returns
 */
export const getDept = (id: number) => {
  return defaultRequest.get<Dept[]>({ url: Api.Dept + '/' + id })
}

/**
 * 添加部门
 * @returns
 */
export const addDept = (params?: Dept) => {
  return defaultRequest.post({ url: Api.Dept, params })
}

/**
 * 修改部门
 * @param params 部门数据
 * @returns
 */
export const editDept = (params?: Dept) => {
  return defaultRequest.put({ url: Api.Dept, params })
}

/**
 * 删除部门
 * @param ids 部门id
 * @returns
 */
export const delDept = (id: number) => {
  return defaultRequest.delete({ url: Api.Dept + '/' + id })
}

/**
 * 检查菜单是否有子菜单
 * @param id 菜单id
 * @returns
 */
export const checkDeptHasChildren = (id: number) => {
  return defaultRequest.get({ url: Api.CheckDeptHasChildren + '/' + id })
}

/**
 * 获取部门权限
 * @param id 部门id
 * @returns
 */
export const getDeptPerm = (id: number | undefined) => {
  return defaultRequest.get<[]>({ url: Api.DeptPerm + '/' + id })
}
/**
 * 设置部门权限
 * @param ids
 * @returns
 */
export const setDeptPerm = (id: number | undefined, ids) => {
  return defaultRequest.put({ url: Api.DeptPerm + '/' + id, params: ids })
}
