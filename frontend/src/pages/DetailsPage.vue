<template>
    <div class="pokemon_detail_page">
        <template v-if="!isLoading">
            <template v-if="!errorInfo">
                <div class="pokemon_name_container">
                    <h1 class="pokemon_name">{{ pokemonName }}</h1>
                </div>

                <div class="pokemon_main">
                    <!-- Basic information -->
                    <div class="info_container">
                        <div class="types_container">
                            <h3>Types:</h3>
                            <div class="type_badges">
                                <span v-for="type in pokemonTypes" :key="type.slot" :class="`type_badge`">
                                    {{ type }}
                                </span>
                            </div>
                        </div>

                        <div class="physical_stats">
                            <div class="stat"><strong>Height:</strong> {{ pokemonSize.height }} m</div>
                            <div class="stat"><strong>Weight:</strong> {{ pokemon.weight }} kg</div>
                            <div class="stat"><strong>Base Experience:</strong> {{ pokemon.base_experience }}</div>
                        </div>
                    </div>
                    <div class="pokemon_image_container">
                        <img :src="pokemonImageUrl" :alt="pokemonName" class="pokemon_image" />
                        <ButtonTemplate v-if="pokemon.cries?.latest" @handleBtnClick="playSound" btnText="Play Sound" class="play_button" />
                    </div>
                </div>

                <!-- Abilities -->
                <div class="abilities_section">
                    <h3>Abilities:</h3>
                    <div class="abilities">
                        <div v-for="ability in pokemonAbilities" :key="ability.slot" class="ability">
                            <span class="ability_name">{{ ability.name }}</span>
                            <span v-if="ability.is_hidden" class="hidden_badge">(hidden)</span>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="stats_section">
                    <h3>Base Stats:</h3>
                    <div class="stats">
                        <div v-for="stat in pokemonStats" :key="stat.name" class="stat_item">
                            <div class="stat_info">
                                <span class="stat_name">{{ stat.name }}:</span>
                                <span class="stat_value">{{ stat.base_stat }}</span>
                            </div>
                            <div class="stat_bar">
                                <div class="stat_bar_fill" :style="{ width: stat.barWidth }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else>
                <h2>Pokemon not found 😢</h2>
                <p>Try searching for another one.</p>
            </div>
        </template>
    </div>
</template>

<script setup>
    import { defineAsyncComponent, onMounted } from 'vue';
    // @ts-check
    /************************************************************************
     * IMPORTs
     ************************************************************************/
    // #region IMPORTs
    import { ref, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { requestDataFromBackend } from '/src/lib/api.js';
    // #endregion
    /************************************************************************
     * COMPONENTs
     ************************************************************************/
    // #region COMPONENTs
    /** @type {import('vue').Component}*/
    const ButtonTemplate = defineAsyncComponent(() => import('/src/components/ButtonTemplate.vue'));
    /** @type {import('vue').Component}*/
    // #endregion
    /************************************************************************
     * Local Static Variables
     ************************************************************************/
    // #region Local Static Variables
    /** @type {import('vue-router').RouteLocationNormalizedLoaded} */
    const route = useRoute();
    // #endregion
    /************************************************************************
     * Local Reactive Variables
     ************************************************************************/
    // #region Local Reactive Variables
    /** @type {import('vue').Ref<any>} */
    const pokemon = ref({});
    const errorInfo = ref(null);
    const isLoading = ref(true);
    // #endregion
    /************************************************************************
     * Local Computed Variables
     ************************************************************************/
    // #region Local Computed Variables

    /** @type {import('vue').ComputedRef<string>} */
    const pokemonName = computed(() => {
        return capitalizeFirst(pokemon.value.name);
    });
    /** @type {import('vue').ComputedRef<string[]>} */
    const pokemonTypes = computed(() => {
        return pokemon.value.types?.map((type) => capitalizeFirst(type?.type?.name));
    });
    /** @type {import('vue').ComputedRef<{ height: string, width: string }>} */
    const pokemonSize = computed(() => {
        return {
            height: (pokemon.value.height * 0.1).toFixed(1),
            width: (pokemon.value.weight * 0.1).toFixed(1),
        };
    });
    /** @type {import('vue').ComputedRef<Array<{ name: string, is_hidden: boolean, slot: number }>>} */
    const pokemonAbilities = computed(() => {
        return pokemon.value.abilities?.map((ability) => {
            return {
                name: capitalizeFirst(ability?.ability?.name),
                is_hidden: ability.is_hidden,
                slot: ability.slot,
            };
        });
    });
    /** @type {import('vue').ComputedRef<Array<{ name: string, base_stat: number, barWidth: string }>>} */
    const pokemonStats = computed(() => {
        return pokemon.value.stats?.map((stat) => {
            return {
                name: stat.stat.name,
                base_stat: stat.base_stat,
                barWidth: calculateStatPercentage(stat.base_stat) + '%',
            };
        });
    });
    /** @type {import('vue').ComputedRef<string>} */
    const pokemonImageUrl = computed(() => {
        return pokemon.value?.sprites?.other?.['official-artwork'].front_default || pokemon.value?.sprites?.front_default;
    });

    // #endregion
    /************************************************************************
     * FUNCTIONS
     ************************************************************************/
    // #region FUNCTIONS
    /**
     * @async
     * @function getPokemonData
     * @returns {Promise<void>}
     */
    async function getPokemonData() {
        try {
            pokemon.value = await requestDataFromBackend({
                endpoint: `/pokemon/${route.params.name}`,
                methods: 'GET',
            });
            errorInfo.value = null;
        } catch (error) {
            errorInfo.value = error;
        }

        isLoading.value = false;
    }
    /**
     * @function capitalizeFirst
     * @param {string} str
     * @returns {string}
     */
    function capitalizeFirst(str) {
        return str?.charAt(0).toUpperCase() + str?.slice(1);
    }

    /**
     * @function calculateStatPercentage
     * @param {number} stat
     * @returns {number}
     */
    function calculateStatPercentage(stat) {
        return Math.min((stat / 255) * 100, 100);
    }
    /**
     * @function playSound
     * @returns {void}
     */
    function playSound() {
        if (pokemon.value.cries?.latest) {
            const audio = new Audio(pokemon.value.cries.latest);
            audio.play();
        }
    }

    // #endregion
    /************************************************************************
     * LIFE CYCLE
     ************************************************************************/
    // #region LIFE CYCLE
    onMounted(() => {
        getPokemonData();
    });
    // #endregion
</script>

<style scoped>
    .pokemon_detail_page {
        /* Size */
        width: calc(100% - 100px);
        /* margins & paddings */
        margin: 0 auto;
        padding: 20px;
    }

    .pokemon_name_container {
        /* Layout */
        display: flex;
        justify-content: space-between;
        align-items: center;

        /* margins & paddings */
        margin-bottom: 10px;
        padding-bottom: 10px;

        /* Borders */
        border-bottom: 2px solid var(--primary_border_color);
    }

    .pokemon_name {
        /* margins & paddings */
        margin: 0;

        /* Fonts */
        color: var(--primary_font_color);
        font-size: 20px;
    }

    .pokemon_main {
        /* Layout */
        display: flex;
        gap: 30px;
        align-items: flex-start;

        /* margins & paddings */
        margin-bottom: 10px;

        /* Borders */
        border-bottom: 2px solid var(--primary_border_color);
    }

    .pokemon_image_container {
        /* Position */
        position: relative;

        /* Layout */
        text-align: center;

        /* margins & paddings */
        margin-left: 100px;
    }

    .pokemon_image {
        /* Size */
        width: 150px;
        height: 150px;
    }

    .play_button {
        /* Position */
        position: absolute;
        bottom: -50px;
        left: 50%;
        transform: translateX(-50%);

        /* Size */
        width: 150px;
    }

    .types_container {
        /* margins & paddings */
        margin-bottom: 20px;
    }

    .type_badges {
        /* Layout */
        display: flex;
        gap: 10px;

        /* margins & paddings */
        margin-top: 10px;
    }

    .type_badge {
        /* Background */
        background-color: var(--type_badge_bg_color);

        /* margins & paddings */
        padding: 5px 15px;

        /* Fonts */
        color: var(--type_badge_font_color);
        font-weight: bold;

        /* Borders */
        border-radius: 20px;
    }

    .physical_stats .stat {
        /* margins & paddings */
        margin-bottom: 8px;
        padding: 5px 0;
    }

    .abilities_section,
    .stats_section {
        /* margins & paddings */
        margin-top: 20px;
    }

    .stats_section h3 {
        /* margins & paddings */
        margin: 10px 0px;
    }

    .abilities {
        /* Layout */
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }

    .ability {
        /* Background */
        background: var(--additional_background_color);

        /* margins & paddings */
        padding: 8px 15px;

        /* Fonts */
        color: var(--primary_font_color);

        /* Borders */
        border-radius: 20px;
        border: 1px solid var(--primary_border_color);
    }

    .hidden_badge {
        /* margins & paddings */
        margin-left: 5px;

        /* Fonts */
        font-size: 0.9em;
    }

    .stats {
        /* margins & paddings */
        margin-top: 5px;
    }

    .stat_item {
        /* margins & paddings */
        margin-bottom: 6px;
    }

    .stat_info {
        /* Layout */
        display: flex;
        justify-content: space-between;

        /* margins & paddings */
        margin-bottom: 5px;
    }

    .stat_name,
    .stat_value {
        /* Fonts */
        color: var(--primary_font_color);
        font-weight: bold;
    }

    .stat_bar {
        /* Size */
        width: 100%;
        height: 8px;

        /* flow */
        overflow: hidden;

        /* Background */
        background: var(--light_background_color);

        /* Borders */
        border-radius: 4px;
    }

    .stat_bar_fill {
        /* Size */
        height: 100%;

        /* Background */
        background: var(--stat_bar_fill_bg_color);

        /* Transitions */
        transition: var(--primary_transition);
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .pokemon_detail_page {
            /* Size */
            width: unset;
        }

        .pokemon_name_container {
            /* Layout */
            justify-content: center;
        }

        .pokemon_main {
            /* Layout */
            flex-direction: column-reverse;
            align-items: center;
        }

        .pokemon_image_container .play_button {
            /* Position */
            bottom: -30px;

            /* margins & paddings */
            padding: 5px 10px;
        }

        .pokemon_image {
            /* Size */
            width: 200px;
            height: 200px;
        }

        .pokemon_image_container {
            margin-left: 0px;
        }

        .types_container {
            /* Layout */
            display: flex;
            align-items: center;
            justify-content: space-around;

            /* margins & paddings */
            margin-top: 20px;
        }

        .types_container h3,
        .types_container .type_badges {
            /* margins & paddings */
            margin: 0px;
        }

        .type_badges,
        .abilities {
            /* Layout */
            justify-content: center;
        }

        .main_sprite {
            /* Size */
            width: 150px;
            height: 150px;
        }
    }
</style>
