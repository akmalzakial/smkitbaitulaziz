<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSetting extends Model
{
    protected $fillable = [
        'address',
        'phone',
        'whatsapp',
        'email',
        'work_hours',
        'map_embed_url',
        'facebook_url',
        'instagram_url',
        'youtube_url',
    ];

    /**
     * Get the current contact settings (first record or create defaults)
     */
    public static function current(): self
    {
        return self::firstOrCreate([], [
            'address' => 'Jl. Baitul Aziz, Solokan Jeruk, Kec. Solokanjeruk, Kabupaten Bandung, Jawa Barat 40376',
            'phone' => '(022) 8596 3085',
            'whatsapp' => '62895610055000',
            'email' => 'info@smkitbaitulaziz.sch.id',
            'work_hours' => 'Senin - Jumat: 07:00 - 16:00',
            'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.882103565451!2d107.7447783!3d-7.023157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c1583ca914bb%3A0xc0d8f766cc6dfa42!2sSMK%20IT%20BAITUL%20AZIZ!5e0!3m2!1sid!2sid!4v1711200000000!5m2!1sid!2sid',
            'facebook_url' => 'https://facebook.com/baitulaziz.indonesia/',
            'instagram_url' => 'https://www.instagram.com/baitulaziz.id',
            'youtube_url' => 'https://www.youtube.com/channel/UCmhFZ8RI85ZTVAQTDW2TFtg',
        ]);
    }
}
