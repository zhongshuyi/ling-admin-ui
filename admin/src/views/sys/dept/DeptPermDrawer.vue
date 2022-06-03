<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="部门权限"
    width="400px"
    @ok="handleSubmit"
    :closable="false"
  >
    <Dropdown @click.prevent class="absolute z-50 cursor-pointer right-6 top-6">
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
    <BasicTree
      checkable
      clickRowToExpand
      :checkStrictly="false"
      :checkedKeys="checkedKeys"
      ref="treeRef"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'name' }"
      @check="onCheck"
    />
  </BasicDrawer>
</template>
<script lang="ts" setup name="DeptDrawer">
import { Dropdown, Menu, MenuDivider, MenuItem } from 'ant-design-vue'

import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { BasicTree, TreeActionType, TreeItem } from '@/components/Tree'
import { Icon } from '@/components/Icon'
import { nextTick, ref, unref } from 'vue'
import { Params } from '@service/model'
import { getPerm } from '@service/sys/menu'
import { getDeptPerm, setDeptPerm } from '@service/sys/dept'

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    deptId.value = data.deptId
    fetch()
    setDrawerProps({ confirmLoading: false })
  },
)

const treeRef = ref<Nullable<TreeActionType>>(null)

/**
 * 选中的部门id.
 */
const deptId = ref(-1)

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
    // 全部展开
    nextTick(() => {
      unref(treeRef)?.expandAll(true)
    })
    setPerm()
  })
}

/**获取该部门树结构并勾选 */
const setPerm = () => {
  checkedKeys.value = []
  halfCheckedKeys.value = []
  getDeptPerm(deptId.value).then((r: number[]) => {
    r.forEach((key) => {
      if (keyLeafPairs.value.get(key)) {
        checkedKeys.value.push(key)
      } else {
        halfCheckedKeys.value.push(key)
      }
    })
  })
}

const onCheck = (c, { halfCheckedKeys: h }) => {
  // 保存选中的和半选中的，后面保存的时候合并提交
  checkedKeys.value = c
  halfCheckedKeys.value = h
}

/**展开全部 */
const expandAll = () => {
  unref(treeRef)?.expandAll(true)
}

/**合并全部 */
const closeAll = () => {
  unref(treeRef)?.expandAll(false)
}

/**
 * 全选
 */
const checkALL = () => {
  halfCheckedKeys.value = []
  checkedKeys.value = allTreeKeys.value
}

/**
 * 取消全选
 */
const cancelCheckALL = () => {
  halfCheckedKeys.value = []
  checkedKeys.value = []
}

async function handleSubmit() {
  setDeptPerm(deptId.value as Number, [
    ...checkedKeys.value,
    ...halfCheckedKeys.value,
  ]).then(() => {
    closeDrawer()
  })
}
</script>
