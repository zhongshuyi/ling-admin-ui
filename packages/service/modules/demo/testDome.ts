import { defaultRequest } from '../../request'
import { BasicPageParams } from '../model'
import { TestDome } from '../model/demo/testDome'

enum Api {
  TestDome = '/dome',
  TestDomePage = '/dome/page',
}

/**
 * 获得示例列表
 * @returns
 */
export const getDomeList = (params: BasicPageParams) => {
  return defaultRequest.get<TestDome[]>({ url: Api.TestDome, params })
}

/**
 * 获得示例列表
 * @returns
 */
export const getDomeListPage = (params: BasicPageParams) => {
  return defaultRequest.get<TestDome[]>({ url: Api.TestDomePage, params })
}

/**
 * 添加示例数据
 * @returns
 */
export const addTestDome = (params?: TestDome) => {
  return defaultRequest.post({ url: Api.TestDome, params })
}

/**
 * 编辑数据示例
 * @param params
 */
export const editTestDome = (params?: TestDome) => {
  return defaultRequest.put({ url: Api.TestDome, params })
}

/**
 * 编辑数据示例
 * @param id 主键id
 */
export const delTestDome = (id?: number) => {
  return defaultRequest.put({ url: Api.TestDome + '/' + id })
}
