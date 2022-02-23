<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <CropperAvatar
      :value="'http://127.0.0.1:9000/mall/img/avatar/0139d7b5-6019-4bf3-a962-7887dc7060a2.jpg'"
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
