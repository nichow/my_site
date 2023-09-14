<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    cardId: Number,
    headerText: String,
    bodyText: String,
});

const isActive = ref(false);

onMounted(() => {
    isActive.value = props.cardId == 0 ? true: false;
});

defineExpose({
    isActive
})

</script>

<template>
    <div
        class="text-card flex flex-col"
        :class="{active : isActive}">
        <h2 class="header-text text-gray-900 dark:text-white">{{ headerText }}</h2>
        <div class="body-text text-gray-900 dark:text-white">
            <span style="white-space: pre-line;">{{ bodyText }}</span>
        </div>
    </div>
</template>