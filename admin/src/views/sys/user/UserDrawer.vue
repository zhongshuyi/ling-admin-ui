<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
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
import { ref, computed, unref } from 'vue'
import { BasicForm, useForm } from '@/components/Form/index'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { formSchema } from './user.data'
import { useUserStore } from '@/store/user'
import {
  addUser,
  avatar,
  editUser,
  getUser,
} from '@admin/service/modules/sys/user'

const userStore = useUserStore()

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
      const user = await getUser(data.record.id)
      setFieldsValue({
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
    console.log(values)
    if (isUpdate.value) {
      editUser(values).then(async () => {
        if (userStore.getUserInfo?.id == values.id) {
          await useUserStore().getUserInfoAction()
        }
      })
    } else {
      addUser(values)
    }
    closeDrawer()
    emit('success')
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}

const changAvatar = async (id: number) => {
  if (userStore.getUserInfo?.id == id) {
    await useUserStore().getUserInfoAction()
  }
  console.log('上传完成')
}
</script>
