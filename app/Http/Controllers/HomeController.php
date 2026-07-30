<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Gallery;
use App\Models\News;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        // Ambil data galeri yang ditandai sebagai featured (maksimal 6)
        $featuredGallery = Gallery::with('user')
            ->where('is_featured', true)
            ->latest()
            ->take(6)
            ->get();
        
        // Ambil berita terbaru (maksimal 3)
        $latestNews = News::with('author')
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Home', [
            'featuredGallery' => $featuredGallery,
            'latestNews' => $latestNews,
        ]);
    }

    /**
     * Display the gallery page.
     */
    public function gallery()
    {
        // Ambil semua data galeri beserta relasi user dan news
        $galleries = Gallery::with(['user', 'news'])->latest()->get();
        
        // Ambil semua kategori unik
        $categories = Gallery::distinct()->pluck('category')->filter()->values();

        return Inertia::render('Gallery', [
            'galleries' => $galleries,
            'categories' => $categories,
        ]);
    }

    /**
     * Display the news page.
     */
    public function news()
    {
        // Ambil semua berita
        $news = News::with('author')->latest()->get();
        
        // Ambil berita yang ditandai sebagai featured
        $featured = News::with('author')
            ->where('is_featured', true)
            ->latest()
            ->first();

        // Ambil semua kategori unik
        $categories = News::distinct()->pluck('category')->filter()->values();

        return Inertia::render('News', [
            'news' => $news,
            'featured' => $featured,
            'categories' => $categories,
        ]);
    }

    /**
     * Display a single news article.
     */
    public function newsDetail($slug)
    {
        // Cari berita berdasarkan slug, jika tidak ditemukan coba berdasarkan ID
        $news = News::with(['author', 'galleries'])
            ->where('slug', $slug)
            ->first();

        if (!$news && is_numeric($slug)) {
            $news = News::with(['author', 'galleries'])->find($slug);
        }

        if (!$news) {
            abort(404);
        }

        // Increment views count (menggunakan session agar penambahan view valid & efisien)
        $sessionKey = 'viewed_news_' . $news->id;
        if (!session()->has($sessionKey)) {
            $news->increment('views_count');
            session()->put($sessionKey, true);
        }

        // Ambil berita terkait berdasarkan kategori yang sama (maksimal 3)
        $relatedNews = News::with('author')
            ->where('id', '!=', $news->id)
            ->where('category', $news->category)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('NewsDetail', [
            'news' => $news,
            'relatedNews' => $relatedNews,
        ]);
    }

    /**
     * Display the school profile page.
     */
    public function profile()
    {
        return Inertia::render('ProfileSekolah');
    }

    /**
     * Display the program keahlian page.
     */
    public function programKeahlian()
    {
        return Inertia::render('ProgramKeahlian');
    }

    /**
     * Display the contact page.
     */
    public function contact()
    {
        return Inertia::render('Contact', [
            'contactSettings' => \App\Models\ContactSetting::current()
        ]);
    }

    /**
     * Handle the submission of the contact form.
     */
    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        \App\Models\ContactMessage::create($validated);

        return redirect()->back()->with('success', 'Pesan Anda berhasil dikirim!');
    }
} 