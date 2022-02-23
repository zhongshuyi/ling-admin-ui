import { DataScope, Status } from 'tokens'

export type Role = {
  id?: number
  roleName?: string
  roleKey?: string
  orderNo?: number
  dataScope?: DataScope
  status?: Status
  remark?: string
  pendingStatus?: any
}
