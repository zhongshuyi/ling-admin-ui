<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-full lg:w-1/6" @select="handleSelect" />
    <div class="w-full bg-white lg:w-5/6 lg:m-4 pl-4">
      <Tabs v-model:activeKey="activeKey">
        <TabPane key="1" tab="部门信息">
          <DeptInfo :dept-id="selectId" />
        </TabPane>
        <TabPane key="2" tab="部门用户">
          <DeptUser
            :dept-id="selectId"
            @handDeptRole="openUserDeptRoleDrawer"
          />
        </TabPane>
        <TabPane key="3" tab="部门角色">
          <DeptRole :dept-id="selectId" />
        </TabPane>
      </Tabs>
    </div>
    <UserDeptRoleDrawer @register="registerDrawer" />
  </PageWrapper>
</template>
<script lang="ts" setup name="Test">
import { ref } from 'vue'
import { TabPane, Tabs } from 'ant-design-vue'

import { PageWrapper } from '@/components/Page'
import { useDrawer } from '@/components/Drawer'
import { useMessage } from '@/hooks/web/useMessage'

import DeptTree from './DeptTree.vue'
import DeptInfo from './DeptInfo.vue'
import DeptUser from './deptUser/index.vue'
import DeptRole from './deptRole/index.vue'
import UserDeptRoleDrawer from './deptUser/UserDeptRoleDrawer.vue'

const [registerDrawer, { openDrawer }] = useDrawer()

const { createMessage } = useMessage()

const activeKey = ref('2')

const selectId = ref<Number>(-1)

const handleSelect = (v) => {
  selectId.value = v
}

const openUserDeptRoleDrawer = (userId: Number) => {
  if (selectId.value === -1) {
    createMessage.error('请先选择部门')
    return
  }
  openDrawer(true, {
    deptId: selectId.value,
    userId: userId,
  })
}
</script>
