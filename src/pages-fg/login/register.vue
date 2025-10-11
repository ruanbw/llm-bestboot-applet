<script lang="ts" setup>
import { useUserStore } from '@/store/user'

definePage({
  style: {
    navigationBarTitleText: '注册',
  },
})

const userStore = useUserStore()

const form = ref({
  username: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名' },
  ],
  password: [
    { required: true, message: '请输入密码' },
  ],
}

const formRef = ref()

async function doLogin() {

  const { valid } = await formRef.value.validate()
  if (!valid) {
    return
  }

  try {
    // 调用注册接口
    await userStore.register({
      username: form.value.username,
      password: form.value.password,
    })
    uni.navigateBack()
  }
  catch (error) {
    console.log('注册失败', error)
    uni.showToast({
      title: '注册失败',
      icon: 'none',
    })
    return
  }
}
</script>

<template>
  <view class="login p-4">
    <view class="text-center text-2xl my-8">
      注册
    </view>
    <wd-form ref="formRef" :model="form" :rules="rules">
      <wd-input
      label="用户名"
        v-model="form.username"
        prop="username"
        placeholder="请输入用户名"
        clearable
      />
      <wd-input
      label="密码"
        v-model="form.password"
        prop="password"
        placeholder="请输入密码"
        type="safe-password"
        clearable
        show-password
      />
      <view class="p-4">
        <wd-button type="primary" block size="large" @click="doLogin">
          注册
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
