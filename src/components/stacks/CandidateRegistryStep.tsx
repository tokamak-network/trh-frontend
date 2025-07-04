import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";

export function CandidateRegistryStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const registerCandidate = watch("registerCandidate");

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Candidate Registry Plugin</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              DAO Candidate Registration Configuration
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Configure the DAO candidate registration plugin with the required
              information for candidate registration.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("registerCandidate")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Install Candidate Registry Plugin
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Check this box to automatically install the candidate registry
            plugin during stack deployment.
          </p>
        </div>

        {registerCandidate && (
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Registration Details
            </h3>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  {...register("candidateAmount")}
                  type="number"
                  placeholder="e.g. 1000.1"
                  min={0}
                  step={0.1}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.candidateAmount
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.candidateAmount && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.candidateAmount.message as string}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Registration amount in tokens
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Memo
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  {...register("candidateMemo")}
                  type="text"
                  placeholder="Enter memo"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.candidateMemo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.candidateMemo && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.candidateMemo.message as string}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Additional information or memo for the registration
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name Information
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  {...register("candidateNameInfo")}
                  type="text"
                  placeholder="Enter name information"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.candidateNameInfo
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.candidateNameInfo && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.candidateNameInfo.message as string}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Name or identifier information for the candidate
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
