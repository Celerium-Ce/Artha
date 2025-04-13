"use client";
import Link from 'next/link';

export default function AuthPage() {
    return (
        <div 
            className="flex flex-col items-center justify-center h-screen p-6"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)"
            }}
        >
            <h1 
                className="text-3xl font-bold mb-6 opacity-90"
                style={{ color: "var(--highlight, #fff)" }}
            >
                Welcome
            </h1>
            <div className="flex gap-4">
                <Link 
                    href="/auth/login"
                    className="px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "var(--accent, #4a7dfc)" }}
                >
                    Login
                </Link>
                <Link 
                    href="/auth/register"
                    className="px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "var(--accent, #4a7dfc)" }}
                >
                    Register
                </Link>
            </div>
        </div>
    );
}