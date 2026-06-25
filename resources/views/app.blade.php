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
