const Button = ({ text, onClick, type = "button" }) => {
  return (
    <button
      className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
