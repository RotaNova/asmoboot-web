import login from '@/views/login/index.vue'
export default [
    {
        path: '/login',
        component: login
    }, {
        path: '/',
        component: login
    }, {
        path: '*',
        component: login
    }
]
