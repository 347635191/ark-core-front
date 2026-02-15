import { onUnmounted } from "vue";

export default (url, options = {}) => {
    // 默认配置
    const {
        reconnectLimit = 3, // 重连限制次 number | null = 无限重连
        reconnectInterval = 3000, // 重连间隔 ms
        heartbeatInterval = 30000, // 心跳间隔 ms
        onOpen, // 连接成功时的回调函数
        onError, // 连接出错时的回调函数
        onMessage, // 收到消息时的回调函数
        onClose, // 连接关闭时的回调函数
    } = options;

    let status = "disconnected"; // 'disconnected: 未连接' | 'connecting: 正在连接' | 'connected: 已连接'
    let socket = null; // socket 对象
    let reconnectCount = 0; // 重新连接次数
    let reconnectTimer = null; // 重新连接计时器
    let heartbeatTimer = null; // 心跳计时器

    // 初始化 WebSocket
    const initWebSocket = () => {
        if (socket) socket.close();
        status = "connecting";
        socket = new WebSocket(url);

        socket.onopen = (event) => {
            status = "connected";
            reconnectCount = 0;
            startHeartbeat();
            onOpen?.(event);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.messageType === "heartBeat") return; // 忽略心跳响应
            onMessage?.(event.data);
        };

        socket.onerror = (error) => {
            onError?.(error);
            handleDisconnect();
        };

        socket.onclose = (event) => {
            onClose?.(event);
            handleDisconnect();
        };
    };

    // 处理断开连接
    const handleDisconnect = () => {
        status = "disconnected";
        stopHeartbeat();

        if (reconnectLimit === null || reconnectCount < reconnectLimit) {
            reconnectCount++;
            reconnectTimer = setTimeout(initWebSocket, reconnectInterval);
        }
    };

    // 启动心跳
    const startHeartbeat = () => {
        stopHeartbeat();
        heartbeatTimer = setInterval(() => {
            if (status === "connected" && socket) {
                socket.send(JSON.stringify({ messageType: "heartBeat" }));
            }
        }, heartbeatInterval);
    };

    // 停止心跳
    const stopHeartbeat = () => {
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer);
            heartbeatTimer = null;
        }
    };

    // 连接 WebSocket
    const connect = () => {
        if (status !== "disconnected") return;
        reconnectCount = 0;
        initWebSocket();
    };

    // 断开 WebSocket
    const disconnect = () => {
        if (status !== "connected") return;
        socket?.close(1000, "User disconnected");
    };

    // 发送消息
    const send = (message) => {
        if (status !== "connected" || !socket) return;
        socket.send(
            typeof message === "object" ? JSON.stringify(message) : message
        );
    };

    // 组件卸载时清理
    onUnmounted(() => {
        disconnect();
        if (reconnectTimer) clearTimeout(reconnectTimer);
        stopHeartbeat();
    });

    // 自动连接
    connect();

    return {
        connect,
        disconnect,
        send,
        getStatus: () => status,
        getReconnectCount: () => reconnectCount
    };
};