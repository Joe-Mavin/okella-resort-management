import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavigation from '../components/admin/AdminNavigation';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminNavigation />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
