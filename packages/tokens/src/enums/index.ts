export * from './breakpointEnum'
export * from './httpEnum'
export * from './menuEnum'

export enum ContentLayoutEnum {
  // auto width
  FULL = 'full',
  // fixed width
  FIXED = 'fixed',
}

// menu theme enum
export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum SettingButtonPositionEnum {
  AUTO = 'auto',
  HEADER = 'header',
  FIXED = 'fixed',
}

export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}

/**
 * 权限模式
 */
export enum PermissionModeEnum {
  // role
  ROLE = 'ROLE',
  // black
  BACK = 'BACK',
  // route mapping
  ROUTE_MAPPING = 'ROUTE_MAPPING',
}

//  Route switching animation
export enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

export enum RoleEnum {
  // super admin
  SUPER = 'super',

  // tester
  TEST = 'test',
}

export enum PageEnum {
  // basic login path
  BASE_LOGIN = '/login',
  // basic home path
  BASE_HOME = '/dashboard',
  // error page path
  ERROR_PAGE = '/exception',
  // error log page path
  ERROR_LOG_PAGE = '/error-log/list',
  // 个人中心路径
  PERSONAL_CENTER = '/personalCenter',
}

export enum ComponentSizeEnum {
  DEFAULT = 'default',
  SMALL = 'small',
  LARGE = 'large',
}

export enum ComponentSizeValueEnum {
  DEFAULT = 48,
  SMALL = 16,
  LARGE = 64,
}

export enum ErrorTypeEnum {
  VUE = 'vue',
  SCRIPT = 'script',
  RESOURCE = 'resource',
  AJAX = 'ajax',
  PROMISE = 'promise',
}

/**
 * 数据库内0代表true
 */
export enum BooleanValueEnum {
  TRUE = 1,
  FALSE = 0,
}

/**
 * 菜单类型: 目录,菜单,按钮
 */
export enum MenuType {
  DIRECTORY = 0,
  MENU = 1,
  BUTTON = 2,
}

/**
 *状态 启用/禁用
 */
export enum Status {
  /** 启用 */
  ENABLE = 1,
  /** 禁用 */
  DISABLE = 0,
}

/**
 * 数据权限范围
 */
export enum DataScope {
  /** 全部数据权限 */
  ALL = 1,
  /** 自定数据权限 */
  CUSTOM = 2,
  /** 本部门数据权限 */
  DEPT = 3,
  /** 本部门及以下数据权限 */
  DEPT_AND_SUB = 4,
  /** 仅本人数据权限 */
  ME = 5,
}

/**
 * 性别
 */
export enum Sex {
  /** 男人 */
  MAN = 0,
  /** 女人 */
  WOMAN = 1,
  /** 未知 */
  UNKNOWN = 3,
}

export enum UserIdentity {
  EMPLOYEES = 0,
  SUPERIOR = 1,
}
