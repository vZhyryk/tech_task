<template>
    <input :type="type" :placeholder="placeholder" v-model="inputModel" ref="inputRef" />
</template>
<script setup>
    /************************************************************************
     * TYPE DEFINITIONS
     ************************************************************************/
    // #region Type Definitions
    /**
     * @typedef {Object} Props
     * @property {string} type
     * @property {string} placeholder
     * @property {string} modelValue
     * @property {boolean} autofocus
     * @property {number} debounceTime
     */
    // #endregion

    /************************************************************************
     * IMPORTs
     ************************************************************************/
    // #region IMPORTs
    import { ref, onMounted, watch } from 'vue';
    import { debounce } from '/src/lib/helpers.js';
    // #endregion
    /************************************************************************
     * EMITs
     ************************************************************************/
    // #region EMITs
    /** @type {import('vue').EmitsOptions} */
    const emit = defineEmits(['update:modelValue']);

    // #endregion

    /************************************************************************
     * PROPs
     ************************************************************************/
    // #region PROPs
    /** @type {import('vue').PropType<Props>} */
    const props = defineProps({
        /** @type {import('vue').PropOptions<string>} */
        type: {
            type: String,
            required: false,
            default: '',
        },
        /** @type {import('vue').PropOptions<string>} */
        placeholder: {
            type: String,
            required: false,
            default: '',
        },
        /** @type {import('vue').PropOptions<string>} */
        modelValue: {
            type: String,
            required: false,
            default: '',
        },
        /** @type {import('vue').PropOptions<boolean>} */
        autofocus: {
            type: Boolean,
            required: false,
            default: false,
        },
        /** @type {import('vue').PropOptions<number>} */
        debounceTime: {
            type: Number,
            required: false,
            default: 500,
        },
    });

    // #endregion
    /************************************************************************
     * Local Reactive Variables
     ************************************************************************/
    // #region Local Reactive Variables
    /** @type {import('vue').Ref<String>} */
    const inputModel = ref('');
    /** @type {import('vue').Ref<HTMLDivElement | null>} */
    const inputRef = ref(null);
    // #endregion
    /************************************************************************
     * WATCH
     ************************************************************************/
    // #region WATCH
    watch(
        inputModel,
        /** @param {string} newVal */
        (newVal) => updateDebounced(newVal)
    );

    watch(
        () => props.modelValue,
        /** @param {string} val */
        (val) => {
            if (val !== inputModel.value) inputModel.value = val;
        }
    );

    // #endregion

    /************************************************************************
     * FUNCTIONS
     ************************************************************************/
    // #region FUNCTIONS
    /**
     * @function updateDebounced
     * @param {string}
     * @returns {void}
     */
    const updateDebounced = debounce((val) => {
        emit('update:modelValue', val);
    }, props.debounceTime);

    // #endregion

    /************************************************************************
     * LIFE CYCLE
     ************************************************************************/
    // #region LIFE CYCLE

    onMounted(() => {
        if (props.autofocus) inputRef.value?.focus();
    });
    // #endregion
</script>
<style scoped></style>
