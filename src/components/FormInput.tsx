import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  tooltip?: string;
  required?: boolean;
  min?: number;
}

export function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  tooltip,
  required = false,
  min,
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <div className="flex items-center gap-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {tooltip && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400" />
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <input
        type={type}
        {...register(name)}
        min={min}
        placeholder={placeholder}
        className={`mt-1 w-full px-3 py-2 border rounded-md ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
