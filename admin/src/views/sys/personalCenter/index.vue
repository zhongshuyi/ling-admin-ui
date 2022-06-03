<template>
  <PageWrapper
    dense
    contentFullHeight
    contentClass="flex flex-col lg:flex-row h-full p-4"
  >
    <Card class="w-full lg:w-1/4 bg-white mr-0 lg:mr-4" title="个人信息">
      <div class="w-full flex flex-col justify-center items-center">
        <CropperAvatar
          :value="userInfo.avatar"
          :uploadApi="itselfAvatar"
          :data="{ id: userInfo.id }"
          :showBtn="false"
          :width="130"
          @change="changAvatar"
        />
        <div class="text-2xl mt-2">{{ userInfo.realName }}</div>
        <List class="w-3/4">
          <ListItem>
            账号:
            <template #actions>{{ userInfo.username }}</template>
          </ListItem>
          <ListItem>
            邮箱:
            <template #actions>{{ userInfo.email }}</template>
          </ListItem>
          <ListItem>
            性别:
            <template #actions>{{ sexComputed }}</template>
          </ListItem>
          <ListItem>
            部门:
            <template #actions>
              <Tag color="orange" v-for="(item, index) in depts" :key="index">
                {{ item }}
              </Tag>
            </template>
          </ListItem>
          <ListItem>
            角色:
            <template #actions>
              <Tag color="green" v-for="(item, index) in roles" :key="index">
                {{ item }}
              </Tag>
            </template>
          </ListItem>
        </List>
      </div>
    </Card>
    <Card
      title="修改信息"
      class="w-full lg:w-3/4 h-full bg-white mt-4 lg:mt-0 lg:pl-2"
    >
      <Tabs v-model:activeKey="activeKey">
        <TabPane key="1" tab="修改信息" class="pt-2">
          <BasicForm @register="registerForm" />
          <div class="w-full flex justify-end">
            <Button type="primary" @click="submitInfo">提交</Button>
          </div>
        </TabPane>
        <TabPane key="2" tab="修改密码">
          <BasicForm @register="registerPassword" />
          <div class="flex justify-center">
            <a-button @click="resetFieldsPassword"> 重置</a-button>
            <a-button class="!ml-4" type="primary" @click="submitPassword">
              确认
            </a-button>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup name="personalCenter">
import { computed, onMounted, ref } from 'vue'
import { Card, List, ListItem, Tag, Button } from 'ant-design-vue'
import { TabPane, Tabs } from 'ant-design-vue'

import { PageWrapper } from '@/components/Page'
import { CropperAvatar } from '@/components/Cropper'

import { useUserStore } from '@/store/user'
import { useMessage } from '@/hooks/web/useMessage'
import { BasicForm, useForm } from '@/components/Form/index'
import { formSchema, passwordFormSchema } from './personal.data'
import {
  editItSelfUser,
  itselfAvatar,
  changePassword,
} from '@admin/service/modules/sys/user'

const { createMessage } = useMessage()

// 修改信息表单
const [registerForm, { setFieldsValue, validate }] = useForm({
  labelWidth: 50,
  labelAlign: 'right',
  schemas: formSchema,
  showActionButtonGroup: false,
})
// 修改密码表单
const [
  registerPassword,
  { validate: validatePassword, resetFields: resetFieldsPassword },
] = useForm({
  size: 'large',
  labelWidth: 100,
  showActionButtonGroup: false,
  schemas: passwordFormSchema,
})

const userInfo = useUserStore().getUserInfo

onMounted(() => {
  setFieldsValue({ ...userInfo })
})

const activeKey = ref('1')

const sexComputed = computed(() => {
  switch (userInfo.sex) {
    case 0:
      return '男'
    case 1:
      return '女'
    case 2:
  }
  return '未知'
})

const depts = computed(() => {
  return userInfo.depts?.map((item) => item.deptName)
})

const roles = computed(() => {
  return userInfo.roles?.map((item) => item.roleName)
})

const changAvatar = async () => {
  await useUserStore().getUserInfoAction()
  createMessage.success('上传成功')
}

async function submitInfo() {
  try {
    const values = await validate()
    await editItSelfUser(values)
  } finally {
  }
}

async function submitPassword() {
  try {
    const values = await validatePassword()
    await changePassword(values)
    await useUserStore().logout(true)
  } catch (error) {}
}
</script>
<style lang="less" scoped></style>
