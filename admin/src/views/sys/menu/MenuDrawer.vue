<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #permissionUrl="{ model, field }">
        <Select
          @change="selectApiChange"
          mode="multiple"
          v-model:value="model[field]"
        >
          <SelectOption
            v-for="(item, index) in allUrl"
            :key="index"
            :value="index"
          >
            <Tooltip>
              <template #title>{{ item.url }}</template>
              <div class="inline-block w-16">
                <Tag :color="getColor(item.method)"> {{ item.method }} </Tag>
              </div>
              {{ item.description === '' ? item.url : item.description }}
            </Tooltip>
          </SelectOption>
        </Select>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup name="MenuDrawer">
import { computed, ref, unref } from 'vue'

import { BasicForm, useForm } from '@/components/Form/index'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { formSchema } from './menu.data'
import {
  addMenu,
  editMenu,
  getMenuList,
  getAllUrl,
  getUrlList,
} from '@service/sys/menu'
import { Select, SelectOption, Tag, Tooltip } from 'ant-design-vue'
import { PermissionUrl } from '@service/model/sys/menu'
import { MenuType } from '@admin/tokens/src/enums'

const emit = defineEmits(['success', 'register'])

const isUpdate = ref(true)

const allUrl = ref<PermissionUrl[]>([])

const selectUrl = ref<PermissionUrl[]>([])

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

    await getAllUrl().then(async (AllUrl) => {
      allUrl.value = AllUrl
      data.record.permission = []
      if (data.record.menuType === MenuType.BUTTON) {
        await getUrlList(data.record.id).then((r) => {
          selectUrl.value = r
          for (let i = 0; i < r.length; i++) {
            for (let j = 0; j < allUrl.value.length; j++) {
              if (
                r[i].url === allUrl.value[j].url &&
                r[i].method === allUrl.value[j].method
              ) {
                console.log(allUrl.value[j].url)
                data.record.permission.push(j)
              }
            }
          }
        })
      }
    })
    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      })
    }
    if (data?.parentId) {
      setFieldsValue({ parentId: data?.parentId })
    }
    const treeData = await getMenuList()

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

const getColor = (mounted) => {
  switch (mounted) {
    case 'GET':
      return '#4ab793'
    case 'DELETE':
      return '#d94c1d'
    case 'POST':
      return '#ce7933'
    default:
      return '#187fde'
  }
}

const selectApiChange = (indexs: number[]) => {
  console.log(indexs)
  selectUrl.value = []
  for (let i = 0; i < indexs.length; i++) {
    selectUrl.value.push(allUrl.value[indexs[i]])
  }
}

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    if (unref(isUpdate)) {
      values.permissionUrl = selectUrl.value
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
