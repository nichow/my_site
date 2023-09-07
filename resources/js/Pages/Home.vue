<script setup>
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    laravelVersion: {
        type: String,
        required: true,
    },
    phpVersion: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <Head title="Nicolas Howe" />

    <div
        class="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white"
    >
        <h2 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Welcome to my site!</h2>
    </div>
</template>