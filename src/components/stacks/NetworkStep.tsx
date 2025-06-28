import { useFormContext } from "react-hook-form";

export function NetworkStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Network Configuration</h2>
      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Network
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            {...register("network")}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.network ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="Testnet">Testnet</option>
            <option value="Mainnet">Mainnet</option>
          </select>
          {errors.network && (
            <p className="mt-1 text-xs text-red-500">
              {errors.network.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chain Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            {...register("chainName")}
            type="text"
            placeholder="e.g., thanos sepolia"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.chainName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.chainName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.chainName.message as string}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            A unique name for your L2 chain. Must start with a letter and can
            only contain letters, numbers and spaces.
          </p>
        </div>
      </div>
    </section>
  );
}
