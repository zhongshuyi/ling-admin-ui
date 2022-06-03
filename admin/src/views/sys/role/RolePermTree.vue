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
    <template #title
      >角色权限
      <Dropdown
        @click.prevent
        class="absolute z-50 cursor-pointer right-6 top-6"
      >
        <Icon icon="ion:ellipsis-vertical" />
        <template #overlay>
          <Menu>
            <MenuItem @click="expandAll"> 展开全部</MenuItem>
            <MenuItem @click="closeAll"> 合并全部</MenuItem>
            <MenuDivider />
            <MenuItem @click="checkALL"> 选择全部</MenuItem>
            <MenuItem @click="cancelCheckALL"> 取消全选</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </template>
    <BasicTree
      checkable
      clickRowToExpand
      :checkStrictly="false"
      :checkedKeys="checkedKeys"
      ref="permTreeRef"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'name' }"
      @check="onCheck"
    />
  </BasicDrawer>
</template>
<script lang="ts" setup name="RolePermTree">
import { onMounted, ref, unref } from 'vue'

import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { Icon } from '@/components/Icon'
import { BasicTree, TreeActionType, TreeItem } from '@/components/Tree'
import { Dropdown, Menu, MenuDivider, MenuItem } from 'ant-design-vue'
import { getPerm } from '@service/sys/menu'
import { getPermIds, setPermIds } from '@service/sys/role'
import { Params } from '@service/model/sys/menu'

const permTreeRef = ref<Nullable<TreeActionType>>(null)

/** 树结构数据 */
const treeData = ref<TreeItem[]>([])

/** 勾选的id */
const checkedKeys = ref<number[]>([])

/**半选中的id */
const halfCheckedKeys = ref<number[]>([])

/**节点是否是叶子节点 */
const keyLeafPairs = ref<Map<number, boolean>>(new Map())

/**树结构所有的key */
const allTreeKeys = ref<number[]>([])

/**角色id*/
const id = ref<number>()

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    setDrawerProps({ confirmLoading: false })
    id.value = data.record.id
    setPerm(data.record.id)
  },
)

/**
 * 加载树结构数据
 */
function fetch() {
  /**结果处理 */
  const toDealWith = (v: Params[]) => {
    if (v.length === 0) return
    v.forEach((m) => {
      // 保存所有key
      allTreeKeys.value.push(m.id)
      // 判断是否是叶子节点
      if (m.children !== undefined) {
        keyLeafPairs.value.set(m.id, false)
        toDealWith(m.children)
      } else {
        keyLeafPairs.value.set(m.id, true)
      }
    })
  }
  /**获取权限树结构 */
  getPerm().then((r) => {
    toDealWith(r)
    treeData.value = r as unknown as TreeItem[]
  })
}

/**获取该权限树结构并勾选 */
const setPerm = (id) => {
  getPermIds(id).then((r: number[]) => {
    checkedKeys.value = []
    halfCheckedKeys.value = []
    r.forEach((key) => {
      if (keyLeafPairs.value.get(key)) {
        checkedKeys.value.push(key)
      } else {
        halfCheckedKeys.value.push(key)
      }
    })
    unref(permTreeRef)?.expandAll(true)
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
    setPermIds(id.value, [...checkedKeys.value, ...halfCheckedKeys.value])
    closeDrawer()
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}

/**展开全部 */
const expandAll = () => {
  unref(permTreeRef)?.expandAll(true)
}

/**合并全部 */
const closeAll = () => {
  unref(permTreeRef)?.expandAll(false)
}

/**
 * 选择全部
 */
const checkALL = () => {
  halfCheckedKeys.value = []
  checkedKeys.value = allTreeKeys.value
}

/**
 * 取消全部选择
 */
const cancelCheckALL = () => {
  halfCheckedKeys.value = []
  checkedKeys.value = []
}

onMounted(() => {
  fetch()
})
</script>
