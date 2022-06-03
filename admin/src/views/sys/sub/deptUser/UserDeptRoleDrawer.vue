<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="设置部门角色"
    width="400px"
    @ok="handleSubmit"
    :closable="false"
  >
    <CheckboxGroup v-model:value="userHasDeptRoleList" class="flex flex-col">
      <Checkbox
        :value="deptRole.id"
        v-for="deptRole in deptRoleList"
        :key="deptRole.id"
      >
        {{ deptRole.roleName }}
      </Checkbox>
    </CheckboxGroup>
  </BasicDrawer>
</template>
<script lang="ts" setup name="">
import { Checkbox, CheckboxGroup } from 'ant-design-vue'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { DeptRole } from '@service/model/sys/myDept'
import { ref } from 'vue'
import {
  getAllDeptRoleList,
  getDeptRoleToUser,
  setDeptRoleToUser,
} from '@service/sys/myDept'

const emit = defineEmits(['success', 'register'])

/**
 * 已选择的部门id
 */
const deptId = ref<Number>()

/**
 * 当前配置的用户id
 */
const userId = ref<Number>()

/**
 * 部门的部门角色列表
 */
const deptRoleList = ref<DeptRole[]>([])

/**
 * 用户拥有的该部门的部门角色id列表
 */
const userHasDeptRoleList = ref([])

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    deptId.value = data.deptId
    userId.value = data.userId
    // 获取角色列表
    deptRoleList.value = await getAllDeptRoleList(deptId.value as Number)
    // 获取用户已拥有的角色列表
    userHasDeptRoleList.value = await getDeptRoleToUser(
      userId.value as Number,
      deptId.value as Number,
    )

    setDrawerProps({ confirmLoading: false })
  },
)

const handleSubmit = () => {
  setDeptRoleToUser(
    userId.value as Number,
    deptId.value as Number,
    userHasDeptRoleList as unknown as Number[],
  )
  closeDrawer()
  emit('success')
}
</script>
<style lang="less" scoped></style>
