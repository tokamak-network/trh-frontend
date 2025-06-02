"use client";
import { useEffect, useState } from "react";
import { thanosService, ThanosStack } from "@/lib/services/thanos-service";
import { StatusBadge } from "./StatusBadge";
import { Status } from "@/lib/types/status";
import { Eye } from "lucide-react";
import Link from "next/link";

export function ThanosStacksList() {
  const [stacks, setStacks] = useState<ThanosStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStacks = async () => {
      try {
        const data = await thanosService.getThanosStacks();
        setStacks(data);
      } catch (err) {
        setError("Failed to fetch Thanos stacks");
        console.error("Error fetching stacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStacks();
  }, []);

  if (loading) {
    return <div>Loading Thanos stacks...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Thanos Stacks</h2>
      {stacks.length === 0 ? (
        <p>No Thanos stacks found</p>
      ) : (
        <div className="grid gap-4">
          {stacks.map((stack) => (
            <div
              key={stack.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {stack.config.chainName}
                  </h3>
                  <div className="flex items-center gap-4">
                    <p className="text-gray-600">Network: {stack.network}</p>
                    <StatusBadge status={stack.status as Status} />
                  </div>
                </div>
                <Link
                  href={`/stacks/${stack.id}`}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="View Stack Details"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
