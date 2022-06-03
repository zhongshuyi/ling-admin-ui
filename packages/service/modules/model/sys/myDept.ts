import { BasicPageParams } from '../basic'

export type DeptRole = {
  id?: number
  roleName?: string
  roleKey?: string
  remark?: string
}

export interface DeptRoleQuery extends BasicPageParams {
  deptId: Number
  roleName: string
}
