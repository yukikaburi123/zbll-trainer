<script setup>
import {TimerState, useSessionStore} from "@/stores/SessionStore";
import {computed, onMounted, ref, watch} from "vue";
import {msToHumanReadable} from "@/helpers/time_formatter";
import {cstimerAverage} from "@/helpers/cubing_average";
import {useSettingsStore} from "@/stores/SettingsStore";
import {useI18n} from 'vue-i18n'
const {t} = useI18n()

const sessionStore = useSessionStore()
const settings = useSettingsStore()

const numResults = computed(() => sessionStore.stats().length)

const meanMs = computed(() => {
  if (sessionStore.stats().length === 0) return 0;
  const total = sessionStore.stats().reduce((sum, s) => sum + s.ms, 0);
  return total / sessionStore.stats().length;
})

const getAo = (n) => {
  return cstimerAverage(sessionStore.stats(), n);
}

const ao5 = computed(() => getAo(5))
const ao12 = computed(() => getAo(12))
const ao50 = computed(() => getAo(50))

const onClearBtnClick = () => {
  if (confirm(t("stats_card.are_you_sure_to_clean"))) {
    sessionStore.clearSession()
  }
}

const statsContainer = ref(null);
const scrollStats = () => statsContainer.value && (statsContainer.value.scrollTop = statsContainer.value.scrollHeight)
const scrollStatsLater = () => setTimeout(() => scrollStats(), 10)

onMounted(() => {
  watch(numResults, scrollStatsLater);
  scrollStatsLater()
})

const statClicked = i => sessionStore.observingResult = i
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="mb-0">
        <div class="row align-items-center">
          <div class="col">
            {{t("stats_card.stats_title")}} {{ t("stats_card.n_solves", numResults) }}

            <div v-if="numResults > 0" class="text-muted small mt-1">
              Mean:
              <span class="badge bg-secondary">
                {{ msToHumanReadable(meanMs, settings.store.timerPrecision) }}
              </span>

              <span v-if="numResults >= 5" class="ms-2">
                Ao5:
                <span class="badge bg-secondary">
                  {{ msToHumanReadable(ao5, settings.store.timerPrecision) }}
                </span>
              </span>

              <span v-if="numResults >= 12" class="ms-2">
                Ao12:
                <span class="badge bg-secondary">
                  {{ msToHumanReadable(ao12, settings.store.timerPrecision) }}
                </span>
              </span>

              <span v-if="numResults >= 50" class="ms-2">
                Ao50:
                <span class="badge bg-secondary">
                  {{ msToHumanReadable(ao50, settings.store.timerPrecision) }}
                </span>
              </span>
            </div>
          </div>

          <div class="col-auto">
            <button
                class="btn btn-sm btn-outline-danger mx-1"
                tabindex="-1" @keydown.space.prevent=""
                @click="onClearBtnClick"
                :title="t('stats_card.clear_btn_hint') + ' (Shift+Delete)'"
                v-if="sessionStore.stats().length > 0">
              {{t("stats_card.clear_btn")}}
            </button>
          </div>
        </div>
      </h5>

      <hr>

      <div class="stats-container" ref="statsContainer">
        <span v-for="(stat, index) in sessionStore.stats()" :key="index">
          <span
              @click="statClicked(stat['i'])" class="clickable stat"
              :class="sessionStore.observingResult === stat['i'] ? 'text-info' : ''">
            {{ msToHumanReadable(stat["ms"], settings.store.timerPrecision) }}
          </span>{{ stat["i"] === sessionStore.stats().length - 1 ? "" : ", " }}
        </span>

        <div v-if="sessionStore.stats().length === 0 && sessionStore.timerState !== TimerState.RUNNING">
          {{t("stats_card.hold_spacebar_hint")}}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat {
  transition: color 0.1s;
}

.stat:hover {
  color: var(--bs-info)
}

.stats-container {
  max-height: 200px;
  overflow-y: auto;
}
</style>
