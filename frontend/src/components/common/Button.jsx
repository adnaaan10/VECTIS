function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
}) {
  const baseStyles =
    "px-[18px] py-[10px] border-0 rounded text-sm font-semibold cursor-pointer transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#111] text-white enabled:hover:bg-[#333]",

    secondary:
      "bg-[#eee] text-[#111] enabled:hover:bg-[#ddd]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
