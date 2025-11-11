import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

/** @type {import('vue-router').Router} */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

export default router;
