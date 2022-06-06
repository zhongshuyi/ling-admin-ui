import { ErrorTypeEnum, MenuModeEnum, MenuTypeEnum } from '@admin/tokens'

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined
  // Is it locked?
  isLock?: boolean
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum
  // Error file
  file: string
  // Error name
  name?: string
  // Error message
  message: string
  // Error stack
  stack?: string
  // Error detail
  detail: string
  // Error url
  url: string
  // Error time
  time?: string
}

export interface RoleInfo {
  roleName: string
  value: string
}

export type Dept = {
  /**id */
  id: number
  /**父级id */
  parentId?: number
  /**部门名称 */
  deptName: string
  /**父级列表 */
  parentList?: string
  /**排序 */
  orderNum?: number
  /**负责人 */
  leader?: string
  /**电话号码 */
  phone?: string
  /**邮箱 */
  email?: string
}

export interface UserInfo {
  id: string | number
  isAdmin?: boolean
  username: string
  realName: string
  avatar: string
  desc?: string
  email: string
  tel: string
  sex: number
  homePath?: string
  roles: RoleInfo[]
  depts?: Dept[]
  userIdentity?: number
}

export interface BeforeMiniState {
  menuCollapsed?: boolean
  menuSplit?: boolean
  menuMode?: MenuModeEnum
  menuType?: MenuTypeEnum
}
