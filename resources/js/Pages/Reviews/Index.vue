<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import Review from '@/Components/Review.vue';
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
        <div class="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <form @submit.prevent="form.post(route('reviews.store'), { onSuccess: () => form.reset() })">
                <textarea
                    v-model="form.subject"
                    placeholder="Review subject"
                    class="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                ></textarea>
                <textarea
                    v-model="form.rating"
                    placeholder="Review Rating (X/5)"
                    class="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                ></textarea>
                <textarea
                    v-model="form.title"
                    placeholder="Review title"
                    class="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                ></textarea>
                <textarea
                    v-model="form.content"
                    placeholder="Review content"
                    class="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                ></textarea>
                <InputError :message="form.errors.message" class="mt-2" />
                <PrimaryButton class="mt-4">Post</PrimaryButton>
            </form>

            <div class="mt-6 bg-white shadow-sm rounded-lg divide-y">
                <Review
                    v-for="review in reviews"
                    :key="review.id"
                    :review="review"
                />
            </div>
        </div>
    </AuthenticatedLayout>
    <!--Guest Layout (anyone not Nic)-->
    <GuestLayout v-else>

    </GuestLayout>
</template>
 