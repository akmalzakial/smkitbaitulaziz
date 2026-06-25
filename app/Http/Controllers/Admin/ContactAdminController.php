<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSetting;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactAdminController extends Controller
{
    /**
     * Display the contact settings page.
     */
    public function index()
    {
        return Inertia::render('Admin/Contact/Index', [
            'settings' => ContactSetting::current(),
        ]);
    }

    /**
     * Update the contact settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required|string',
            'phone' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'work_hours' => 'required|string|max:255',
            'map_embed_url' => 'required|string',
            'facebook_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'youtube_url' => 'nullable|url|max:255',
        ]);

        $settings = ContactSetting::current();
        $settings->update($validated);

        return redirect()->route('admin.contact.index')
            ->with('success', 'Informasi kontak berhasil diperbarui!');
    }

    /**
     * Display the messages index page.
     */
    public function messagesIndex(Request $request)
    {
        $query = ContactMessage::query();

        // Search filter
        if ($request->has('search') && $request->search !== '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('subject', 'like', '%' . $request->search . '%')
                  ->orWhere('message', 'like', '%' . $request->search . '%');
            });
        }

        // Read/unread filter
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_read', $request->status === 'read');
        }

        $messages = $query->latest()
                          ->paginate(10)
                          ->withQueryString();

        $stats = [
            'total' => ContactMessage::count(),
            'unread' => ContactMessage::where('is_read', false)->count(),
            'read' => ContactMessage::where('is_read', true)->count(),
        ];

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Show a message and mark it as read.
     */
    public function messagesShow(ContactMessage $message)
    {
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return Inertia::render('Admin/Messages/Show', [
            'message' => $message,
        ]);
    }

    /**
     * Mark a message as read.
     */
    public function messagesMarkAsRead(ContactMessage $message)
    {
        $message->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Pesan ditandai sebagai dibaca!');
    }

    /**
     * Delete a message.
     */
    public function messagesDestroy(ContactMessage $message)
    {
        $message->delete();

        return redirect()->route('admin.messages.index')
            ->with('success', 'Pesan berhasil dihapus!');
    }
}
