<template>
    <div class="homepage">
        <div class="input_container">
            <h2 class="title">Find your best Pokemon</h2>
            <InputTemplate v-model="inputValue" class="search_input" placeholder="Type poki name" :autofocus="true" />
        </div>
        <template v-if="isFirstLoader">
            <div v-if="pokemonList.length" class="carousel_wrapper">
                <div class="carousel" @mouseenter="pauseAutoScroll" @mouseleave="resumeAutoScroll" :style="trackStyle">
                    <div v-for="pokemon in carouselPokeList" :key="pokemon.name" class="pokemon_card" @click="handlePokemonClick(pokemon)">
                        <img :src="pokemon.imageUrl" :alt="pokemon.name" />
                        <p>{{ pokemon.name }}</p>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div v-if="pokemonList.length" class="list_wrapper">
                <div class="grid_container">
                    <div v-for="pokemon in pokemonList" :key="pokemon.name" class="list_element" @click="handlePokemonClick(pokemon)">
                        <img :src="pokemon.imageUrl" />
                        <p>{{ pokemon.name }}</p>
                    </div>
                </div>
            </div>
            <div v-else class="list_wrapper empty_container">
                <div>There is no match to your filter</div>
            </div>
            <div v-if="isLoadMoreVisible" class="load_more_btn_container">
                <ButtonTemplate @handleBtnClick="handleLoadMoreClick" btnText="Load More" />
            </div>
        </template>
        <DetailModal :pokemonData="chosenPokemon" :show="isModalOpened" @close="closeModal" />
    </div>
</template>

<script setup>
    /************************************************************************
     * IMPORTs
     ************************************************************************/
    // #region IMPORTs
    import { defineAsyncComponent, ref, onMounted, onUnmounted, computed, reactive, watch } from 'vue';
    import { requestDataFromBackend } from '/src/lib/api.js';
    // #endregion
    /************************************************************************
     * COMPONENTs
     ************************************************************************/
    // #region COMPONENTs
    /** @type {import('vue').Component}*/
    const InputTemplate = defineAsyncComponent(() => import('/src/components/InputTemplate.vue'));
    /** @type {import('vue').Component}*/
    const DetailModal = defineAsyncComponent(() => import('/src/features/DetailModal.vue'));
    /** @type {import('vue').Component}*/
    const ButtonTemplate = defineAsyncComponent(() => import('/src/components/ButtonTemplate.vue'));
    // #endregion
    /************************************************************************
     * Local Reactive Variables
     ************************************************************************/
    // #region Local Reactive Variables
    /** @type {import('vue').Ref<String>} */
    const inputValue = ref('');
    /** @type {import('vue').Ref<any[]>} */
    const pokemonList = ref([]);
    /** @type {import('vue').Ref<boolean>} */
    const isFirstLoader = ref(true);
    /** @type {import('vue').Reactive<{ page: number; size: number }>} */
    const pagination = reactive({
        page: 1,
        size: 20,
    });
    /** @type {import('vue').Ref<number>} */
    const totalCount = ref(0);
    /** @type {import('vue').Ref<number>} */
    const scrollPosition = ref(0);
    /** @type {import('vue').Ref<NodeJS.Timeout | null>} */
    const autoScrollInterval = ref(null);
    /** @type {import('vue').Ref<boolean>} */
    const isAutoScrollPaused = ref(false);
    /** @type {import('vue').Ref<boolean>} */
    const isModalOpened = ref(false);
    /** @type {import('vue').Ref<any>} */
    const chosenPokemon = ref({});
    // #endregion
    /************************************************************************
     * Local Computed Variables
     ************************************************************************/
    // #region Local Computed Variables
    /** @type {import('vue').ComputedRef<import('vue').CSSProperties>} */
    const trackStyle = computed(() => {
        return {
            transform: `translateX(-${scrollPosition.value}px)`,
        };
    });
    /** @type {import('vue').ComputedRef<any[]>} */
    const carouselPokeList = computed(() => {
        return [...pokemonList.value, ...pokemonList.value];
    });
    /** @type {import('vue').ComputedRef<boolean>} */
    const isLoadMoreVisible = computed(() => {
        return totalCount.value > pagination.page * pagination.size;
    });
    // #endregion
    /************************************************************************
     * WATCH
     ************************************************************************/
    // #region WATCH
    watch(
        () => inputValue.value,
        async () => {
            pagination.page = 1;
            await handleGetPokemonData();
            pauseAutoScroll();
            isFirstLoader.value = false;
        }
    );
    // #endregion
    /************************************************************************
     * FUNCTIONS
     ************************************************************************/
    // #region FUNCTIONS
    /**
     * @function handleGetPokemonData
     * @param {String} mode
     */
    async function handleGetPokemonData(mode = 'replace') {
        const { results, count } = await requestDataFromBackend({
            data: {
                filterValue: inputValue.value,
                addImage: true,
                pagination,
            },
        });

        if (mode == 'replace') {
            pokemonList.value = results;
        } else {
            pokemonList.value = [...pokemonList.value, ...results];
        }

        totalCount.value = count;
    }
    /**
     * @function handlePokemonClick
     * @param {Object} pokemonData
     * @returns {void}
     */
    function handlePokemonClick(pokemonData) {
        isModalOpened.value = true;
        chosenPokemon.value = pokemonData;
    }

    /**
     * @function handleLoadMoreClick
     * @returns {void}
     */
    function handleLoadMoreClick() {
        pagination.page++;
        handleGetPokemonData('extend');
    }

    /**
     * @function startAutoScroll
     * @returns {void}
     */
    function startAutoScroll() {
        if (autoScrollInterval.value) {
            clearInterval(autoScrollInterval.value);
        }

        autoScrollInterval.value = setInterval(() => {
            if (!isAutoScrollPaused.value && pokemonList.value.length > 0) {
                const maxScroll = pokemonList.value.length * 200;
                scrollPosition.value += 1;

                if (scrollPosition.value >= maxScroll) {
                    scrollPosition.value = 0;
                }
            }
        }, 20);
    }
    /**
     * @function pauseAutoScroll
     * @returns {void}
     */
    function pauseAutoScroll() {
        isAutoScrollPaused.value = true;
    }
    /**
     * @function resumeAutoScroll
     * @returns {void}
     */
    function resumeAutoScroll() {
        isAutoScrollPaused.value = false;
    }
    /**
     * @function closeModal
     * @returns {void}
     */
    function closeModal() {
        isModalOpened.value = false;
        chosenPokemon.value = {};
    }

    // #endregion
    /************************************************************************
     * LIFE CYCLE
     ************************************************************************/
    // #region LIFE CYCLE
    onMounted(async () => {
        await handleGetPokemonData();
        startAutoScroll();
    });

    onUnmounted(() => {
        if (autoScrollInterval.value) {
            clearInterval(autoScrollInterval.value);
        }
    });
    // #endregion
</script>
<style scoped>
    .homepage {
        /* Size */
        height: 100%;
    }
    .title {
        /* margins & paddings */
        margin-bottom: 1.5rem;

        /* Fonts */
        font-size: 2rem;
        color: var(--title_font_color);
    }

    .input_container {
        /* Layout */
        display: flex;
        align-items: center;
        flex-direction: column;

        /* margins & paddings */
        margin-top: 100px;
    }

    .search_input {
        /* Size */
        width: 280px;

        /* margins & paddings */
        padding: 10px 16px;

        /* Background */
        background-color: transparent;

        /* Fonts */
        font-size: var(--primary_font_size);

        /* Borders */
        border: 2px solid var(--main_input_border_color);
        border-radius: 4px;
        outline: none;

        /* Transitions */
        transition: var(--primary_transition);
    }

    .search_input:focus {
        /* Borders */
        border-color: var(--main_input_hover_border_color);
        box-shadow: 0 0 6px var(--primary_box_shadow);
    }

    /* Carousel */
    .carousel {
        /* Position */
        position: relative;

        /* Layout */
        display: flex;
        align-items: center;

        /* Size */
        width: calc(100% - 100px);

        /* margins & paddings */
        margin-left: auto;
        margin-right: auto;
    }

    .carousel_wrapper {
        /* Position */
        position: relative;

        /* Layout */
        display: flex;
        justify-content: flex-start;
        align-items: center;

        /* flow */
        overflow-x: hidden;

        /* Size */
        width: 100%;

        /* margins & paddings */
        margin-top: 150px;
    }

    .carousel_track {
        /* Layout */
        display: flex;
        will-change: transform;
    }

    .pokemon_card {
        /* Layout */
        flex: 0 0 180px;

        /* margins & paddings */
        padding: 20px;
        margin: 5px;

        /* Background */
        background: var(--card_background_color);
        text-align: center;

        /* Borders */
        border-radius: 12px;
        border: 2px solid transparent;
        box-shadow: var(--primary_box_shadow);

        /* Transitions */
        transition: var(--primary_transition);
        cursor: pointer;
    }

    .pokemon_card:hover {
        /* Borders */
        border-color: var(--hover_border_color);
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
    }
    .pokemon_card img {
        /* Size */
        width: 100px;
        height: 100px;
    }

    /* List */

    .list_wrapper {
        /* flow */
        overflow: auto;

        /* Size */
        height: calc(100% - 420px);

        /* margins & paddings */
        padding: 20px;
        margin: 50px 10px 10px 10px;

        /* Borders */
        border: 1px solid var(--list_border_color);
        border-radius: 10px;
    }

    .grid_container {
        /* Layout */
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .list_element {
        /* Layout */
        display: flex;
        justify-content: flex-start;
        align-items: center;

        /* Size */
        height: 70px;

        /* Background */
        background: var(--card_background_color);
        text-align: center;

        /* margins & paddings */
        padding: 0px 10px;

        /* Borders */
        border-radius: 6px;
        border: 2px solid transparent;
        box-shadow: var(--primary_box_shadow);

        /* Transitions */
        transition: var(--primary_transition);
        cursor: pointer;
    }

    .list_element:hover {
        /* Borders */
        border-color: var(--hover_border_color);
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
    }

    .list_element img {
        /* Layout */
        display: flex;

        /* Size */
        height: 100%;

        /* margins & paddings */
        margin-right: 15px;
    }

    .empty_container {
      /* Layout */
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .list_element p {
        /* Layout */
        display: block;

        /* flow */
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    /* Load More */
    .load_more_btn_container {
        /* Layout */
        display: flex;
        justify-content: center;

        /* margins & paddings */
        margin-top: 10px;
    }

    @media (max-width: 768px) {
        .pokemon_card {
            /* Layout */
            flex: 0 0 100px;
        }

        .list_wrapper {
            /* Size */
            height: 45vh;
        }
    }
</style>
