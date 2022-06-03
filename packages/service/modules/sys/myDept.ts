import { defaultRequest } from '../../request'
import { Dept } from '../model/sys/dept'
import { Params, User, UserQuery } from '../model'
import { DeptRole, DeptRoleQuery } from '../model/sys/myDept'

enum Api {
  DeptManagement = '/system/deptManagement/list',
  SubDeptUserList = '/system/deptManagement/userList',
  DeptRole = '/system/deptManagement/deptRole',
  DeptPermTree = '/system/perm/deptPermTree',
  DeptRolePerm = '/system/perm/deptRolePerm',
  UserDeptRole = '/system/deptManagement/userDeptRole',
}

/**
 * 获得部门列表
 * @returns
 */
export const getManagementDeptList = () => {
  return defaultRequest.get<Dept[]>({ url: Api.DeptManagement })
}

/**
 * 获得部门用户列表
 * @returns
 */
export const getSubDeptUserList = (params: UserQuery) => {
  return defaultRequest.get<User[]>({ url: Api.SubDeptUserList, params })
}

/**
 * 分页获取部门角色
 * @param params
 */
export const getDeptRolePage = (params: DeptRoleQuery) => {
  return defaultRequest.get<DeptRole>({ url: Api.DeptRole, params })
}

/**
 * 获取部门所有角色
 * @param deptId 部门id
 */
export const getAllDeptRoleList = (deptId: Number) => {
  return defaultRequest.get<DeptRole[]>({ url: Api.DeptRole + '/' + deptId })
}

/**
 * 增加部门角色
 * @param params
 */
export const addDeptRole = (params: DeptRole) => {
  return defaultRequest.post({ url: Api.DeptRole, params })
}

/**
 * 更改部门角色
 * @param params
 */
export const editDeptRole = (params: DeptRole) => {
  return defaultRequest.put({ url: Api.DeptRole, params })
}

/**
 * 删除部门角色
 * @param id 部门角色id
 */
export const delDeptRole = (id: Number) => {
  return defaultRequest.delete({ url: Api.DeptRole + '/' + id })
}

/**
 * 获取部门已拥有权限树结构
 * @param deptId 部门id
 */
export const getDeptPermTree = (deptId: Number) => {
  return defaultRequest.get<Params[]>({ url: Api.DeptPermTree + '/' + deptId })
}

/**
 * 获取部门角色的权限
 * @param deptRoleId 部门角色id
 */
export const getDeptRolePerm = (deptRoleId: Number) => {
  return defaultRequest.get<Number[]>({
    url: Api.DeptRolePerm + '/' + deptRoleId,
  })
}

/**
 * 设置部门角色权限.
 * @param deptRoleId 部门角色id
 * @param newPermIds 新的权限id集合
 */
export const setDeptRolePerm = (deptRoleId: Number, newPermIds: Number[]) => {
  return defaultRequest.put({
    url: Api.DeptRolePerm + '/' + deptRoleId,
    params: newPermIds,
  })
}

/**
 * 查询用户的部门角色.
 * @param userId 用户id
 * @param deptId 部门id
 */
export const getDeptRoleToUser = (userId: Number, deptId: Number) => {
  return defaultRequest.get({
    url: Api.UserDeptRole,
    params: { userId, deptId },
  })
}

/**
 * 修改用户的部门角色.
 * @param userId 用户id
 * @param deptRoleId 部门角色id
 * @param deptRoleIds 部门角色id数组
 */
export const setDeptRoleToUser = (
  userId: Number,
  deptRoleId: Number,
  deptRoleIds: Number[],
) => {
  return defaultRequest.put(
    {
      url: Api.UserDeptRole,
      params: {
        userId,
        deptRoleId,
        deptRoleIds,
      },
    },
    {
      joinParamsToUrl: true,
    },
  )
}
