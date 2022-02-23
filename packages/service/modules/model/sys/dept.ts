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
  /**子部门 */
  children?: Dept[]
  /**显示名称 */
  showName?: string
}

/**获取部门列表返回结果 */
export type getDeptListResultModel = Dept[] | undefined
