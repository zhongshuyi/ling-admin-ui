<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree
      class="w-2/5 xl:w-1/5"
      @select="handleSelect"
      @handleAdd="handleAdd"
      :treeData="deptTreeData"
      @refreshData="fetch"
    />
    <div class="relative w-3/5 p-4 m-4 bg-white xl:w-2/5">
      <ScrollContainer class="pr-10">
        <BasicTitle class="mb-4">部门信息</BasicTitle>
        <Empty v-show="deptId === -1" description="请先选择部门" />
        <BasicForm v-show="deptId !== -1" @register="registerForm" />
      </ScrollContainer>
      <div v-show="deptId !== -1" class="absolute bottom-0 right-0">
        <a-button @click="update" class="mb-2 mr-2" type="primary"
          >提交</a-button
        >
      </div>
    </div>
    <PermissionsTree class="w-2/5 xl:w-2/5" :deptId="deptId" />
    <DeptModel
      @register="registerModal"
      @fetch="fetch"
      :treeSlectData="treeSlectData"
      :addDeptId="addDeptId"
    />
  </PageWrapper>
</template>
<script lang="ts" setup name="Dept">
import { ref, watch, onMounted } from 'vue'
import { PageWrapper } from '@/components/Page'
import { BasicTitle } from '@/components/Basic/index'
import { BasicForm, useForm } from '@/components/Form/index'
import { TreeItem } from '@/components/Tree'
import { ScrollContainer } from '@/components/Container/index'
import { Empty } from 'ant-design-vue'
import { useModal } from '@/components/Modal'
import { useI18n } from '@admin/locale/src/useI18n'

import DeptTree from './deptTree.vue'
import PermissionsTree from './permissionsTree.vue'
import DeptModel from './deptModel.vue'

import { schemas } from './dept.data'
import { Dept, getDeptListResultModel } from '@service/model/sys/dept'
import { editDept, getDept, getDeptList } from '@service/sys/dept'

const [
  registerForm,
  { updateSchema, setFieldsValue, getFieldsValue, validate },
] = useForm({
  labelWidth: 100,
  schemas: schemas,
  showActionButtonGroup: false,
})

const [registerModal, { openModal }] = useModal()

const deptId = ref(-1)

const deptTreeData = ref<any[]>([])

const treeSlectData = ref<any[]>([])

const fetch = async () => {
  const { t } = useI18n()
  const setShowTitle = (v: getDeptListResultModel) => {
    if (!v) return
    v.forEach((d) => {
      d.showName = t(d.deptName)
      // 判断是否是叶子节点
      if (d.children !== undefined) {
        setShowTitle(d.children)
      }
    })
  }
  deptTreeData.value = (await getDeptList()) as unknown as TreeItem[]
  setShowTitle(deptTreeData.value)
  setTreeSlectData()
}

/**
 * 设置部门选择器的数据.添加根部门
 */
const setTreeSlectData = () => {
  treeSlectData.value = [
    {
      id: 0,
      parentId: 0,
      title: '根部门',
      showName: '根部门',
      orderNo: 0,
      children: deptTreeData.value,
    },
  ]

  updateSchema({
    field: 'parentId',
    componentProps: { treeData: treeSlectData.value },
  })
}

const update = async () => {
  if (await validate()) {
    editDept(getFieldsValue() as Dept).then(() => {
      fetch()
    })
  }
}

const addDeptId = ref<number>(0)

const handleAdd = (id: number) => {
  addDeptId.value = id
  openModal()
}

const handleSelect = (selectId = -1) => {
  deptId.value = selectId
}

watch(
  () => deptId.value,
  (n) => {
    if (n !== -1) {
      getDept(n).then((r) => {
        setFieldsValue(r)
      })
    }
  },
)

onMounted(() => {
  fetch()
})
</script>
