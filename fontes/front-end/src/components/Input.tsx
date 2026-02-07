interface InputProps extends React.ComponentProps<"input"> {
  legend?: string;
  error?: string;
}
export function Input({ legend, type = "text", error, ...props }: InputProps) {
  return (
    <fieldset className="flex w-full flex-1 flex-col text-gray-200 focus-within:text-green-100">
      {legend && (
        <legend className="text-xxs mb-2 text-inherit uppercase">
          {legend}
        </legend>
      )}
      <input
        className={`h-12 w-full rounded-xl border px-4 text-gray-100 placeholder-gray-300 outline-none focus:border-2 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-green-100"
        }`}
        type={type}
        {...props}
      />
      {error && <span className="mt-1 -mb-1 text-xs text-red-500">{error}</span>}
    </fieldset>
  );
}
