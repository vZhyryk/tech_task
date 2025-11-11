/**
 * @typedef {Object} Route
 * @property {string} path
 * @property {string} name
 * @property {() => Promise<any>} component
 * @property {Route[]} [children]
 */

/** @type {Route[]} */
const routes = [
    {
        path: '/',
        name: 'MainLayout',
        component: () => import('/src/layout/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'HomePage',
                component: () => import('/src/pages/HomePage.vue'),
            },
            {
                path: 'pokemon/:name',
                name: 'modal',
                component: () => import('/src/pages/DetailsPage.vue'),
            },
            {
                path: ':pathMatch(.*)*',
                name: 'NotFound',
                component: () => import('/src/pages/Error404.vue'),
            },
        ],
    },
];

export default routes;
