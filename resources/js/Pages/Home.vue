<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'

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
    <AuthenticatedLayout>
        <div
        class="relative pt-4 flex min-h-screen justify-center bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white"
        >
            <div class="flex flex-col w-85 md:w-67 mt-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Welcome to my site!</h2>
                <div class="pl-3 text-l text-gray-900 dark:text-white">
                    <p class="pb-3">My name is Nicolas Howe Garcia, and you've found my website! I am a software engineer with more hobbies than time. I use this site to showcase and document my personal projects; and also to host my blog, media reviews, and other various writings.</p>
                    
                    <p class="pb-3">As of 2022 I've been employed by Nexxen (formerly Tremor Video) as a Technical Solutions Engineer for their demand side platform. I am not currently seeking new employment, but inquiries are always welcome.</p>

                    <p class="pb-3">I love media and writing about it! I'll review anything I feel the need to and host it all on this site, and I'll surely wax poetic about the subject on my blog. Go check out the archives if that interests you!</p>

                    <p class="pb-3">I do my best to update consistently, but sometimes life gets in the way.</p>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>