<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Reviews/Index', [
            'reviews' => Review::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'subject' => 'required|string',
            'rating' => 'required|int|max:5',
            'content' => 'required|string',
        ]);

        $rv = Review::create([
            'title' => $validated['title'],
            'subject' => $validated['subject'],
            'rating' => $validated['rating'],
            'content' => $validated['content'],
        ]);

        return redirect(route('reviews.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'subject' => 'required|string',
            'rating' => 'required|int|max:5',
            'content' => 'required|string',
        ]);

        $review->update($validated);
        
        return redirect(route('reviews.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        $review->delete();
        
        return redirect(route('reviews.index'));
    }
}
