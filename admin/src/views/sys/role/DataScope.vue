<template>
  <BasicDrawer
    class="relative"
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="'角色权限'"
    width="400px"
    @ok="handleSubmit"
    :closable="false"
  >
    <template #title>数据权限 </template>
    <Descriptions class="ml-2" :column="1" :contentStyle="{ color: '#adb5bd' }">
      <DescriptionsItem label="角色名称">{{ role?.roleName }}</DescriptionsItem>
      <DescriptionsItem label="角色键名">{{ role?.roleKey }}</DescriptionsItem>
    </Descriptions>
    <Select
      v-model:value="dataScope"
      placeholder="请选择数据权限"
      size="large"
      class="w-full ml-2"
    >
      <SelectOption :value="DataScope.ALL">所有数据权限</SelectOption>
      <SelectOption :value="DataScope.CUSTOM">自定义数据权限</SelectOption>
      <SelectOption :value="DataScope.DEPT">本部门数据权限</SelectOption>
      <SelectOption :value="DataScope.DEPT_AND_SUB"
        >本部门及下级部门数据权限</SelectOption
      >
      <SelectOption :value="DataScope.ME">仅本人数据权限</SelectOption>
    </Select>
    <BasicTree
      v-show="dataScope == DataScope.CUSTOM"
      class="mt-6 border"
      checkable
      clickRowToExpand
      :checkStrictly="false"
      :checkedKeys="checkedKeys"
      ref="dataScopeTreeRef"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'showName' }"
      @check="onCheck"
    />
  </BasicDrawer>
</template>
<script lang="ts" setup name="DataScope">
import { onMounted, ref, unref, watch } from 'vue'

import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree'
import { useI18n } from '@admin/locale/src/useI18n'

import {
  Select,
  SelectOption,
  Descriptions,
  DescriptionsItem,
} from 'ant-design-vue'

import { getDeptList } from '@admin/service/modules/sys/dept'
import { Role } from '@admin/service/modules/model/sys/role'
import { getDeptListResultModel } from '@admin/service/modules/model/sys/dept'
import { DataScope } from '@admin/tokens/src/enums'
import {
  editRole,
  getDataScope,
  setDataScope,
} from '@admin/service/modules/sys/role'

const dataScopeTreeRef = ref<Nullable<TreeActionType>>(null)

/**
 * 树结构数据
 */
const treeData = ref<TreeItem[]>([])

/** 勾选的id */
const checkedKeys = ref<number[]>([])

/** 半选中的id */
const halfCheckedKeys = ref<number[]>([])

/** 节点是否是叶子节点 */
const keyLeafPairs = ref<Map<number, boolean>>(new Map())

/** 树结构所有的key */
const allTreeKeys = ref<number[]>([])

/** 角色信息 */
const role = ref<Role>({})

/**角色数据权限 */
const dataScope = ref<DataScope>()

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    setDrawerProps({ confirmLoading: false })
    role.value = data.record
    dataScope.value = role.value?.dataScope
    if (dataScope.value == DataScope.CUSTOM) {
      setPerm(data.record.id)
    }
  },
)

/**
 * 加载树结构数据
 */
function fetch() {
  const { t } = useI18n()
  /**多语言翻译并做节点操作 */
  const setShowTitle = (v: getDeptListResultModel) => {
    if (!v) return
    v.forEach((d) => {
      d.showName = t(d.deptName)
      // 保存所有key
      allTreeKeys.value.push(d.id)
      // 判断是否是叶子节点
      if (d.children !== undefined) {
        keyLeafPairs.value.set(d.id, false)
        setShowTitle(d.children)
      } else {
        keyLeafPairs.value.set(d.id, true)
      }
    })
  }
  /**获取权限树结构 */
  getDeptList().then((r) => {
    setShowTitle(r)
    treeData.value = r as unknown as TreeItem[]
  })
}

/**获取权限列表勾选 */
const setPerm = (id) => {
  getDataScope(id).then((r: number[]) => {
    checkedKeys.value = []
    halfCheckedKeys.value = []
    r.forEach((key) => {
      if (keyLeafPairs.value.get(key)) {
        checkedKeys.value.push(key)
      } else {
        halfCheckedKeys.value.push(key)
      }
    })
    unref(dataScopeTreeRef)?.expandAll(true)
  })
}

const onCheck = (c, { halfCheckedKeys: h }) => {
  // 保存选中的和半选中的，后面保存的时候合并提交
  checkedKeys.value = c
  halfCheckedKeys.value = h
}

/**
 * 提交
 */
function handleSubmit() {
  try {
    setDrawerProps({ confirmLoading: true })
    if (role.value?.dataScope != dataScope.value) {
      role.value.dataScope = dataScope.value
      editRole(role.value)
    }
    if (role.value.dataScope === DataScope.CUSTOM) {
      setDataScope(role.value?.id, [
        ...checkedKeys.value,
        ...halfCheckedKeys.value,
      ])
    }

    closeDrawer()
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}

watch(dataScope, (n) => {
  if (n == DataScope.CUSTOM) {
    setPerm(role.value?.id)
  }
})

onMounted(() => {
  fetch()
})
</script>
