import { Settings, Trash2, Download } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Status } from "@/lib/types/status";
import { PluginItemProps } from "./types";

export function PluginItem({
  plugin,
  onViewConfig,
  onUninstall,
  onInstall,
}: PluginItemProps) {
  const isTerminated = plugin.status === "Terminated";

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">{plugin.name}</h3>
            <StatusBadge status={plugin.status as Status} />
          </div>
          <p className="text-gray-600 mt-2">
            URL:{" "}
            <a href={plugin.info.url} target="_blank" rel="noopener noreferrer">
              {plugin.info.url}
            </a>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewConfig(plugin)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            title="View Configuration"
          >
            <Settings className="w-5 h-5" />
          </button>
          {isTerminated ? (
            <button
              onClick={() => onInstall?.(plugin.type, plugin.config || {})}
              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
              title="Install Plugin"
            >
              <Download className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => onUninstall(plugin)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Uninstall Plugin"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
