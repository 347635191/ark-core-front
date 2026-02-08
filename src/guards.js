import router from "./router"
import { showLoading, hideLoading } from "./util/loadUtil"

//全局前置守卫
router.beforeEach((to, from, next) => {
    showLoading()
    let title = to.meta.title ? to.meta.title : "菊爆之家"
    document.title = title
    next()
})

//全局后置守卫
router.beforeEach((to, from) => {
    hideLoading()
})
