import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar only for dashboard */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
