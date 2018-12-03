import Vue from 'vue'
import Router from 'vue-router'
import talk from '../components/talk'
import solved from '../components/solved'
import unsolved from '../components/unsolved'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'chat',
      component: talk,
      redirect:"/chat"
    },
    {
      path: '/chat',
      name: 'chat',
      component: talk,
    },
    {
      path: '/solved',
      name: 'solved',
      component: solved,
    },
    {
      path: '/unsolved',
      name: 'unsolved',
      component: unsolved,
    },
  ]
})
