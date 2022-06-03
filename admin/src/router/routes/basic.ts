import { PAGE_NOT_FOUND_NAME, REDIRECT_NAME } from '@admin/tokens'
import { LAYOUT } from '@/router/constant'

export const EXCEPTION_COMPONENT = () =>
  import('@/views/sys/exception/Exception.vue')

export const PERSONAL_CENTER_COMPONENT = () =>
  import('@/views/sys/personalCenter/index.vue')

export const PERSONAL_CENTER: RouteRecordItem = {
  path: '/personalCenter',
  name: 'PersonalCenter',
  component: LAYOUT,
  meta: {
    title: 'PersonalCenter',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '',
      name: 'PersonalCenter',
      component: PERSONAL_CENTER_COMPONENT,
      meta: {
        title: '个人中心',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
}

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: RouteRecordItem = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
}

export const REDIRECT_ROUTE: RouteRecordItem = {
  path: '/redirect',
  component: LAYOUT,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
}
