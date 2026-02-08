import { createWebHistory, createRouter } from 'vue-router'

import Frame from '@/components/frameView.vue'
import Home from '@/pages/home/home.vue'
import Record from '@/pages/statistics/record.vue'
import Chat from '@/pages/chat/chat.vue'
import NotFound from '@/pages/404.vue'

const routes = [{
  path: '/',
  component: Frame,
  meta: {
    title: "菊爆之家"
  },
  children: [{
    path: "/",
    component: Home,
    meta: {
      title: "指挥总部"
    }
  }, {
    path: '/statistics/record',
    component: Record,
    meta: {
      title: "GVG战绩"
    }
  }, {
    path: '/chat/xxx',
    component: Chat,
    meta: {
      title: "聊天机器人"
    }
  }]
}, {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: NotFound
}]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router