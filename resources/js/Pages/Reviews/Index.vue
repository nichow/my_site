<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { useForm, Head } from '@inertiajs/vue3';

defineProps(['reviews'])
 
const form = useForm({
    subject: '',
    rating: 0,
    title: '',
    content: '',
});
</script>

<template>
    <Head title="Media Reviews" />
    <!--Admin Layout (Nic)-->
    <AuthenticatedLayout v-if="$page.props.auth.user">

    </AuthenticatedLayout>
    <!--Guest Layout (anyone not Nic)-->
    <GuestLayout v-else>

    </GuestLayout>
</template>
 