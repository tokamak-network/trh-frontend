"use client";

import { Suspense, use } from "react";
import { StackDetail } from "./StackDetail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StackDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = use(
    params instanceof Promise ? params : Promise.resolve(params)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/home"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stacks
        </Link>
      </div>

      <Suspense fallback={<div>Loading stack details...</div>}>
        <StackDetail id={resolvedParams.id} />
      </Suspense>
    </div>
  );
}
