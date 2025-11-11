<template>
    <button class="btn_element" @click="handleBtnClick">{{ btnText }}</button>
</template>

<script setup>
    /************************************************************************
     * TYPE DEFINITIONS
     ************************************************************************/
    // #region Type Definitions
    /**
     * @typedef {Object} Props
     * @property {string} btnText
     */
    // #endregion

    /************************************************************************
     * IMPORTs
     ************************************************************************/
    // #region IMPORTs
    import { defineProps, defineEmits } from 'vue';
    // #endregion

    /************************************************************************
     * EMITs
     ************************************************************************/
    // #region EMITs
    /** @type {import('vue').EmitsOptions} */
    const emit = defineEmits(['handleBtnClick']);
    // #endregion

    /************************************************************************
     * PROPs
     ************************************************************************/
    // #region PROPs
    /** @type {import('vue').PropType<Props>} */
    defineProps({
        /** @type {import('vue').PropOptions<string>} */
        btnText: {
            type: String,
            required: true,
            default: '',
        },
    });
    // #endregion
    /************************************************************************
     * FUNCTIONS
     ************************************************************************/
    // #region FUNCTIONS
    /**
     * @function handleBtnClick
     * @returns {void}
     */
    const handleBtnClick = () => emit('handleBtnClick');
    // #endregion
</script>

<style scoped>
    .btn_element {
        /* margins & paddings */
        padding: 10px 20px;

        /* Background */
        background: var(--load_more_btn_bg_color);

        /* Fonts */
        color: var(--load_more_btn_font_color);

        /* Borders */
        border-radius: 4px;
        border: 1px solid var(--load_more_btn_font_color);

        /* Transitions */
        transition: var(--primary_transition);
        cursor: pointer;
    }
    .btn_element:hover {
        /* Background */
        background: var(--load_more_hover_btn_bg_color);

        /* Fonts */
        color: var(--load_more_hover_btn_font_color);

        /* Borders */
        border: 1px solid var(--load_more_hover_btn_font_color);
    }
</style>
