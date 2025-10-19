<template>
  <view class="chat-container" :style="{ height: `${windowHeight}px` }">
    <!-- 消息区域 -->
    <scroll-view
      class="message-list" :scroll-top="scrollTop" scroll-y :scroll-with-animation="true"
      @scroll="handleScroll"
    >
      <view
        v-for="(msg, index) in messages" :key="index" class="message-item"
        :class="{ user: msg.role === 'user', ai: msg.role === 'assistant' }"
      >
        <mp-html :content="msg.content" markdown />
      </view>

      <!-- 加载中提示 -->
      <view v-if="loading" class="message-item ai loading">
        <text>思考中...</text>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input
        v-model="inputText" class="input-field" placeholder="请输入消息..." confirm-type="send" :disabled="loading"
        @confirm="handleSend"
      >
      <button class="send-btn" :disabled="!inputText.trim() || loading" @click="handleSend">
        发送
      </button>
    </view>
  </view>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { getChat } from '@/api/chat'
import { chatMessages } from '@/api/llm'
import { useUserStore } from '@/store/user'
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html'

defineOptions({ name: 'Chat' })

let id = void 0
const chatInfo = ref({})

onLoad((options) => {
  id = options.id
})

onShow(() => {
  getChat(id).then((res) => {
    chatInfo.value = res
    uni.setNavigationBarTitle({
      title: chatInfo.value.chatName,
    })
  })
})

definePage({
  style: {
    navigationBarTitleText: '聊天',
  },
})

const userStore = useUserStore()
// 获取窗口高度
const systemInfo = uni.getSystemInfoSync()
const windowHeight = ref(systemInfo.windowHeight)

const messages = ref([])
// const messages = ref([
//     { role: 'user', content: "请假需要注意什么？" },
//     {
//         role: 'assistant',
//         content: `根据公司规定，请假需注意以下事项：

// 1. **请假类型与提前申请时间**：
//    - **年假、病假、事假（3个工作日以内）**：需至少提前1天完成休假流程。
//    - **产假、婚假及超过3个工作日的年假、病假、事假**：需至少提前3天完成休假流程。
//    - **事假**：原则上一年累计不超过15天，期间按日扣全额工资。

// 2. **特殊情况处理**：
//    - 如遇突发病症、丧假或临时事假等意外情况，需及时通知部门负责人，并在休假结束上班第一天补办手续。

// 3. **申请流程**：
//    - 所有休假（除特殊情况外）需通过OA系统提交《休假申请单》。
//    - 年假申请前需先由人力资源部核实假期天数。

// 4. **缺勤与后果**：
//    - 未按规定请假可能导致缺勤记录：
//      - 当月缺勤2次以内不扣款。
//      - 超过2次后，每次扣款50元。
//      - 当月缺勤5次视为严重违规，公司有权解除劳动关系。
//      - 全年累计缺勤5次以上，取消当年晋级资格。

// 请务必遵守流程，确保工作安排不受影响。如有具体问题，可咨询人力资源部门。`
//     },
//     { role: 'user', content: "离职手续的流程是什么？" },
//     {
//         role: 'assistant',
//         content: `根据公司规定，离职手续的流程主要包括以下步骤：

// 1. **工作交接**：
//    - 员工在劳动合同解除、终止或辞职被批准时，需将所有与公司业务相关的文件、资料、案卷、书籍、记录及其他公司财产交还给公司指定接收人员。
//    - 必须详细向交接人员说明当前工作或合同执行情况，并签署书面交接记录。未完成交接的，公司不予办理离职手续。
//    - 如因未按时交接造成公司损失，公司有权要求赔偿。

// 2. **书面通知要求**：
//    - 若员工因个人原因辞职，需提前30天书面通知公司。
//    - 若公司辞退员工（如因不胜任工作、医疗期满无法工作或客观情况变化导致合同无法履行），需提前30天书面通知或支付一个月工资代替通知期。

// 3. **离职手续办理**：
//    - 完成工作交接后，公司方可为员工办理离职相关手续（如结算薪资、出具离职证明等）。

// 请确保严格遵循上述流程，以避免不必要的纠纷或损失。如有具体疑问，建议咨询人力资源部门。`
//     }
// ]);

const inputText = ref('')
const loading = ref(false)
const conversationId = ref('')
const scrollTop = ref(0)
const isAtBottom = ref(true)

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || loading.value)
    return

  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  loading.value = true

  await nextTick()
  scrollToBottom()

  try {
    const res = await chatMessages(id, {
      inputs: {},
      query: text,
      response_mode: 'blocking',
      conversation_id: conversationId.value,
      user: `applet-user-${userStore.userInfo.id}`, // 用以在 dify logs 页面标识是哪个用户
      files: [],
    })

    conversationId.value = res.conversation_id
    // 修复后端返回的转义换行符
    const formattedAnswer = res.answer.replace(/\\n/g, '\n')
    messages.value.push({ role: 'assistant', content: formattedAnswer })
  }
  catch (error) {
    console.error('聊天请求失败:', error)
    uni.showToast({ title: '发送失败', icon: 'none', duration: 1500 })
    messages.value.push({ role: 'assistant', content: '抱歉，我暂时无法回答，请稍后再试。' })
  }
  finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// ✅ 简化版：直接设极大值滚到底
function scrollToBottom() {
  scrollTop.value = 999999
}

function handleScroll(e) {
  const { scrollTop: st, scrollHeight, clientHeight } = e.detail
  isAtBottom.value = st + clientHeight >= scrollHeight - 10
}

// 可选：页面加载后立即滚到底（已有历史消息时）
onMounted(() => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
}

.message-list {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
  height: 0;
}

.message-item {
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 28rpx;
}

.user {
  background-color: #07c160;
  color: white;
  align-self: flex-end;
  margin-left: auto;
}

.ai {
  background-color: white;
  color: black;
  align-self: flex-start;
}

.loading {
  color: #999;
}

.input-area {
  display: flex;
  padding: 20rpx;
  background-color: white;
  border-top: 1rpx solid #e0e0e0;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.input-field {
  flex: 1;
  height: 60rpx;
  padding: 0 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  margin-right: 20rpx;
}

.send-btn {
  width: 120rpx;
  height: 60rpx;
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.send-btn:disabled {
  background-color: #ccc;
}
</style>
