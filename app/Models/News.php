<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class News extends Model
{
    use HasFactory;

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'summary',
        'content',
        'image',
        'category',
        'author',
        'is_featured',
        'user_id',
        'created_at',
        'views_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_featured' => 'boolean',
        'views_count' => 'integer',
    ];

    /**
     * Get the user that created the news.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Alias untuk relationship user.
     * Digunakan untuk konsistensi dengan interface di frontend yang menggunakan author.
     */
    public function author(): BelongsTo
    {
        return $this->user();
    }

    /**
     * Get the gallery items associated with the news.
     */
    public function galleries(): HasMany
    {
        return $this->hasMany(Gallery::class);
    }
}
