export const metadata = {
  title: 'Authentication',
  description: 'Login and registration pages',
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full">
      {/* This layout completely replaces any parent layout for auth routes */}
      <main className="auth-layout w-full">
        {children}
      </main>
    </div>
  );
}
