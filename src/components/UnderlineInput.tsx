type UnderlineInputProps = {
  name?: string;
  value: string;
  inputType: string;
  action: (e?: any) => void | {};
  keyAction?: (e?: any) => void | {};
  placeholder?: string;
};

function UnderlineInput({
  name,
  value,
  inputType,
  action,
  keyAction,
  placeholder,
}: UnderlineInputProps) {
  return (
    <>
      <p className='font-NT text-yellow tracking-widest shadowYellow mb-1'>
        {name}
      </p>
      <div className='relative group'>
        <div className='absolute bottom-0 h-[2px] bg-yellow/50 w-0 group-hover:w-full duration-500'></div>
        <input
          type={inputType}
          name={name}
          value={value}
          className='bg-pink/40  w-full font-NT text-yellow tracking-widest shadowYellow  pl-2 p-2  py-3 hover:bg-pink/0 duration-500'
          onChange={action}
          onKeyDown={keyAction}
          placeholder={placeholder}
        />
      </div>
    </>
  );
}
export default UnderlineInput;
