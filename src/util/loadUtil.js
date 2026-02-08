import nProgress from "nprogress";

// 显示全屏loading
export function showLoading(){
    nProgress.start(); 
}

// 隐藏全屏loading
export function hideLoading(){
    nProgress.done(); 
}