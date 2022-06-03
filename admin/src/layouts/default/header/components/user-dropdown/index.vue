<template>
  <Dropdown
    placement="bottomLeft"
    :overlayClassName="`${prefixCls}-dropdown-overlay`"
  >
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu>
        <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
          @click="handleMenuClick('lock')"
        />
        <MenuItem
          key="personalCenter"
          :text="'个人中心'"
          icon="bx:bx-home"
          @click="handleMenuClick('personalCenter')"
        />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
          @click="handleMenuClick('logout')"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
</template>
<script lang="ts">
import { useRouter } from 'vue-router'
import { Dropdown, Menu } from 'ant-design-vue'
import { computed, defineComponent } from 'vue'
import { useUserStore } from '@/store/user'
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
import { useI18n } from '@admin/locale'
import { useDesign } from '@/hooks/web/useDesign'
import { useModal } from '@/components/Modal'
import headerImg from '@/assets/images/header.jpg'
import MenuItem from './DropMenuItem.vue'
import LockAction from '../lock/LockModal.vue'
import { PageEnum } from '@admin/tokens'

export default defineComponent({
  name: 'UserDropdown',
  components: {
    Dropdown,
    Menu,
    MenuItem,
    LockAction,
  },
  props: {
    theme: {
      type: String,
      validator: (v: string) => ['dark', 'light'].includes(v),
    },
  },
  setup() {
    const { prefixCls } = useDesign('header-user-dropdown')
    const { t } = useI18n()
    const { getShowDoc, getUseLockPage } = useHeaderSetting()
    const userStore = useUserStore()

    const getUserInfo = computed(() => {
      const { realName = '', avatar, desc } = userStore.getUserInfo || {}
      return { realName, avatar: avatar || headerImg, desc }
    })

    const [register, { openModal }] = useModal()

    function handleLock() {
      openModal(true)
    }

    //  login out
    function handleLoginOut() {
      userStore.confirmLoginOut()
    }

    // 个人中心跳转
    const router = useRouter()

    function handlePersonalCenter() {
      router.push(PageEnum.PERSONAL_CENTER)
    }

    const handleMenuClick = (key: string) => {
      switch (key) {
        case 'logout':
          handleLoginOut()
          break
        case 'lock':
          handleLock()
          break
        case 'personalCenter':
          handlePersonalCenter()
          break
      }
    }

    return {
      prefixCls,
      t,
      getUserInfo,
      handleMenuClick,
      getShowDoc,
      register,
      getUseLockPage,
    }
  },
})
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-header-user-dropdown';

.@{prefix-cls} {
  height: @header-height;
  padding: 0 0 0 10px;
  padding-right: 10px;
  overflow: hidden;
  font-size: 12px;
  cursor: pointer;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  &__header {
    border-radius: 50%;
  }

  &__name {
    font-size: 14px;
  }

  &--dark {
    &:hover {
      background-color: @header-dark-bg-hover-color;
    }
  }

  &--light {
    &:hover {
      background-color: @header-light-bg-hover-color;
    }

    .@{prefix-cls}__name {
      color: @text-color-base;
    }

    .@{prefix-cls}__desc {
      color: @header-light-desc-color;
    }
  }

  &-dropdown-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }
}
</style>
