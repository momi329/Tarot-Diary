import React from "react";
type UnderlineInputProps = {
  name?: string;
  value: string;
  inputType: string;
  action: (e: React.ChangeEvent<HTMLInputElement>) => void | object;
  keyAction?: (e: React.KeyboardEvent<HTMLInputElement>) => void | object;
  placeholder?: string;
  disabled?: boolean;
};

function UnderlineInput({
  name,
  value,
  inputType,
  action,
  keyAction,
  placeholder,
  disabled,
}: UnderlineInputProps) {
  return (
    <>
      <p className="font-NT text-yellow tracking-widest shadowYellow mb-1">
        {name}
      </p>
      <div className="relative group">
        <div className="absolute bottom-0 h-[2px] bg-yellow/50 w-0 group-hover:w-full duration-500"></div>
        <input
          type={inputType}
          name={name}
          value={value}
          className="bg-pink/40  w-full font-NT text-yellow tracking-widest shadowYellow  pl-2 p-2  py-3 hover:bg-pink/0 duration-500"
          onChange={action}
          onKeyDown={keyAction}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </>
  );
}
export default UnderlineInput;
