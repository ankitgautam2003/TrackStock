'use client';

import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import MaterialForm from '@/components/MaterialForm';
import Link from 'next/link';

export default function AddMaterialPage() {
  const router = useRouter();

  return (
    <div>
      <Navigation />
      <div className="container">
        <Link href="/inventory" className="text-blue-600 hover:text-blue-800 mb-4">
          ← Back to Inventory
        </Link>

        <MaterialForm
          onSuccess={() => {
            router.push('/inventory');
          }}
        />
      </div>
    </div>
  );
}
