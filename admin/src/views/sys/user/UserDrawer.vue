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
    <BasicForm @register="registerForm">
      <template #avatar="{ model, field }">
        <CropperAvatar
          :value="model[field]"
          :uploadApi="avatar"
          :data="{ id: model['id'] }"
          :showBtn="false"
          width="100"
          @change="changAvatar(model['id'])"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup name="UserDrawer">
import { CropperAvatar } from '@/components/Cropper'
import { computed, ref, unref } from 'vue'
import { BasicForm, useForm } from '@/components/Form/index'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { formSchema } from './user.data'
import { useUserStore } from '@/store/user'
import { useMessage } from '@/hooks/web/useMessage'
import {
  addUser,
  avatar,
  checkUsernameUnique,
  editUser,
  getUser,
} from '@admin/service/modules/sys/user'

const userStore = useUserStore()
const { createMessage } = useMessage()

const emit = defineEmits(['success', 'register'])
const isUpdate = ref(true)

const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
  labelWidth: 90,
  schemas: formSchema,
  showActionButtonGroup: false,
})

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    await resetFields()
    setDrawerProps({ confirmLoading: false })

    isUpdate.value = !!data?.isUpdate

    if (unref(isUpdate)) {
      const user = await getUser(data.record.id)
      if (user.departIds) {
        user.departIds = user.departIds.toString().split(',').map(Number)
      }
      await setFieldsValue({
        ...user,
      })
    }
  },
)

const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'))

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    delete values.avatar
    if (values.departIds) {
      values.departIds = values.departIds.join(',')
    }

    if (isUpdate.value) {
      editUser(values).then(async () => {
        if (userStore.getUserInfo?.id == values.id) {
          await useUserStore().getUserInfoAction()
        }
        closeDrawer()
        emit('success')
      })
    } else {
      checkUsernameUnique(values).then((r) => {
        if (r) {
          addUser(values).then(async () => {
            closeDrawer()
            emit('success')
          })
        } else {
          createMessage.error('用户名' + values.username + '已存在')
        }
      })
    }
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}

const changAvatar = async (id: number) => {
  if (userStore.getUserInfo?.id == id) {
    await useUserStore().getUserInfoAction()
  }
  createMessage.success('上传成功')
  emit('success')
}
</script>
