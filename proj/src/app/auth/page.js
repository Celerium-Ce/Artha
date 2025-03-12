import Link from 'next/link';

export default function AuthPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-6">Welcome</h1>
            <div className="flex gap-4">
                <Link 
                    href="/auth/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Login
                </Link>
                <Link 
                    href="/auth/register"
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}