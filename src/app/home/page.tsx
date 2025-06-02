import { ThanosStacksList } from "@/components/ThanosStacksList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tokamak Rollup Hub Dashboard</h1>
        <Link
          href="/stacks/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Deploy New Stack
        </Link>
      </div>
      <ThanosStacksList />
    </div>
  );
}
