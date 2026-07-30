<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $news = News::with('user')
                ->orderBy('created_at', 'desc')
                ->get();
        
        return Inertia::render('Admin/News/Index', [
            'news' => $news
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/News/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:news,slug',
            'summary' => 'nullable|string',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:100',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_featured' => 'nullable|boolean',
            'gallery_images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'created_at' => 'nullable|date',
        ]);

        $imagePath = null;
        
        if ($request->hasFile('image')) {
            // Generate a unique name for the image
            $fileName = Str::random(20) . '.' . $request->file('image')->getClientOriginalExtension();
            
            // Store the image in the public storage
            $imagePath = $request->file('image')->storeAs('news', $fileName, 'public');
        }

        $news = News::create([
            'title' => $request->title,
            'slug' => $request->slug, // Use provided slug
            'summary' => $request->summary,
            'content' => $request->content,
            'category' => $request->category,
            'author' => $request->author,
            'image' => $imagePath ? Storage::url($imagePath) : null,
            'is_featured' => $request->is_featured ? true : false,
            'user_id' => Auth::id(),
            'created_at' => $request->filled('created_at') ? \Carbon\Carbon::parse($request->created_at)->setTimeFrom(now()) : now(),
        ]);

        // Simpan foto-foto tambahan ke galeri
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $index => $gFile) {
                $gFileName = Str::random(20) . '.' . $gFile->getClientOriginalExtension();
                $gPath = $gFile->storeAs('gallery', $gFileName, 'public');

                Gallery::create([
                    'title' => $news->title . ' - Foto ' . ($index + 1),
                    'description' => 'Foto dari berita: ' . $news->title,
                    'category' => $news->category ?: 'Berita',
                    'image' => Storage::url($gPath),
                    'is_featured' => false,
                    'user_id' => Auth::id(),
                    'news_id' => $news->id,
                ]);
            }
        }

        return redirect()->route('admin.news.index')
                        ->with('success', 'Berita berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(News $news)
    {
        return Inertia::render('Admin/News/Show', [
            'news' => $news->load(['user', 'galleries'])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(News $news)
    {
        return Inertia::render('Admin/News/Edit', [
            'news' => $news->load('galleries')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, News $news)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:news,slug,' . $news->id,
            'summary' => 'nullable|string',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_featured' => 'nullable|boolean',
            'gallery_images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'removed_gallery_ids' => 'nullable|array',
            'removed_gallery_ids.*' => 'integer|exists:galleries,id',
            'created_at' => 'nullable|date',
        ]);

        $data = [
            'title' => $request->title,
            'slug' => $request->slug, // Use provided slug
            'summary' => $request->summary,
            'content' => $request->content,
            'category' => $request->category,
            'author' => $request->author,
            'is_featured' => $request->is_featured ? true : false,
            'created_at' => $request->filled('created_at') 
                ? \Carbon\Carbon::parse($request->created_at)->setTimeFrom($news->created_at ?: now()) 
                : $news->created_at,
        ];

        // Handle image update if provided
        if ($request->hasFile('image')) {
            // Remove the old image if exists
            if ($news->image && Storage::exists('public/' . str_replace('/storage/', '', $news->image))) {
                Storage::delete('public/' . str_replace('/storage/', '', $news->image));
            }

            // Generate a unique name for the new image
            $fileName = Str::random(20) . '.' . $request->file('image')->getClientOriginalExtension();
            
            // Store the new image
            $imagePath = $request->file('image')->storeAs('news', $fileName, 'public');
            
            $data['image'] = Storage::url($imagePath);
        }

        $news->update($data);

        // Update kategori foto galeri terkait jika kategori berita berubah
        $news->galleries()->update([
            'category' => $news->category ?: 'Berita'
        ]);

        // Hapus foto galeri yang diminta untuk dihapus
        if ($request->filled('removed_gallery_ids')) {
            $galleriesToDelete = Gallery::whereIn('id', $request->removed_gallery_ids)
                ->where('news_id', $news->id)
                ->get();

            foreach ($galleriesToDelete as $gItem) {
                if ($gItem->image && Storage::exists('public/' . str_replace('/storage/', '', $gItem->image))) {
                    Storage::delete('public/' . str_replace('/storage/', '', $gItem->image));
                }
                $gItem->delete();
            }
        }

        // Simpan foto-foto galeri baru
        if ($request->hasFile('gallery_images')) {
            $existingCount = $news->galleries()->count();
            foreach ($request->file('gallery_images') as $index => $gFile) {
                $gFileName = Str::random(20) . '.' . $gFile->getClientOriginalExtension();
                $gPath = $gFile->storeAs('gallery', $gFileName, 'public');

                Gallery::create([
                    'title' => $news->title . ' - Foto ' . ($existingCount + $index + 1),
                    'description' => 'Foto dari berita: ' . $news->title,
                    'category' => $news->category ?: 'Berita',
                    'image' => Storage::url($gPath),
                    'is_featured' => false,
                    'user_id' => Auth::id(),
                    'news_id' => $news->id,
                ]);
            }
        }

        return redirect()->route('admin.news.index')
                        ->with('success', 'Berita berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(News $news)
    {
        // Delete all associated gallery image files
        foreach ($news->galleries as $galleryItem) {
            if ($galleryItem->image && Storage::exists('public/' . str_replace('/storage/', '', $galleryItem->image))) {
                Storage::delete('public/' . str_replace('/storage/', '', $galleryItem->image));
            }
        }

        // Delete the main image file
        if ($news->image && Storage::exists('public/' . str_replace('/storage/', '', $news->image))) {
            Storage::delete('public/' . str_replace('/storage/', '', $news->image));
        }

        // Delete the news entry (cascade deletes gallery records in DB)
        $news->delete();

        return redirect()->route('admin.news.index')
                        ->with('success', 'Berita berhasil dihapus.');
    }

    /**
     * Upload image from TinyMCE editor for news content.
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
        ]);

        if ($request->hasFile('file')) {
            $fileName = Str::random(20) . '.' . $request->file('file')->getClientOriginalExtension();
            $path = $request->file('file')->storeAs('news/content', $fileName, 'public');

            return response()->json([
                'location' => url(Storage::url($path))
            ]);
        }

        return response()->json(['error' => 'Gagal mengunggah gambar'], 400);
    }
}
