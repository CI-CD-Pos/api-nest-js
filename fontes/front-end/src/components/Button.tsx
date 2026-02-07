import { classMerge } from "../utils/classMerge";

interface ButtonProps extends React.ComponentProps<"button"> {
  isLaoding?: boolean;
  vaiant?: "base" | "icon" | "iconSmall";
}

const buttonVariants = {
  button: {
    base: "px-4 py-3",
    icon: "size-12",
    iconSmall: "size-8",
  },
};

export function Button({
  isLaoding,
  children,
  className,
  type = "button",
  vaiant = "base",
  ...props
}: ButtonProps) {
  return (
    <button
      className={classMerge([
        "flex cursor-pointer items-center justify-center rounded-lg bg-green-100 text-white transition ease-linear hover:bg-green-200 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants.button[vaiant],
        isLaoding && "cursor-progress",
        className,
      ])}
      type={type}
      disabled={isLaoding}
      {...props}
    >
      {children}
    </button>
  );
}
