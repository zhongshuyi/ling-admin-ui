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
import { ref, unref, nextTick, watch, onMounted } from 'vue'

import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree'
import { useI18n } from '@admin/locale/src/useI18n'
import { getDeptListResultModel } from '@service/model/sys/dept'
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
  treeData.value = (await getDeptList()) as unknown as TreeItem[]
  setShowTitle(treeData.value)
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
