<script lang="ts" setup>
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

// #region gotoAbout
function gotoAbout() {
  uni.navigateTo({
    url: '/pages/about/index',
  })
}
// #endregion
</script>

<template>
  <view class="bg-white px-4" :style="{ marginTop: `${safeAreaInsets?.top}px` }">
    <view class="mt-4 text-center">
      <wd-button type="primary" class="ml-2" @click="gotoAbout">
        前往About
      </wd-button>
    </view>
  </view>
</template>
