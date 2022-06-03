<template>
  <div class="pb-4 m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      show-line
      ref="treeRef"
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'deptName' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup name="UserDeptTree">
import { nextTick, onMounted, ref, unref, watch } from 'vue'

import { BasicTree, TreeActionType, TreeItem } from '@/components/Tree'
import { getDeptList } from '@service/sys/dept'

const emit = defineEmits(['select'])
/**
 * 操作树需要的ref
 */
const treeRef = ref<Nullable<TreeActionType>>(null)
/**
 * 部门树信息
 */
const treeData = ref<any[]>([])

const handleSelect = (keys) => {
  emit('select', keys[0])
}

const fetch = async () => {
  treeData.value = (await getDeptList()) as unknown as TreeItem[]
}

onMounted(() => {
  fetch()
})

watch(
  () => treeData.value,
  () => {
    nextTick(() => {
      unref(treeRef)?.expandAll(true)
    })
  },
)
</script>
