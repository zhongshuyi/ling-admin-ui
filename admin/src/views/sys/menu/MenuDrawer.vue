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
      <template #permissionUrl>
        <Select
          @change="selectApiChange"
          mode="multiple"
          v-model:value="selectUrlIndex"
          :filterOption="selectFilter"
        >
          <SelectOption
            v-for="(item, index) in allUrl"
            :key="'' + item.method + ';' + item.url + ';' + item.description"
            :value="index"
          >
            <Tooltip>
              <template #title>{{ item.url }}</template>
              <div class="inline-block w-16">
                <Tag :color="getColor(item.method)"> {{ item.method }}</Tag>
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
  getAllUrl,
  getMenuList,
  getUrlList,
} from '@service/sys/menu'
import { Select, SelectOption, Tag, Tooltip } from 'ant-design-vue'
import { PermissionUrl } from '@service/model/sys/menu'
import { MenuType } from '@admin/tokens/src/enums'

const emit = defineEmits(['success', 'register'])

const isUpdate = ref(true)

const allUrl = ref<PermissionUrl[]>([])

const selectUrlIndex = ref<number[]>([])

const selectUrl = ref<PermissionUrl[]>([])

const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] =
  useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  })

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data: any) => {
    await resetFields()
    setDrawerProps({ confirmLoading: false })
    isUpdate.value = !!data?.isUpdate
    selectUrlIndex.value = []
    // 获取所有可配置url
    await getAllUrl().then(async (AllUrl) => {
      allUrl.value = AllUrl
      // 如果类型是按钮
      if (data?.record?.menuType && data.record.menuType === MenuType.BUTTON) {
        // 获取已有权限
        await getUrlList(data.record.id).then((r) => {
          selectUrl.value = r
          for (let i = 0; i < r.length; i++) {
            for (let j = 0; j < allUrl.value.length; j++) {
              if (
                r[i].url === allUrl.value[j].url &&
                r[i].method === allUrl.value[j].method
              ) {
                selectUrlIndex.value.push(j)
              }
            }
          }
        })
      }
    })
    if (unref(isUpdate)) {
      await setFieldsValue({
        ...data.record,
      })
    }

    const treeData = await getMenuList()

    treeData.push({
      id: 0,
      parentId: 0,
      title: '根目录',
      orderNo: 0,
    })
    await updateSchema({
      field: 'parentId',
      componentProps: { treeData },
    })

    if (data?.parentId) {
      await setFieldsValue({ parentId: data?.parentId })
    }
  },
)

const selectFilter = (inputValue, option) => {
  return option.key.indexOf(inputValue) != -1
}

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
  selectUrl.value = []
  for (let i = 0; i < indexs.length; i++) {
    selectUrl.value.push(allUrl.value[indexs[i]])
  }
}

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    if (values.menuType === MenuType.BUTTON) {
      values.permissionUrl = selectUrl.value
    }
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
