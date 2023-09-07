<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import Blog from '@/Components/Blog.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { useForm, Head } from '@inertiajs/vue3';

defineProps(['blogs'])
 
const form = useForm({
    title: '',
    message: '',
});
</script>
 
<template>
    <Head title="Nic's Blog" />
    <!--Admin Layout (Nic)-->
    <AuthenticatedLayout v-if="$page.props.auth.user">
        <div class="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <form @submit.prevent="form.post(route('blog.store'), { onSuccess: () => form.reset() })">
                <textarea
                    v-model="form.title"
                    placeholder="Blog Title"
                    class="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                ></textarea>
                <textarea
                    v-model="form.message"
                    placeholder="What's on your mind?"
                    class="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                ></textarea>
                <InputError :message="form.errors.message" class="mt-2" />
                <PrimaryButton class="mt-4">Post</PrimaryButton>
            </form>

            <div class="mt-6 bg-white shadow-sm rounded-lg divide-y">
                <Blog
                    v-for="blog in blogs"
                    :key="blog.id"
                    :blog="blog"
                />
            </div>
        </div>
    </AuthenticatedLayout>
    <!--Guest Layout (anyone not Nic)-->
    <GuestLayout v-else>
        <div class="mt-6 bg-white shadow-sm rounded-lg divide-y">
            <Blog
                v-for="blog in blogs"
                :key="blog.id"
                :blog="blog"
            />
        </div>
    </GuestLayout>
</template>