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
<script lang="ts" setup name="RoleDrawer">
import { ref, computed, unref } from 'vue'
import { BasicForm, useForm } from '@/components/Form/index'
import { formSchema } from './role.data'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { addRole, editRole } from '@service/sys/role'

const emit = defineEmits(['success', 'register'])
const isUpdate = ref(true)

const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
  labelWidth: 90,
  schemas: formSchema,
  showActionButtonGroup: false,
})

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    resetFields()
    setDrawerProps({ confirmLoading: false })

    isUpdate.value = !!data?.isUpdate

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      })
    }
  },
)

const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'))

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    if (isUpdate.value) {
      editRole(values)
    } else {
      addRole(values)
    }
    closeDrawer()
    emit('success')
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}
</script>
