'use client';

import { useEffect, useState } from 'react';
import { clearToken, getToken } from '@/lib/token';

export default function HomePage() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  function handleLogout() {
    clearToken();
    setHasToken(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      <h1 className="text-2xl font-semibold text-gray-900">UniPlay Admin</h1>

      {hasToken ? (
        <>
          <p className="text-sm text-gray-600">เข้าสู่ระบบแล้ว (มี access_token เก็บอยู่)</p>
          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
          >
            ออกจากระบบ
          </button>
        </>
      ) : (
        <div className="flex gap-3">
          <a
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            เข้าสู่ระบบ
          </a>
          <a
            href="/users/new"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            สมัครสมาชิก
          </a>
        </div>
      )}
    </main>
  );
}
