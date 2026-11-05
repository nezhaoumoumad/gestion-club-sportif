import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
        <div>
            {/* Le titre ELITE SPORT est maintenant ici, cliquable et renvoie à l'accueil "/" */}
            <Link href="/" className="flex items-center justify-center font-bold text-3xl tracking-wider my-6 uppercase">
                <span className="text-black">Elite</span>
                <span className="text-amber-500 ml-1">Sport</span>
            </Link>
        </div>

        <div className="w-full sm:max-w-md px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
            {children}
        </div>
    </div>
);
}
