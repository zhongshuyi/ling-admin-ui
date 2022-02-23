<template>
  <div class="relative p-4 m-4 ml-0 overflow-hidden bg-white permissions-tree">
    <Dropdown
      v-if="deptId !== -1"
      @click.prevent
      class="absolute z-50 cursor-pointer right-6 top-6"
    >
      <Icon icon="ion:ellipsis-vertical" />
      <template #overlay>
        <Menu>
          <MenuItem @click="expandAll"> 展开全部 </MenuItem>
          <MenuItem @click="closeAll"> 合并全部 </MenuItem>
          <MenuDivider />
          <MenuItem @click="checkALL"> 选择全部 </MenuItem>
          <MenuItem @click="cancelCheckALL"> 取消全选 </MenuItem>
        </Menu>
      </template>
    </Dropdown>
    <BasicTitle>部门权限</BasicTitle>
    <Empty
      style="margin-top: 57px"
      v-show="deptId === -1"
      description="请先选择部门"
    />
    <div v-show="deptId !== -1" class="h-full mt-3 ml-4">
      <BasicTree
        checkable
        clickRowToExpand
        :checkStrictly="false"
        :checkedKeys="checkedKeys"
        ref="treeRef"
        :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'showName' }"
        @check="onCheck"
      />
    </div>
    <div v-show="deptId !== -1" class="absolute bottom-0 right-0">
      <a-button @click="submit" class="mb-2 mr-2" type="primary">提交</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup name="PermissionsTree">
import { onMounted, watch, ref, unref, nextTick } from 'vue'

import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree'
import { BasicTitle } from '@/components/Basic/index'
import { Icon } from '@/components/Icon'
import { Empty, Dropdown, Menu, MenuItem, MenuDivider } from 'ant-design-vue'
import { getDeptPerm, setDeptPerm } from '@service/sys/dept'
import { getPerm } from '@service/sys/menu'
import { useI18n } from '@admin/locale/src/useI18n'
import { Params } from '@service/model/sys'

const props = defineProps({
  deptId: Number,
})

const treeRef = ref<Nullable<TreeActionType>>(null)

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
  const { t } = useI18n()
  /**多语言翻译并做节点操作 */
  const setShowTitle = (v: Params[]) => {
    if (v === null) return
    v.forEach((m) => {
      m.showName = t(m.name)
      // 保存所有key
      allTreeKeys.value.push(m.id)
      // 判断是否是叶子节点
      if (m.children !== undefined) {
        keyLeafPairs.value.set(m.id, false)
        setShowTitle(m.children)
      } else {
        keyLeafPairs.value.set(m.id, true)
      }
    })
  }
  /**获取权限树结构 */
  getPerm().then((r) => {
    setShowTitle(r)
    treeData.value = r as unknown as TreeItem[]
    // 全部展开
    nextTick(() => {
      unref(treeRef)?.expandAll(true)
    })
  })
}
/**获取该部门树结构并勾选 */
const setPerm = () => {
  checkedKeys.value = []
  halfCheckedKeys.value = []
  getDeptPerm(props.deptId).then((r: number[]) => {
    r.forEach((key) => {
      if (keyLeafPairs.value.get(key)) {
        checkedKeys.value.push(key)
      } else {
        halfCheckedKeys.value.push(key)
      }
    })
  })
}

const submit = () => {
  setDeptPerm(props.deptId, [
    ...checkedKeys.value,
    ...halfCheckedKeys.value,
  ]).then(() => {
    setPerm()
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

const checkALL = () => {
  halfCheckedKeys.value = []
  checkedKeys.value = allTreeKeys.value
}

const cancelCheckALL = () => {
  halfCheckedKeys.value = []
  checkedKeys.value = []
}

watch(
  () => props.deptId,
  (n) => {
    if (n !== -1) {
      setPerm()
    }
  },
)

onMounted(() => {
  fetch()
})
</script>
<style lang="less"></style>
