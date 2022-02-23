<template>
  <BasicModal
    @register="register"
    v-bind="$attrs"
    title="新增部门"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup name="DeptModel">
import { BasicModal, useModalInner } from '@/components/Modal'
import { BasicForm, useForm } from '@/components/Form/index'

import { schemas } from './dept.data'
import { addDept } from '@service/sys/dept'
import { Dept } from '@service/model/sys/dept'

const props = defineProps({
  treeSlectData: Array,
  addDeptId: Number,
})

const emit = defineEmits(['fetch', 'register'])

const [registerForm, { updateSchema, validate, resetFields, getFieldsValue }] =
  useForm({
    labelWidth: 98,
    schemas: schemas,
    showActionButtonGroup: false,
  })

const [register, { closeModal }] = useModalInner(() => {
  resetFields()
  updateSchema({
    field: 'parentId',
    componentProps: { treeData: props.treeSlectData },
  })
})

const handleSubmit = async () => {
  if (await validate()) {
    addDept(getFieldsValue() as Dept).then(() => {
      emit('fetch')
      closeModal()
    })
  }
}
</script>
