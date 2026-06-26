import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.server) return
    
    const user = localStorage.getItem('google_user')
    const isLoggedIn = !!user

    if (to.path === '/login' && isLoggedIn) {
        return navigateTo('/')
    }

    if (to.path !== '/login' && !isLoggedIn) {
        return navigateTo('/login')
    }
})