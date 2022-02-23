<template>
  <div class="pb-4 m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      ref="treeRef"
      toolbar
      search
      :clickRowToExpand="false"
      :beforeRightClick="getRightMenuList"
      :treeData="props.treeData"
      :fieldNames="{ key: 'id', title: 'deptName' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup name="DeptTree">
import { ref, unref, nextTick, PropType, watch } from 'vue'

import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree'
import type { ContextMenuItem } from '@/components/ContextMenu'

import { useMessage } from '@/hooks/web/useMessage'
import { checkDeptHasChildren, delDept } from '@service/sys/dept'
const { createConfirm } = useMessage()

const emit = defineEmits(['select', 'handleAdd', 'refreshData'])
const treeRef = ref<Nullable<TreeActionType>>(null)

const getRightMenuList = ({ eventKey }): ContextMenuItem[] => {
  return [
    {
      label: '删除',
      handler: () => {
        handleDelete(eventKey)
      },
    },
    {
      label: '新增',
      handler: () => {
        handleAdd(eventKey)
      },
    },
  ]
}

const props = defineProps({
  treeData: Array as unknown as PropType<TreeItem[]>,
})

const handleSelect = (keys) => {
  emit('select', keys[0])
}

const handleAdd = (id: number) => {
  emit('handleAdd', id)
}

const handleDelete = (id: number) => {
  checkDeptHasChildren(id).then((v) => {
    let message = ''
    if (v) {
      message = '该部门有子部门,确认全部删除吗?'
    } else {
      message = '确认删除该部门吗'
    }
    createConfirm({
      title: () => '提示',
      content: () => message,
      onOk: () => {
        delDept(id).then(() => {
          emit('refreshData')
        })
      },
      iconType: 'warning',
      mask: true,
      maskClosable: true,
    })
  })
}

watch(
  () => props.treeData,
  () => {
    nextTick(() => {
      unref(treeRef)?.expandAll(true)
    })
  },
)
</script>
