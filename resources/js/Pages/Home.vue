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
    { id: 0, headerText: 'Welcome', bodyText: `My name is Nicolas Howe Garcia, and you've found my website! I am a software engineer with more hobbies than time. I use this site to showcase and document my personal projects also to host my blog, media reviews, stories, etc. 
    
    As of 2022 I've been employed by Nexxen (formerly Tremor Video) as a Technical Solutions Engineer for their demand side platform. I am not currently seeking new employment, but inquiries are always welcome. Navigate to the resume page for additional details.

    My blog will mostly be development related, talking about my personal projects and documenting how I approach the design and implementation of their parts. I'm hoping that this will help me focus in on my projects, and forcing some periods of reflection will hopefully help me overcome hurdles.

    Sometimes I feel the burning need to review a game, movie, or album; and when that happens I'll post it here. Please keep in mind these are all going to be very subjective.` },

    { id: 1, headerText: 'Site Summary', bodyText: `As for this site, I built it with Laravel, using Vue.js for the front-end and Postgres for the database. I picked Laravel mostly to experiment, but I wanted something implementing a more traditional MVC pattern that also had the power to render nice looking SPAs like this. 
                    
    The Lorem ipsum text is derived from sections 1.10.32 and 1.10.33 of Cicero's De finibus bonorum et malorum.[7][8] The physical source may have been the 1914 Loeb Classical Library edition of De finibus, where the Latin text, presented on the left-hand (even) pages, breaks off on page 34 with

    The discovery of the text's origin is attributed to Richard McClintock, a Latin scholar at Hampden-Sydney College. McClintock connected Lorem ipsum to Cicero's writing sometime before 1982 while searching for instances of the Latin word consectetur, which was rarely used in classical literature.[2] McClintock first published his discovery in a 1994 letter to the editor of Before & After magazine,[9] contesting the editor's earlier claim that Lorem ipsum held no meaning.[2]

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.` },

    { id: 2, headerText: 'Section 3', bodyText: `The Lorem ipsum text is derived from sections 1.10.32 and 1.10.33 of Cicero's De finibus bonorum et malorum.[7][8] The physical source may have been the 1914 Loeb Classical Library edition of De finibus, where the Latin text, presented on the left-hand (even) pages, breaks off on page 34 with
    
    The discovery of the text's origin is attributed to Richard McClintock, a Latin scholar at Hampden-Sydney College. McClintock connected Lorem ipsum to Cicero's writing sometime before 1982 while searching for instances of the Latin word consectetur, which was rarely used in classical literature.[2] McClintock first published his discovery in a 1994 letter to the editor of Before & After magazine,[9] contesting the editor's earlier claim that Lorem ipsum held no meaning.[2]

    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.` },
    { id: 3, headerText: 'Section 4', bodyText: `Distinctio molestiae porro voluptates eos sed reprehenderit. Est consequatur exercitationem aliquid velit quaerat iure voluptas. Consequatur sint rerum ipsum consectetur dolores. Maiores et qui inventore doloribus eligendi iste sed quo. Aliquam est modi alias voluptas doloremque. Dolore blanditiis ab dolorem.

    Sint culpa in at. Iusto veniam dolores ut magnam enim. Qui consequatur autem perspiciatis. Excepturi dicta provident aspernatur itaque qui. Velit sed distinctio consequatur atque autem voluptas.

    Suscipit veniam dolorum est molestiae accusantium deleniti. Deserunt quia est qui possimus repudiandae dicta et fuga. Animi reprehenderit odio facere. Porro quia in quia dolorum nemo. Nihil voluptatem sit animi. Perspiciatis rerum dignissimos dolor esse quis qui nostrum sit.` }
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
    if (id !== current) {
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
                class="side-button mx-auto 
                bg-gray-100 hover:bg-gray-900 hover:text-white 
                dark:bg-gray-900 dark:text-white dark:hover:bg-red-500"
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