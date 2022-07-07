import Vue from 'vue'
import VueRouter from 'vue-router'

import ViewRootOperator from '@/views/RootOperator'
import ViewRootCustomer from '@/views/RootCustomer'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash'
})

router.addRoute({
  name: 'RootOperator',
  path: '/',
  component: ViewRootOperator
})

router.addRoute({
  name: 'RootCustomer',
  path: '/vip',
  component: ViewRootCustomer
})

export default router
