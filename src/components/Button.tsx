function Button({ type, value, action }) {
  const confirm = "w-[60px] h-[20px] bg-blue-300 text-white";
  const cancel = "w-[60px] h-[20px] bg-white text-blue-300";
  const Edit = "w-[60px] h-[20px] bg-slate-300 text-white";

  return (
    <button
      className={`${
        type === "confirm" ? confirm : type === "cancel" ? cancel : Edit
      } `}
      onClick={action}
    >
      {value}
    </button>
  );
}
export default Button;
