<script lang="ts" setup>
import { LOGIN_PAGE } from '@/router/config'
import { useTokenStore } from '@/store/token'
import { tabbarList } from '@/tabbar/config'
import { isPageTabbar } from '@/tabbar/store'
import { ensureDecodeURIComponent } from '@/utils'
import { parseUrlToObj } from '@/utils/index'

definePage({
  style: {
    navigationBarTitleText: '',
  },
})

const redirectUrl = ref('')

onLoad((options) => {
  if (options.redirect) {
    redirectUrl.value = ensureDecodeURIComponent(options.redirect)
  }
  else {
    redirectUrl.value = tabbarList[0].pagePath
  }
})

const tokenStore = useTokenStore()

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

// #ifdef MP-WEIXIN
// 微信小程序下登录
async function handleLogin() {
  // todo 
  // await tokenStore.wxLogin()
  // uni.navigateTo({
  //   url: `${LOGIN_PAGE}?redirect=${encodeURIComponent('/pages/index/index')}`,
  // })
}
// #endif

async function doLogin() {
  if (tokenStore.hasLogin) {
    uni.navigateBack()
    return
  }

  const { valid } = await formRef.value.validate()
  if (!valid) {
    return
  }

  try {
    // 调用登录接口
    await tokenStore.login({
      username: form.value.username,
      password: form.value.password,
    })
  }
  catch (error) {
    console.log('登录失败', error)
    uni.showToast({
      title: '登录失败',
      icon: 'none',
    })
    return
  }
  let path = redirectUrl.value
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  const { path: _path, query } = parseUrlToObj(path)
  if (isPageTabbar(_path)) {
    // 经过我的测试 switchTab 不能带 query 参数, 不管是放到 url  还是放到 query ,
    // 最后跳转过去的时候都会丢失 query 信息
    uni.switchTab({
      url: path,
    })
    // uni.switchTab({
    //   url: _path,
    //   query,
    // })
  }
  else {
    // 自己决定是 redirectTo 还是 navigateBack
    uni.redirectTo({
      url: path,
    })
    // uni.navigateBack()
  }
}
</script>

<template>
  <view class="login p-4">
    <view class="text-center text-2xl my-8">
      登录
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
          登录
        </wd-button>
        <!-- #ifdef MP-WEIXIN -->
        <wd-button class="mt-4" type="success" block size="large" @click="handleLogin">
          微信一键登录
        </wd-button>
        <!-- #endif -->
      </view>
    </wd-form>
    <view class="flex justify-center">
      没有账号？<navigator class="text-blue" url="/pages-fg/login/register">去注册</navigator>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
