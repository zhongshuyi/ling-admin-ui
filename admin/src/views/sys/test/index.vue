<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <CropperAvatar
      :value="'http://127.0.0.1:9000/mall/img/avatar/ef89cd7b-bec7-4911-978a-48f7e5ef6e0a.jpg'"
      :uploadApi="avatar"
      :data="{ id: 2 }"
      :showBtn="false"
      width="100"
    />
  </PageWrapper>
</template>
<script lang="ts" setup name="Test">
import { PageWrapper } from '@/components/Page'

import { CropperAvatar } from '@/components/Cropper'
import { avatar } from '@admin/service/modules/sys/user'
</script>
