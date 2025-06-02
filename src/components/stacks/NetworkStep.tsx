import { FormInput } from "@/components/ui/FormInput";
import { useFormContext } from "react-hook-form";

export function NetworkStep() {
  const { register } = useFormContext();

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Mainnet">Mainnet</option>
            <option value="Testnet">Testnet</option>
          </select>
        </div>

        <FormInput
          name="chainName"
          label="Chain Name"
          required
          placeholder="e.g., my-l2-chain"
          tooltip="A unique name for your L2 chain"
        />
      </div>
    </section>
  );
}
