<template>
    <div class="page">
        <header class="header">
            <ButtonTemplate v-if="route.path !== '/'" @handleBtnClick="handleBackToHome" btnText="Back to home" class="back_home_btn" />

            <h1>PokiFinder</h1>
        </header>
        <main class="main">
            <router-view />
        </main>

        <footer class="footer">
            <p>PokiFinder — built by <b>Vitaliy Zhyryk</b></p>
        </footer>
    </div>
</template>

<script setup>
    /************************************************************************
     * IMPORTs
     ************************************************************************/
    // #region IMPORTs
    import { useRoute, useRouter } from 'vue-router';
    import { defineAsyncComponent } from 'vue';
    // #endregion
    /************************************************************************
     * COMPONENTs
     ************************************************************************/
    // #region COMPONENTs
    /** @type {import('vue').Component}*/
    const ButtonTemplate = defineAsyncComponent(() => import('/src/components/ButtonTemplate.vue'));
    // #endregion
    /************************************************************************
     * Local Static Variables
     ************************************************************************/
    // #region Local Static Variables
    /** @type {import('vue-router').Router} */
    const router = useRouter();
    /** @type {import('vue-router').RouteLocationNormalizedLoaded} */
    const route = useRoute();
    // #endregion
    /************************************************************************
     * FUNCTIONS
     ************************************************************************/
    // #region FUNCTIONS
    /**
     * @function handleBackToHome
     * @returns {void}
     */
    function handleBackToHome() {
        router.push('/');
    }
    // #endregion
</script>
<style scoped>
    .page {
        /* Size */
        height: 100%;
    }
    /* Header */
    .header {
        /* Position */
        position: relative;

        /* Background */
        background: var(--header_background_color);

        /* Fonts */
        text-align: center;
        font-size: var(--title_font_size);
        font-weight: var(--title_font_weight);
        color: var(--header_font_color);
    }

    .header h1 {
        /* margins & paddings */
        margin: 0px auto;
        padding: 15px;
    }

    /* Main content */
    .main {
        /* Layout */
        display: flex;
        flex-direction: column;

        /* Size */
        height: calc(100vh - 70px);
    }

    /* Footer */
    .footer {
        /* Position */
        position: absolute;
        bottom: 0;

        /* Size */
        width: 100%;

        /* Background */
        background: var(--footer_background_color);

        /* Fonts */
        text-align: center;
        color: var(--footer_font_color);
        font-size: var(--secondary_font_size);
    }

    .back_home_btn {
        /* Position */
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
    }

    @media (max-width: 768px) {
        .main {
            /* Size */
            height: calc(100vh - 70px);

            /* flow */
            overflow: auto;
        }

        .header {
            /* Size */
            height: 40px;

            /* Fonts */
            font-size: var(--mobile_font_size);
        }

        .header h1 {
            /* margins & paddings */
            padding: 10px;
        }

        .header .back_home_btn {
            /* margins & paddings */
            padding: 5px 10px;
        }
    }
</style>
