<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ExtracurricularController;
use App\Http\Controllers\PpdbController;
use App\Http\Controllers\Admin\PpdbAdminController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\StrukturController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/profil-sekolah', [HomeController::class, 'profile'])->name('profile');
Route::get('/program-keahlian', [HomeController::class, 'programKeahlian'])->name('program-keahlian');
Route::get('/gallery', [HomeController::class, 'gallery'])->name('gallery');
Route::get('/berita', [HomeController::class, 'news'])->name('news');
Route::get('/berita/{slug}', [HomeController::class, 'newsDetail'])->name('news.detail');
Route::get('/kontak', [HomeController::class, 'contact'])->name('contact');
Route::post('/kontak', [HomeController::class, 'submitContact'])->name('contact.submit');

// Ekstrakurikuler routes
Route::get('/ekstrakurikuler', [ExtracurricularController::class, 'index'])->name('extracurricular');
Route::get('/ekstrakurikuler/{slug}', [ExtracurricularController::class, 'show'])->name('extracurricular.detail');

// Struktur Organisasi routes
Route::get('/struktur-organisasi', [StrukturController::class, 'index'])->name('struktur.index');

// SPMB routes
Route::get('/spmb', [PpdbController::class, 'index'])->name('spmb.index');
Route::get('/spmb/pendaftaran', [PpdbController::class, 'create'])->name('spmb.create');
Route::post('/spmb/pendaftaran', [PpdbController::class, 'store'])->name('spmb.store');
Route::get('/spmb/status', [PpdbController::class, 'status'])->name('spmb.status');
Route::get('/spmb/{ppdb}', [PpdbController::class, 'show'])->name('spmb.show');
Route::get('/spmb/{ppdb}/cetak', [PpdbController::class, 'print'])->name('spmb.print');
Route::get('/spmb/{ppdb}/edit', [PpdbController::class, 'edit'])->name('spmb.edit');
Route::post('/spmb/pendaftaran/{ppdb}/update', [PpdbController::class, 'update'])->name('spmb.update');

// Settings routes
require __DIR__.'/settings.php';

// Admin routes
Route::prefix('admin')->middleware(['auth', AdminMiddleware::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Gallery Routes
    Route::resource('gallery', GalleryController::class)->names([
        'index' => 'admin.gallery.index',
        'create' => 'admin.gallery.create',
        'store' => 'admin.gallery.store',
        'show' => 'admin.gallery.show',
        'edit' => 'admin.gallery.edit',
        'update' => 'admin.gallery.update',
        'destroy' => 'admin.gallery.destroy',
    ]);
    
    // News Routes
    Route::resource('news', NewsController::class)->names([
        'index' => 'admin.news.index',
        'create' => 'admin.news.create',
        'store' => 'admin.news.store',
        'show' => 'admin.news.show',
        'edit' => 'admin.news.edit',
        'update' => 'admin.news.update',
        'destroy' => 'admin.news.destroy',
    ]);

    // Ekstrakurikuler management
    Route::resource('extracurriculars', \App\Http\Controllers\Admin\ExtracurricularController::class)->names([
        'index' => 'admin.extracurriculars.index',
        'create' => 'admin.extracurriculars.create',
        'store' => 'admin.extracurriculars.store',
        'show' => 'admin.extracurriculars.show',
        'edit' => 'admin.extracurriculars.edit',
        'update' => 'admin.extracurriculars.update',
        'destroy' => 'admin.extracurriculars.destroy',
    ]);
    
    // SPMB management
    Route::get('/spmb', [PpdbAdminController::class, 'index'])->name('admin.spmb.index');
    Route::get('/spmb/dashboard', [PpdbAdminController::class, 'dashboard'])->name('admin.spmb.dashboard');
    Route::get('/spmb/settings', [PpdbAdminController::class, 'settings'])->name('admin.spmb.settings');
    Route::put('/spmb/settings', [PpdbAdminController::class, 'updateSettings'])->name('admin.spmb.settings.update');
    Route::get('/spmb/export', [PpdbAdminController::class, 'export'])->name('admin.spmb.export');
    Route::get('/spmb/{ppdb}', [PpdbAdminController::class, 'show'])->name('admin.spmb.show');
    Route::put('/spmb/{ppdb}/status', [PpdbAdminController::class, 'updateStatus'])->name('admin.spmb.update-status');
    Route::get('/spmb/{ppdb}/cetak', [PpdbAdminController::class, 'print'])->name('admin.spmb.print');
    Route::delete('/spmb/{ppdb}', [PpdbAdminController::class, 'destroy'])->name('admin.spmb.destroy');
    
    // User management
    Route::resource('users', UserController::class)->names([
        'index' => 'admin.users.index',
        'create' => 'admin.users.create',
        'store' => 'admin.users.store',
        'show' => 'admin.users.show',
        'edit' => 'admin.users.edit',
        'update' => 'admin.users.update',
        'destroy' => 'admin.users.destroy',
    ]);
    
    // Teacher management
    Route::resource('teachers', TeacherController::class)->names([
        'index' => 'admin.teachers.index',
        'create' => 'admin.teachers.create',
        'store' => 'admin.teachers.store',
        'show' => 'admin.teachers.show',
        'edit' => 'admin.teachers.edit',
        'update' => 'admin.teachers.update',
        'destroy' => 'admin.teachers.destroy',
    ]);

    // Contact settings management
    Route::get('/contact', [\App\Http\Controllers\Admin\ContactAdminController::class, 'index'])->name('admin.contact.index');
    Route::put('/contact', [\App\Http\Controllers\Admin\ContactAdminController::class, 'update'])->name('admin.contact.update');

    // Message/Inbox management
    Route::get('/messages', [\App\Http\Controllers\Admin\ContactAdminController::class, 'messagesIndex'])->name('admin.messages.index');
    Route::get('/messages/{message}', [\App\Http\Controllers\Admin\ContactAdminController::class, 'messagesShow'])->name('admin.messages.show');
    Route::put('/messages/{message}/read', [\App\Http\Controllers\Admin\ContactAdminController::class, 'messagesMarkAsRead'])->name('admin.messages.read');
    Route::delete('/messages/{message}', [\App\Http\Controllers\Admin\ContactAdminController::class, 'messagesDestroy'])->name('admin.messages.destroy');
});

require __DIR__.'/auth.php';
