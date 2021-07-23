import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import ('@/components/Login.vue')
    },
    {
      path: '/home',
      redirect: '/welcome',
      component: () => import ('@/components/Home.vue'),
      children: [
        {
          path: '/welcome',
          component: () => import('@/components/Welcome.vue')
        },
        {
          path: '/users',
          component: () => import('@/components/user/User.vue')
        },
        // {
        //   path: '/roles',
        //   component: () => import('@/components/user/User.vue')
        // },
        // {
        //   path: '/rights',
        //   component: () => import('@/components/user/User.vue')
        // },
        // {
        //   path: '/goods',
        //   component: () => import('@/components/user/User.vue')
        // },
        // {
        //   path: '/params',
        //   component: () => import('@/components/user/User.vue')
        // },
        // {
        //   path: '/categories',
        //   component: () => import('@/components/user/User.vue')
        // },{
        //   path: '/orders',
        //   component: () => import('@/components/user/User.vue')
        // },{
        //   path: '/reports',
        //   component: () => import('@/components/user/User.vue')
        // }
      ]
    }
  ],
  mode: 'history' 
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router