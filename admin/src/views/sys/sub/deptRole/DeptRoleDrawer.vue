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

<script lang="ts" name="DeptRoleDrawer" setup>
import { ref, computed, unref } from 'vue'
import { BasicForm, useForm } from '@/components/Form/index'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'

import { formSchema } from './deptRole.data'
import {
  addDeptRole,
  editDeptRole,
  getManagementDeptList,
} from '@service/sys/myDept'

const emit = defineEmits(['success', 'register'])
const isUpdate = ref(true)

const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] =
  useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  })

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    await resetFields()
    setDrawerProps({ confirmLoading: false })

    isUpdate.value = !!data?.isUpdate

    const treeData = await getManagementDeptList()

    await updateSchema({
      field: 'deptId',
      componentProps: { treeData },
    })

    if (unref(isUpdate)) {
      await setFieldsValue({
        ...data.record,
      })
    }
  },
)

const getTitle = computed(() =>
  !unref(isUpdate) ? '新增部门角色' : '编辑部门角色',
)

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    if (isUpdate.value) {
      await editDeptRole(values)
    } else {
      await addDeptRole(values)
    }
    closeDrawer()
    emit('success')
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}
</script>

<style lang="less" scoped></style>
