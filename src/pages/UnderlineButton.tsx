type UnderlineButtonProps = {
  value: string;
  icon: any;
  type: string;
  selected?: boolean;
  action: (() => {}) | (() => void);
};

function UnderlineButton({
  value,
  icon,
  type,
  action,
  selected,
}: UnderlineButtonProps) {
  let style;
  if (type === "memberPage") {
    style = {
      a: "text-2xl text-pink font-NT shadowPink",
      b: "bg-pink h-[1.5px]",
    };
  }
  if (type === "header") {
    style = {
      a: "text-xl text-yellow font-NT shadowYellow",
      b: `bg-yellow h-[1.5px] ${selected ? "w-full" : ""}`,
    };
  }
  return (
    <div
      className='flex flex-row gap-3 items-center relative group bg-none '
      onClick={() => action()}
    >
      <button className={`tracking-wider duration-200 ${style.a}`}>
        {value}
      </button>
      {icon}
      <div
        className={`${style.b} absolute w-0  bottom-0  group-hover:w-full duration-500`}
      />
    </div>
  );
}
export default UnderlineButton;
