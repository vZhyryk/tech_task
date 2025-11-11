<template>
    <ModalTemplate @close="close" :show="show">
        <div class="detail_model_content">
            <img :src="pokemonData.imageUrl" :alt="pokemonData.name" />
            <p>{{ pokemonData.name }}</p>
            <p><b>Description:</b> {{ pokemonData.description }}</p>
            <ButtonTemplate @handleBtnClick="handleDetailsBtnClick" btnText="See details" />
        </div>
    </ModalTemplate>
</template>

<script setup>
    /************************************************************************
     * TYPE DEFINITIONS
     ************************************************************************/
    // #region Type Definitions
    /**
     * Pokemon data object structure
     * @typedef {Object} PokemonData
     * @property {string} imageUrl
     * @property {string} name
     * @property {string} description
     */

    /**
     * Component props definition
     * @typedef {Object} Props
     * @property {PokemonData} pokemonData
     * @property {boolean} show
     */
    // #endregion

    /************************************************************************
     * IMPORTs
     ************************************************************************/
    // #region IMPORTs
    import { defineAsyncComponent } from 'vue';
    import { useRouter } from 'vue-router';
    // #endregion
    /************************************************************************
     * EMITs
     ************************************************************************/
    // #region EMITs
    const emit = defineEmits(['close']);
    // #endregion
    /************************************************************************
     * PROPs
     ************************************************************************/
    // #region PROPs
    /**
     * @type {import('vue').PropType<Props>}
     */
    const props = defineProps({
        /** @type {import('vue').PropOptions<PokemonData>} */
        pokemonData: {
            type: Object,
            required: true,
            default: () => {},
        },

        /** @type {import('vue').PropOptions<boolean>} */
        show: {
            type: Boolean,
            required: true,
            default: false,
        },
    });

    // #endregion
    /************************************************************************
     * COMPONENTs
     ************************************************************************/
    // #region COMPONENTs
    /** @type {import('vue').Component} */
    const ModalTemplate = defineAsyncComponent(() => import('/src/components/ModalTemplate.vue'));
    /** @type {import('vue').Component} */
    const ButtonTemplate = defineAsyncComponent(() => import('/src/components/ButtonTemplate.vue'));
    // #endregion
    /************************************************************************
     * Local Static Variables
     ************************************************************************/
    // #region Local Static Variables
    /** @type {import('vue-router').Router} */
    const router = useRouter();
    // #endregion
    /************************************************************************
     * FUNCTIONS
     ************************************************************************/
    // #region FUNCTIONS
    /**
     * @function close
     * @returns {void}
     */
    function close() {
        emit('close');
    }
    /**
     * @function handleDetailsBtnClick
     * @returns {void}
     */
    function handleDetailsBtnClick() {
        router.push(`/pokemon/${props.pokemonData.name}`);
    }
    // #endregion
</script>

<style scoped>
    .detail_model_content {
        /* Layout */
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .detail_model_content img {
        /* Size */
        height: 200px;
    }
</style>
