const Button = ({ type = "button", className = "", children, ...props }) => {
  return (
    <button
      type={type}
      className={`transition duration-300 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
