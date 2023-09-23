<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'
import GameLHF from '@/Components/Games/GameLHF/Game.vue';
</script>

<template>
    <head title="Games by Nic" />
    <AuthenticatedLayout>
        <canvas 
        class="mx-auto mt-10" 
        id="canvas" width="640" height="480"></canvas>
        <GameLHF/>
    </AuthenticatedLayout>
</template>