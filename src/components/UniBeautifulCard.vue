<template>
  <view
    class="overflow-hidden rounded-xl border-solid bg-white shadow-sm transition duration-200" :class="{
      'border-l-4 border-blue-500': accent === 'blue',
      'border-l-4 border-emerald-500': accent === 'green',
      'border-l-4 border-amber-500': accent === 'amber',
      'border-l-4 border-purple-500': accent === 'purple',
    }"
  >
    <!-- 图片区（可选） -->
    <view v-if="image" class="h-40 w-full">
      <image :src="image" :alt="title" class="h-full w-full object-cover" mode="aspectFill" @error="handleImageError" />
    </view>

    <!-- 内容区 -->
    <view class="p-4">
      <!-- 标题 -->
      <text v-if="title" class="line-clamp-1 mb-1 block text-base text-gray-800 font-bold">
        {{ title }}
      </text>

      <!-- 描述 -->
      <text v-if="description" class="line-clamp-2 mb-3 block text-sm text-gray-600">
        {{ description }}
      </text>

      <!-- 自定义内容插槽 -->
      <slot name="content" />

      <!-- meta -->
      <text v-if="meta" class="text-xs text-gray-500">
        <slot name="meta">{{ meta }}</slot>
      </text>

      <!-- tags -->
      <view class="mt-3 flex items-center gap-4 border-t border-gray-100">
        <slot name="tags">
          <text v-for="tag in tags" :key="tag" class="text-xs text-gray-500">
            {{ tag }}
          </text>
        </slot>
      </view>

      <!-- 底部操作区 -->
      <view v-if="showActions" class="mt-3 flex items-center justify-end border-t border-gray-100">
        <view>
          <slot name="actions">
            <button
              v-if="onAction" size="mini" type="default" class="text-sm text-blue-600" :class="{
                'text-emerald-600': accent === 'green',
                'text-amber-600': accent === 'amber',
                'text-purple-600': accent === 'purple',
              }" @click="onAction"
            >
              {{ actionText || '操作' }}
            </button>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  meta: {
    type: String,
    default: '',
  },
  tags: {
    type: Array,
    default: () => [],
  },
  accent: {
    type: String,
    default: 'blue',
    validator: val => ['blue', 'green', 'amber', 'purple'].includes(val),
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  actionText: {
    type: String,
    default: '操作',
  },
})

const emit = defineEmits(['action'])

function onAction() {
  emit('action')
}

function handleImageError(e) {
  console.warn('图片加载失败:', e.detail?.errMsg || e)
}
</script>

<style scoped>
/* 确保 text 换行截断在小程序中生效 */
.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.line-clamp-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Tailwind 的 shadow 在部分小程序平台可能弱化，可手动增强 */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
