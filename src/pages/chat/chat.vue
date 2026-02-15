<template>
    <div class="chat-page">
        <!-- 头部标题 -->
        <header class="chat-header">
            <div class="header-left">
                <div class="header-title">
                    <el-icon class="icon-primary">
                        <ChatDotRound />
                    </el-icon>
                    <h1 class="title-text">星陨小助手</h1>
                </div>
                <el-tag size="small" class="tag-primary">Ark Re:Code</el-tag>
                <el-tooltip content="测速文本样例：测速 210 80 2 91 3, 要素之间用空格隔开, 己方要素在对方要素前" placement="bottom">
                    <el-button size="default" class="header-btn speed-btn ml-30" @click="handleSpeedTest">
                        <el-icon>
                            <Lightning />
                        </el-icon>
                        <span>测速</span>
                    </el-button>
                    </el-tooltip>
            </div>

            <div class="header-right">
                <el-tooltip content="清空对话" placement="bottom">
                    <el-button class="btn-clear" @click="clearMessages">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>
        </header>

        <!-- 聊天内容区域 -->
        <div class="chat-messages" ref="chatContainer">
            <!-- 欢迎信息 -->
            <div v-if="messages.length === 0" class="welcome-container">
                <el-icon class="icon-welcome">
                    <ChatLineRound />
                </el-icon>
                <h2 class="welcome-title">有什么我可以帮助你的吗？</h2>
            </div>

            <!-- 消息列表 -->
            <TransitionGroup name="message-fade">
                <div v-for="(message, index) in messages" :key="index" class="message-item">
                    <!-- 用户消息 -->
                    <template v-if="message.role === 'user'">
                        <div class="message-user-wrapper">
                            <div class="message-bubble message-bubble-user">
                                <p class="message-text">{{ message.content }}</p>
                            </div>
                        </div>
                        <el-avatar :size="36" class="avatar-user">
                            <el-icon>
                                <User />
                            </el-icon>
                        </el-avatar>
                    </template>

                    <!-- AI消息 -->
                    <template v-else>
                        <el-avatar :size="36" class="avatar-ai">
                            <el-icon class="icon-primary-ai">
                                <Monitor />
                            </el-icon>
                        </el-avatar>
                        <div class="message-ai-wrapper">
                            <div class="message-sender">星陨小助手</div>
                            <div class="message-bubble message-bubble-ai">
                                <p class="message-text">{{ message.content }}</p>
                            </div>
                        </div>
                    </template>
                </div>
            </TransitionGroup>

            <!-- 加载状态 -->
            <div v-if="isLoading" class="message-item">
                <el-avatar :size="36" class="avatar-ai">
                    <el-icon class="icon-primary-ai">
                        <Monitor />
                    </el-icon>
                </el-avatar>
                <div class="message-ai-wrapper">
                    <div class="message-sender">星陨小助手</div>
                    <div class="message-bubble message-bubble-ai">
                        <div class="loading-dots">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部输入区域 -->
        <div class="chat-footer">
            <div class="input-container">
                <div class="input-wrapper">
                    <el-input v-model="inputMessage" type="textarea" :rows="1" placeholder="给星陨小助手发送消息" resize="none"
                        class="chat-input" :autosize="{ minRows: 1, maxRows: 5 }"
                        @keydown.enter.prevent="handleSendMessage" />

                    <div class="send-button-wrapper">
                        <el-tooltip content="发送" placement="top">
                            <el-button type="primary" :disabled="!inputMessage.trim()" class="btn-send"
                                @click="sendMessage">
                                <el-icon>
                                    <Position />
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                    </div>
                </div>

                <!-- 底部提醒 -->
                <p class="footer-tip">
                    星源能量偶有不稳，数据情报仅供参考
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import useWebSocket from '@/api/useWebSocket'
import { WS_BASE_URL } from '@/config/index';

// 消息列表
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)
const wsUrl = `${WS_BASE_URL}/chatWs`;

// 创建 WebSocket 实例（在组件初始化时创建）
const ws = useWebSocket(wsUrl, {
    onOpen: () => {
        console.log("WebSocket connected successfully");
    },
    onClose: () => {
        console.log("WebSocket closed");
        // 可以在这里添加重连提示
        if (isLoading.value) {
            messages.value.push({
                role: 'assistant',
                content: '连接已断开'
            });
            isLoading.value = false;
        }
    },
    onError: (err) => {
        console.error("WebSocket connection error", err);
        if (isLoading.value) {
            messages.value.push({
                role: 'assistant',
                content: '连接失败，请稍后重试'
            });
            isLoading.value = false;
            scrollToBottom();
        }
    },
    onMessage: (data) => {
        try {
            const message = JSON.parse(data);
            messages.value.push({
                role: 'assistant',
                content: message.data[0]
            });
            isLoading.value = false;
            scrollToBottom();
        } catch (e) {
            console.error("Message parsing error:", e);
        }
    },
});

// 发送消息
const sendMessage = async () => {
    if (!inputMessage.value.trim()) return

    const userMessage = inputMessage.value.trim()

    // 添加用户消息
    messages.value.push({
        role: 'user',
        content: userMessage
    })

    inputMessage.value = ''
    isLoading.value = true

    // 使用已有的 WebSocket 实例发送消息
    ws.send({
        messageType: "chat",
        question: userMessage
    });

    // 滚动到底部
    await scrollToBottom()
}

const clearMessages = () => {
    messages.value = []
}

const handleSpeedTest = () => {
    inputMessage.value = '测速 己方速度【210】 己方行动值【80】 己方乱速值【2】 对方行动值【90】 对方乱速值【3】, 直接替换里面的数值即可'
}

// 处理回车发送
const handleSendMessage = (e) => {
    // 如果是 Ctrl + Enter，插入换行
    if (e.ctrlKey && e.key === 'Enter') {
        // 在光标位置插入换行符
        const textarea = e.target
        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        inputMessage.value =
            inputMessage.value.substring(0, start) +
            '\n' +
            inputMessage.value.substring(end)

        // 下次 tick 后设置光标位置到新行的后面
        nextTick(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 1
        })
        return
    }

    // 如果是单独按 Enter，发送消息
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault()  // 防止添加换行
        sendMessage()
    }
}

// 滚动到底部
const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}
</script>

<style scoped>
.chat-page {
    height: calc(100vh - 100px);
    background-color: #f5f7fa;
    color: #374151;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 头部样式 */
.chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid #e4e7ed;
    background-color: white;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.icon-primary {
    color: #10a37f;
    font-size: 1.5rem;
}

.icon-primary-ai {
    color: white;
    font-size: 1.5rem;
}

.title-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
}

.tag-primary {
    background-color: #10a37f !important;
    border-color: transparent !important;
    color: white !important;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-clear {
    background-color: transparent !important;
    border: 1px solid #e4e7ed !important;
    color: #4b5563;
}

.btn-clear:hover {
    color: #10a37f !important;
    border-color: #10a37f !important;
}

/* 聊天内容区域 */
.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-bottom: 1px solid #e4e7ed;
}

/* 欢迎信息 */
.welcome-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
}

.icon-welcome {
    color: #10a37f;
    font-size: 3.75rem;
    margin-bottom: 1rem;
}

.welcome-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 0.5rem;
}

.welcome-desc {
    color: #6b7280;
}

/* 消息项 */
.message-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

/* 用户消息 */
.message-user-wrapper {
    flex: 1;
    display: flex;
    justify-content: flex-end;
}

.message-bubble {
    max-width: 70%;
    padding: 0.75rem 1rem;
}

.message-bubble-user {
    background-color: #10a37f;
    color: white;
    border-radius: 1rem;
    border-top-right-radius: 0.25rem;
    width: fit-content;
    max-width: 70%;
    word-wrap: break-word;
    word-break: break-word;
}

.message-text {
    font-size: 0.875rem;
    line-height: 1.625;
    white-space: pre-wrap;
}

.avatar-user {
    flex-shrink: 0;
    background-color: #10a37f !important;
}

/* AI消息 */
.avatar-ai {
    flex-shrink: 0;
    background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
    /* 蓝色渐变 */
    border: 1px solid #1d4ed8 !important;
}

.message-ai-wrapper {
    flex: 1;
}

.message-sender {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
}

.message-bubble-ai {
    background-color: white;
    border-radius: 1rem;
    border-top-left-radius: 0.25rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid #e4e7ed;

    padding: 0.75rem 1rem;
    width: fit-content;
    max-width: 70%;
    word-wrap: break-word;
    word-break: break-word;
}

.message-item:hover {
    opacity: 1;
}

.btn-action {
    background-color: transparent !important;
    border: none !important;
    color: #9ca3af !important;
}

.btn-action:hover {
    color: #10a37f !important;
}

/* 加载动画 */
.loading-dots {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.dot {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #3b82f6;
    border-radius: 9999px;
    animation: bounce 1s infinite;
    will-change: transform;
    backface-visibility: hidden;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

/* 底部输入区域 */
.chat-footer {
    background-color: white;
    padding: 1rem;
}

.input-container {
    max-width: 56rem;
    margin: 0 auto;
}

.input-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    background-color: #f5f7fa;
    border-radius: 0.5rem;
    border: 1px solid #e4e7ed;
    padding: 0.5rem;
}

.chat-input {
    flex: 1;
}

:deep(.chat-input .el-textarea__inner) {
    box-shadow: none !important;
    background: transparent !important;
    color: #374151 !important;
}

:deep(.chat-input .el-textarea__inner:focus) {
    box-shadow: none !important;
}

.send-button-wrapper {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding-bottom: 0.25rem;
}

.btn-send {
    background-color: #10a37f !important;
    border-color: transparent !important;
    border-radius: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
}

.btn-send:hover {
    background-color: #0d8c6f !important;
}

.btn-send:disabled {
    background-color: #10a37f !important;
    opacity: 0.5;
}

.footer-tip {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.5rem;
    text-align: center;
}

/* 自定义滚动条样式 */
.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f5f7fa;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #d0d7de;
    border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #10a37f;
}

.animate-bounce {
    animation: bounce 1s infinite;
}

/* 消息淡入淡出动画 */
.message-fade-enter-active,
.message-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-fade-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
}

.message-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.96);
}

.message-fade-move {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>