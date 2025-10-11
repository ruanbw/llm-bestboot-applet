<script lang="ts" setup>
defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    // navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const list = [
  {
    id: '1',
    title: '智能助手-员工手册',
    description: '员工守则、请假、报销等相关。',
    meta: 'text',
    tags: ['CHAT', 'RAG'],
  },
]

// #region gotoChat
function gotoChat(item) {
  uni.navigateTo({
    url: `/pages/chat/index?id=${item.id}`,
  })
}
// #endregion
</script>

<template>
  <view class="bg-white p-4">
    <view v-for="item in list" :key="item.id" @click="gotoChat(item)">
      <!-- 基础卡片 -->
      <UniBeautifulCard
        :title="item.title" :description="item.description" :meta="item.meta" :tags="item.tags"
        @action="gotoChat"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
