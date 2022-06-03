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
<script lang="ts" setup name="DeptDrawer">
import { computed, ref, unref } from 'vue'

import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { BasicForm, useForm } from '@/components/Form/index'

import { deepMerge } from '@admin/utils'

import { schemas } from './dept.data'

import { Dept } from '@service/model/sys/dept'
import { addDept, editDept } from '@service/sys/dept'

const emit = defineEmits(['success', 'register'])

const isUpdate = ref(true)

const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] =
  useForm({
    labelWidth: 90,
    schemas: schemas,
    showActionButtonGroup: false,
  })

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    await resetFields()
    setDrawerProps({ confirmLoading: false })

    isUpdate.value = !!data?.isUpdate
    if (data?.deptTree) {
      let treeData: Dept[] = []
      deepMerge(treeData, data?.deptTree)
      treeData.push({ id: 0, deptName: '根部门' })
      await updateSchema({
        field: 'parentId',
        componentProps: { treeData },
      })
    }
    if (data?.parentId) {
      await setFieldsValue({
        parentId: data?.parentId,
      })
    }
    if (unref(isUpdate)) {
      await setFieldsValue({
        ...data.record,
      })
    }
  },
)

const getTitle = computed(() =>
  !unref(isUpdate) ? '新增部门' : '编辑部门信息',
)

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    if (unref(isUpdate)) {
      editDept(values as Dept).then(() => {
        emit('success')
      })
    } else {
      addDept(values as Dept).then(() => {
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
