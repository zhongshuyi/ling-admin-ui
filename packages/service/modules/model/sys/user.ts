import { Status } from 'tokens'
import { BasicPageParams } from '../basic'

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string
  password: string
}

export interface RoleInfo {
  roleName: string
  value: string
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number
  token: string
  role: RoleInfo
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[]
  /** 用户id */
  id: string | number
  /** 用户名*/
  username: string
  /** 真实名字*/
  realName: string
  /** 头像*/
  avatar: string
  /**邮箱 */
  email: string
  /**电话号 */
  tel: string
  /** 性别*/
  sex: number
  /** 介绍*/
  remark?: string
}

export interface UserQuery extends BasicPageParams {
  /** 用户名*/
  username: string
  /**用户昵称*/
  realName: string
  /**电话号 */
  tel: string
  /**状态 */
  status: Status
}

/**用户操作 */
export type User = {
  /** 用户id */
  id: number
  /** 用户名*/
  username: string
  /**用户密码 */
  password: string
  /**用户昵称*/
  realName: string
  /**头像*/
  avatar: string
  /**邮箱 */
  email: string
  /**电话号 */
  tel: string
  /**性别*/
  sex: number
  /**介绍*/
  remark: string
  /**状态 */
  status: Status
  /**用户身份 */
  userIdentity: number
  /**负责的部门 */
  departIds: string
  /**最后登录IP */
  loginIp: string
  /**最后登录时间*/
  loginDate: string
}
