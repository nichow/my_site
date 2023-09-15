<script lang="ts" setup>
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import { Card } from '@/Components/TextCard.vue'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'
import TextCard from '@/Components/TextCard.vue';

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

// array of cards with text content for page
const cards = ref<Card[]>([
    { id: 0, headerText: 'Welcome', bodyText: `My name is Nicolas Howe Garcia, and you've found my website! I am a software engineer with more hobbies than time. I use this site to showcase and document my personal projects; and also to host my blog, media reviews, and other various writings.
    
                    As of 2022 I've been employed by Nexxen (formerly Tremor Video) as a Technical Solutions Engineer for their demand side platform. I am not currently seeking new employment, but inquiries are always welcome. My resume is hosted here as well if needed.
    
                    I love media and writing about it! I'll review anything I feel the need to and host it all on this site, and I'll surely wax poetic about the subject on my blog. Go check out the archives if that interests you!
    
                    I do my best to update consistently, but sometimes life gets in the way.` },
    { id: 1, headerText: 'Site Summary', bodyText: `As for this site, I built it with Laravel, using Vue.js for the front-end and Postgres for the database. I picked Laravel mostly to experiment, but I wanted something implementing a more traditional MVC pattern that also had the power to render nice looking SPAs like this. 
                    
                    The Lorem ipsum text is derived from sections 1.10.32 and 1.10.33 of Cicero's De finibus bonorum et malorum.[7][8] The physical source may have been the 1914 Loeb Classical Library edition of De finibus, where the Latin text, presented on the left-hand (even) pages, breaks off on page 34 with
    
                    The discovery of the text's origin is attributed to Richard McClintock, a Latin scholar at Hampden-Sydney College. McClintock connected Lorem ipsum to Cicero's writing sometime before 1982 while searching for instances of the Latin word consectetur, which was rarely used in classical literature.[2] McClintock first published his discovery in a 1994 letter to the editor of Before & After magazine,[9] contesting the editor's earlier claim that Lorem ipsum held no meaning.[2]
    
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.` }
]);
// array of references to card DOM objects
const cardsRef = ref<Card[]>([]);
// index of current card being displayed
let current : number = 0;

/**
 * callback function for when side nav button is clicked
 * @param id cardsRef index corresponding to button's header
 */
function sideNavClick(id: number) {
    // animate old card out
    cardsRef.value[current].isAnimatingOut = true;
    cardsRef.value[current].isAnimatingIn = false;
    // wait for completion of out animation
    setTimeout(() => {
        // deactivate old card 
        cardsRef.value[current].isActive = false;
        cardsRef.value[current].isAnimatingOut = false;
        // animate new card in, upcate current
        cardsRef.value[id].isActive = true;
        cardsRef.value[id].isAnimatingIn = true;
        current = id;
    }, 250)
}


</script>

<template>
    <Head title="Nicolas Howe" />
    <AuthenticatedLayout>
        <div
        class="home flex flex-col sm:flex-row min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white"
        >
            <div class="side-nav flex flex-col p-6 mt-6">
                <button 
                v-for="card in cards"
                class="dark:text-white bg-black mb-1"
                :class="`side-nav-link-${card.id}`"
                @click="sideNavClick(card.id)">
                    {{ card.headerText }}
                </button>
            </div>
            <TextCard
            v-for="card in cards" ref="cardsRef"
            :key="card.id"
            :cardId="card.id"
            :headerText="card.headerText"
            :bodyText="card.bodyText"
            />
    </div>
    </AuthenticatedLayout>
</template>