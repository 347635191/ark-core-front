import axios from "axios";
import { ElNotification } from "element-plus";

const service = axios.create({
    baseURL: "http://192.168.226.130/statistics",
    timeout: 1000,
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    return response.data.data;
}, function (error) {
    ElNotification.error({
        title: 'ERROR',
        message: '网线被猫祭咬断啦，请稍后重试',
        offset: 100,
        duration: 5000
    })
    return Promise.reject(error);
});

export default service