<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="400px"
    @ok="handleSubmit"
    :closable="false"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup name="DomeDrawer">
import { computed, ref, unref } from 'vue'

import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { BasicForm, useForm } from '@/components/Form/index'
import { useUserStore } from '@/store/user'

import { formSchema } from './test.data'

import { Dept } from '@service/model/sys/dept'
import { TestDome } from '@service/model/demo/testDome'
import { addTestDome, editTestDome } from '@service/demo/testDome'
import { UserIdentity } from '@admin/tokens'
import { getManagementDeptList } from '@service/sys/myDept'

const emit = defineEmits(['success', 'register'])

const isUpdate = ref(true)

const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] =
  useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  })

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    const userInfo = useUserStore().getUserInfo
    await resetFields()
    setDrawerProps({ confirmLoading: false })
    let treeData: Dept[] = []
    if (userInfo.userIdentity === UserIdentity.SUPERIOR || userInfo.isAdmin) {
      treeData = await getManagementDeptList()
    } else if (userInfo.depts && userInfo.depts.length > 1) {
      treeData = userInfo.depts as Dept[]
    } else if (userInfo.depts && userInfo.depts.length === 1) {
      await setFieldsValue({
        deptId: userInfo.depts[0].id,
      })
    }
    await updateSchema({
      field: 'deptId',
      componentProps: { treeData },
    })
    isUpdate.value = !!data?.isUpdate
    if (unref(isUpdate)) {
      await setFieldsValue({
        ...data.record,
      })
    }
  },
)

const getTitle = computed(() =>
  !unref(isUpdate) ? '新增数据' : '编辑数据信息',
)

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    if (unref(isUpdate)) {
      editTestDome(values as TestDome).then(() => {
        emit('success')
      })
    } else {
      addTestDome(values as TestDome).then(() => {
        emit('success')
      })
    }
    closeDrawer()
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}
</script>
<style lang="less" scoped></style>
