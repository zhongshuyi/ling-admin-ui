<template>
  <div v-if="props.deptId === -1">
    <Empty description="请先选择部门" />
  </div>
  <div v-else class="flex flex-col">
    <div class="item">
      <div class="item-name">部门名称:</div>
      <div class="item-value">{{ deptInfo.deptName }}</div>
    </div>
    <div class="item">
      <div class="item-name">负责人:</div>
      <div class="item-value">{{ deptInfo.leader }}</div>
    </div>
    <div class="item">
      <div class="item-name">联系方式:</div>
      <div class="item-value">{{ deptInfo.phone }}</div>
    </div>
    <div class="item">
      <div class="item-name">备注:</div>
      <div class="item-value">{{ deptInfo.remark }}</div>
    </div>
  </div>
</template>
<script lang="ts" name="DeptInfo" setup>
import { ref, watch } from 'vue'
import { Empty } from 'ant-design-vue'

import { Dept } from '@service/model/sys/dept'
import { getDept } from '@service/sys/dept'
const props = defineProps({
  deptId: Number,
})
/** 部门详细信息 */
const deptInfo = ref<Dept>({
  children: [],
  email: '',
  id: 0,
  leader: '',
  orderNum: 0,
  parentId: 0,
  parentList: '',
  phone: '',
  showName: '',
  deptName: '',
})
watch(
  props,
  async () => (deptInfo.value = await getDept(props.deptId as Number)),
)
</script>
<style lang="less" scoped>
.item {
  display: flex;
  margin-bottom: 10px;
}

.item-name {
  min-width: 60px;
  margin-right: 10px;
  color: #919191;
}

.item-value {
  font-weight: bold;
  color: #1a1a1a;
}
</style>
