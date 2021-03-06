import type { ErrorMessageMode, UserInfo } from '@admin/types'

import { defineStore } from 'pinia'
import { PageEnum, RoleEnum } from '@admin/tokens'
import { isArray } from '@admin/utils'
import { useI18n } from '@admin/locale'
import { pinia } from '@/internal'
import { doLogout, getUserInfo, loginApi } from '@service/sys/user'
import { GetUserInfoModel, LoginParams } from '@service/model'
import { useMessage } from '@/hooks/web/useMessage'
import { router } from '@/router'
import { usePermissionStore } from '@/store/permission'
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic'
import { h } from 'vue'

interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  roleList: RoleEnum[]
  sessionTimeout?: boolean
  lastUpdateTime: number
}

export const useUserStore = defineStore({
  id: 'app-user',
  persist: {
    strategies: [
      {
        paths: ['userInfo', 'token', 'roleList'],
      },
    ],
  },
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    //
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || ({} as UserInfo)
    },
    getToken(): string {
      return this.token as string
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : []
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : '' // for null or undefined value
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.sessionTimeout = false
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean
        mode?: ErrorMessageMode
        redirect?: string
      },
    ): Promise<GetUserInfoModel | null> {
      const { goHome = true, mode, redirect, ...loginParams } = params
      // ????????????API
      const data = await loginApi(loginParams, mode)

      const { token } = data
      // save token
      this.setToken(token)
      return this.afterLoginAction(goHome, redirect as string)
    },
    async afterLoginAction(
      goHome?: boolean,
      redirect?: string,
    ): Promise<GetUserInfoModel | null> {
      if (!this.getToken) {
        return null
      }
      // ??????????????????
      const userInfo = await this.getUserInfoAction()
      userInfo!.isAdmin =
        userInfo != null &&
        userInfo.roles.findIndex((e) => e.value === 'admin') > -1

      const sessionTimeout = this.sessionTimeout
      if (sessionTimeout) {
        this.setSessionTimeout(false)
      } else {
        const permissionStore = usePermissionStore()
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction()
          routes.forEach((route) => {
            router.addRoute(route)
          })
          router.addRoute(PAGE_NOT_FOUND_ROUTE)
          permissionStore.setDynamicAddedRoute(true)
        }

        goHome && (await router.replace(redirect || PageEnum.BASE_HOME))
      }
      return userInfo
    },

    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) {
        return null
      }

      const userInfo = await getUserInfo()
      const { roles = [] } = userInfo
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[]
        this.setRoleList(roleList)
      } else {
        userInfo.roles = []
        this.setRoleList([])
      }
      this.setUserInfo(userInfo)
      return userInfo
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        await doLogout().catch(() => {
          console.log('??????Token??????')
        })
      }
      this.setToken(undefined)
      this.setSessionTimeout(false)
      this.setUserInfo(null)
      goLogin && (await router.push(PageEnum.BASE_LOGIN))
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage()
      const { t } = useI18n()
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true)
        },
      })
    },
  },
})

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(pinia)
}
