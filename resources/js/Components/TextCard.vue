<script setup>
const props = defineProps({
    headerText: {
        type: String
    },
    bodyText: {
        type: String,
    },
});
</script>

<template>
    <div class="text-card flex flex-col">
        <h2 class="header-text text-gray-900 dark:text-white">{{ headerText }}</h2>
        <div class="body-text text-gray-900 dark:text-white"><span style="white-space: pre-line;">{{ bodyText }}</span></div>
    </div>
</template>