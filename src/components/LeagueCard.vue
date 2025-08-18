<script setup lang="ts">
import { ref } from 'vue';
import { useLeaguesStore } from '@/stores/leaguesStore';
import { storeToRefs } from 'pinia';
import Card from "@/components/base/Card.vue";
import Icon from "@/components/base/Icon.vue";

interface Props {
  league: {
    idLeague: string;
    strLeague: string;
    strLeagueAlternate?: string;
    strSport?: string;
    strBadge?: string;
  };
}

const props = defineProps<Props>();
const leaguesStore = useLeaguesStore();
const { loadingBadges } = storeToRefs(leaguesStore);

const isFlipped = ref(false);

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.style.display = 'none';
  }
};

const handleCardClick = async () => {
  if (!props.league.strBadge && !loadingBadges.value[props.league.idLeague]) {
    await leaguesStore.fetchLeagueBadge(props.league.idLeague);
  }
  isFlipped.value = !isFlipped.value;
};
</script>

<template>
  <div class="flip-card h-48 cursor-pointer" @click="handleCardClick">
    <div class="flip-card-inner h-full" :class="{ 'flipped': isFlipped }">

      <div class="flip-card-front">
        <Card class="h-full flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              {{ league.strLeague }}
            </h3>

            <p v-if="league.strLeagueAlternate" class="text-sm text-gray-600 mb-2">
              {{ league.strLeagueAlternate }}
            </p>

            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ league.strSport || 'Sport' }}
            </span>
          </div>

          <div v-if="loadingBadges[league.idLeague]" class="flex items-center justify-center mt-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p class="text-xs text-gray-600 ml-2">Loading badge...</p>
          </div>
        </Card>
      </div>

      <div class="flip-card-back">
        <Card class="h-full flex flex-col items-center justify-center">
          <div v-if="league.strBadge" class="flex flex-col items-center">
            <img :src="league.strBadge" :alt="`${league.strLeague} badge`" class="max-w-24 max-h-24 object-contain mb-4"
              @error="handleImageError" />
            <p class="text-sm font-medium text-gray-900 text-center">{{ league.strLeague }}</p>
          </div>

          <div v-else class="flex flex-col items-center text-gray-500">
            <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Icon name="document" size="lg" class="text-gray-400" />
            </div>
            <p class="text-sm">No badge available</p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>
