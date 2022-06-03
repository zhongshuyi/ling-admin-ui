import type { ErrorMessageMode } from '@admin/types'
import type {
  GetUserInfoModel,
  LoginParams,
  LoginResultModel,
  User,
  UserQuery,
} from '../model'

import { defaultRequest } from '../../request'

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  User = '/system/user',
  Avatar = '/basic-api/system/user/avatar',
  CheckUsernameUnique = '/system/user/checkUsernameUnique',
  PersonalCenter = '/personalCenter',
  ItselfAvatar = '/personalCenter/avatar',
  ChangePassword = '/personalCenter/password',
}

/**
 * @description: 用户登录接口
 */
export function loginApi(
  params: LoginParams,
  mode: ErrorMessageMode = 'modal',
) {
  return defaultRequest.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return defaultRequest.get<GetUserInfoModel>(
    { url: Api.GetUserInfo },
    { errorMessageMode: 'none' },
  )
}

/**
 * 获取权限标识列表
 * @returns  权限标志列表
 */
export function getPermCode() {
  return defaultRequest.get<string[]>({ url: Api.GetPermCode })
}

/**
 * 退出登录
 * @returns 是否成功
 */
export function doLogout() {
  return defaultRequest.get({ url: Api.Logout })
}

/**
 * 获取用户列表
 * @param params 查询条件
 * @returns 分页后用户列表
 */
export function getUserList(params: UserQuery) {
  return defaultRequest.get({ url: Api.User, params })
}

/**
 * 获取用户详细信息
 * @param id 用户id
 * @returns 用户信息
 */
export function getUser(id: number) {
  return defaultRequest.get({ url: Api.User + '/' + id })
}

/**
 * 增加用户
 * @param params 用户信息
 * @returns 是否成功
 */
export function addUser(params: User) {
  return defaultRequest.post({ url: Api.User, params })
}

/**
 * 修改用户
 * @param params 参数
 * @returns 是否修改成功
 */
export function editUser(params: User) {
  return defaultRequest.put({ url: Api.User, params })
}

/**
 * 自己信息
 * @param params 参数
 * @returns 是否修改成功
 */
export function editItSelfUser(params: User) {
  return defaultRequest.put({ url: Api.PersonalCenter, params })
}

/**
 * 修改本用户密码
 * @param params
 */
export function changePassword(params: any) {
  return defaultRequest.put({ url: Api.ChangePassword, params })
}

/**
 * 删除用户
 * @param id 需要删除的用户id
 * @returns 是否删除成功
 */

export function delUser(id: number) {
  return defaultRequest.delete({ url: Api.User + '/' + id })
}

type apiFunParams = {
  file: Blob
  name: string
  filename: string
  data: Record<string, any>
}

/**
 * @description: 头像上传接口
 */
export function avatar(params: apiFunParams) {
  return defaultRequest.uploadFile(
    {
      url: Api.Avatar + '/' + params.data?.id,
    },
    params,
  )
}

/**
 * @description: 修改登录用户头像
 */
export function itselfAvatar(params: apiFunParams) {
  return defaultRequest.uploadFile(
    {
      url: Api.ItselfAvatar,
    },
    params,
  )
}

/**
 * 检测用户名是否已注册
 * @param username  用户名
 * @returns true就是还未被注册
 */
export function checkUsernameUnique(username: string) {
  return defaultRequest.get(
    { url: Api.CheckUsernameUnique, params: { username } },
    { errorMessageMode: 'none' },
  )
}
