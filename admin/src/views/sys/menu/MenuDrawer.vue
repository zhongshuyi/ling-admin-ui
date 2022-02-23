<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup name="MenuDrawer">
import { computed, ref, unref } from 'vue'

import { BasicForm, useForm } from '@/components/Form/index'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { formSchema } from './menu.data'
import { addMenu, editMenu, getMenuList } from '@service/sys/menu'
import { useI18n } from '@admin/locale/src/useI18n'
import { GetMenuListResultModel } from '@service/model/sys'

const emit = defineEmits(['success', 'register'])

const isUpdate = ref(true)

const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] =
  useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
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
    const treeData = await getMenuList()
    const { t } = useI18n()
    const setShowTitle = (v: GetMenuListResultModel) => {
      if (v === null) return
      v.forEach((m) => {
        m.showTitle = t(m.title)
        if (m.children !== undefined) {
          setShowTitle(m.children)
        }
      })
    }
    setShowTitle(treeData)
    treeData.push({
      id: 0,
      parentId: 0,
      title: '根目录',
      showTitle: '根目录',
      orderNo: 0,
    })
    updateSchema({
      field: 'parentId',
      componentProps: { treeData },
    })
  },
)

const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'))

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    if (unref(isUpdate)) {
      editMenu(values).then(() => {
        emit('success')
      })
    } else {
      addMenu(values).then(() => {
        emit('success')
      })
    }
    closeDrawer()
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}
</script>
