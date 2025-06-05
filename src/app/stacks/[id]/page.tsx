"use client";

import { use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StackDetail } from "./StackDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StackDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

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

      <StackDetail id={resolvedParams.id} />
    </div>
  );
}
