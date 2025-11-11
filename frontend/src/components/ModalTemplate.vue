<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="show" class="modal_overlay" @click.self="close">
                <button class="close_btn" @click="close">✖</button>
                <div class="modal_content">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
    /************************************************************************
     * TYPE DEFINITIONS
     ************************************************************************/
    // #region Type Definitions
    /**
     * Event tracker composable return type
     * @typedef {Object} EventTracker
     * @property {function} startTracking
     * @property {function} getListeners
     * @property {import('vue').Ref<Object>} eventListeners
     * @property {function} stopTracking
     */

    /**
     * Component props definition
     * @typedef {Object} Props
     * @property {boolean} show - Controls modal visibility
     */
    // #endregion

    /************************************************************************
     * IMPORTs
     ************************************************************************/
    // #region IMPORTs
    import { defineProps, defineEmits, watchEffect, onMounted, onUnmounted } from 'vue';
    import { useEventTracker } from '/src/composables/useEventTracker.js';
    // #endregion
    /************************************************************************
     * EMITs
     ************************************************************************/
    // #region EMITs
    /** @type {import('vue').EmitsOptions} */
    const emit = defineEmits(['close']);
    // #endregion
    /************************************************************************
     * PROPs
     ************************************************************************/
    // #region PROPs
    /** @type {import('vue').PropType<Props>} */
    const props = defineProps({
        /** @type {import('vue').PropOptions<boolean>} */
        show: {
            type: Boolean,
            required: true,
            default: false,
        },
    });
    // #endregion
    /************************************************************************
     * Local Reactive Variables
     ************************************************************************/
    // #region Local Reactive Variables
    /**
     * @type {import('src/composables/useEventTracker.js').EventTrackerReturn}
     */
    const { startTracking, getListeners, stopTracking } = useEventTracker();
    // #endregion
    /************************************************************************
     * WATCH
     ************************************************************************/
    // #region WATCH
    watchEffect(
        () => {
            if (props.show) {
                document.addEventListener('keydown', handleESCClose);
            } else {
                document.removeEventListener('keydown', handleESCClose);
            }
        },
        { flush: 'post' }
    );
    // #endregion
    /************************************************************************
     * FUNCTIONS
     ************************************************************************/
    // #region FUNCTIONS
    function close() {
        emit('close');
    }

    function handleESCClose(event) {
        if (event.key === 'Escape') {
            close();
        }
    }
    // #endregion
    /************************************************************************
     * LIFE CYCLE
     ************************************************************************/
    // #region LIFE CYCLE
    onMounted(() => {
        startTracking();
    });

    onUnmounted(() => {
        if (getListeners(document)?.has('keydown')) {
            document.removeEventListener('keydown', handleESCClose);
        }
        stopTracking();
    });
    // #endregion
</script>

<style scoped>
    .modal_overlay {
        /* Position */
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        /* Layout */
        display: flex;
        justify-content: center;
        align-items: center;

        /* Background */
        background: var(--modal_backdrop_bg_color);
    }
    .modal_content {
        /* Layout */
        text-align: center;

        /* Size */
        width: 300px;


        /* Background */
        background: var(--homepage_background_color);

        /* margins & paddings */
        padding: 20px;

        /* Borders */
        border-radius: 10px;
    }

    .close_btn {
        /* Position */
        position: absolute;
        top: 8px;
        right: 12px;

        /* Background */
        background: transparent;
        border: none;
        cursor: pointer;

        /* Fonts */
        font-size: 1.2rem;
        color: var(--secondary_font_color);
    }
</style>
