<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to ensure light mode is always applied --}}
        <script>
            (function() {
                // Force light mode
                document.documentElement.classList.remove('dark');
                localStorage.setItem('appearance', 'light');
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'SMK IT Baitul Aziz') }}</title>

        @php
            $pageProps = $page['props'] ?? [];
            $pageComponent = $page['component'] ?? '';

            $siteName = config('app.name', 'SMK IT Baitul Aziz');
            $ogTitle = $siteName;
            $ogDescription = 'Website Resmi SMK IT Baitul Aziz - Sekolah Menengah Kejuruan Berbasis Teknologi dan Imtak';
            $ogImage = asset('assets/images/logo.png');
            $ogUrl = url()->current();
            $ogType = 'website';

            if ($pageComponent === 'NewsDetail' && !empty($pageProps['news'])) {
                $item = $pageProps['news'];
                if (is_array($item)) {
                    $title = $item['title'] ?? '';
                    if (!empty($title)) {
                        $ogTitle = $title . ' - ' . $siteName;
                    }
                    
                    $rawDesc = !empty($item['summary']) 
                        ? $item['summary'] 
                        : ($item['content'] ?? '');
                    
                    $cleanDesc = trim(preg_replace('/\s+/', ' ', strip_tags($rawDesc)));
                    if (!empty($cleanDesc)) {
                        $ogDescription = \Illuminate\Support\Str::limit($cleanDesc, 160);
                    }
                    
                    if (!empty($item['image'])) {
                        $img = $item['image'];
                        $ogImage = \Illuminate\Support\Str::startsWith($img, ['http://', 'https://']) 
                            ? $img 
                            : url($img);
                    }
                    $ogType = 'article';
                }
            } elseif ($pageComponent === 'ExtracurricularDetail' && !empty($pageProps['extracurricular'])) {
                $item = $pageProps['extracurricular'];
                if (is_array($item)) {
                    $name = $item['name'] ?? '';
                    if (!empty($name)) {
                        $ogTitle = $name . ' - ' . $siteName;
                    }
                    
                    $rawDesc = $item['description'] ?? '';
                    $cleanDesc = trim(preg_replace('/\s+/', ' ', strip_tags($rawDesc)));
                    if (!empty($cleanDesc)) {
                        $ogDescription = \Illuminate\Support\Str::limit($cleanDesc, 160);
                    }
                    
                    if (!empty($item['image'])) {
                        $img = $item['image'];
                        $ogImage = \Illuminate\Support\Str::startsWith($img, ['http://', 'https://']) 
                            ? $img 
                            : url($img);
                    }
                    $ogType = 'article';
                }
            }
        @endphp

        <!-- Primary Meta Tags -->
        <meta name="title" content="{{ $ogTitle }}">
        <meta name="description" content="{{ $ogDescription }}">

        <!-- Open Graph / Facebook / WhatsApp Meta Tags -->
        <meta property="og:type" content="{{ $ogType }}">
        <meta property="og:url" content="{{ $ogUrl }}">
        <meta property="og:title" content="{{ $ogTitle }}">
        <meta property="og:description" content="{{ $ogDescription }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta property="og:image:secure_url" content="{{ $ogImage }}">
        <meta property="og:image:alt" content="{{ $ogTitle }}">
        <meta property="og:site_name" content="{{ $siteName }}">

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ $ogUrl }}">
        <meta name="twitter:title" content="{{ $ogTitle }}">
        <meta name="twitter:description" content="{{ $ogDescription }}">
        <meta name="twitter:image" content="{{ $ogImage }}">

        {{-- Favicon --}}
        <link rel="icon" type="image/png" href="{{ asset('assets/images/logo.png') }}">
        <link rel="apple-touch-icon" href="{{ asset('assets/images/logo.png') }}">

        {{-- Fonts --}}
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />

        {{-- Argon Dashboard CSS & Icons for admin routes --}}
        @if(request()->is('admin/*') || request()->is('admin') || request()->is('profile/*') || request()->is('settings/*') || request()->is('settings'))
            <link href="{{ asset('css/argon/nucleo-icons.css') }}" rel="stylesheet" />
            <link href="{{ asset('css/argon/nucleo-svg.css') }}" rel="stylesheet" />
            <link href="{{ asset('css/argon/argon-dashboard-tailwind.min.css') }}" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        @endif

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
