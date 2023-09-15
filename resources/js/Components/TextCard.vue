<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    cardId: Number,
    headerText: String,
    bodyText: String,
});

const isActive = ref(false);
const isAnimatingIn = ref(false);
const isAnimatingOut = ref(false);

const classObject = computed(() => ({
    active: isActive.value,
    'animating-in': isAnimatingIn.value,
    'animating-out': isAnimatingOut.value
}))

onMounted(() => {
    isActive.value = props.cardId == 0 ? true: false;
});

defineExpose({
    isActive, 
    isAnimatingIn, 
    isAnimatingOut
})

</script>

<template>
    <div
        class="text-card flex flex-col"
        :class="classObject">
        <h2 class="header-text text-gray-900 dark:text-white">{{ headerText }}</h2>
        <div class="body-text text-gray-900 dark:text-white">
            <span style="white-space: pre-line;">{{ bodyText }}</span>
        </div>
    </div>
</template>