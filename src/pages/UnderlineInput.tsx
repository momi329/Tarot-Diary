function UnderlineInput({ value, inputType, action }) {
  return (
    <>
      <p className='font-NT text-yellow tracking-widest shadowYellow mb-1'>
        {value}
      </p>
      <div className='relative group'>
        <div className='absolute bottom-0 h-[2px] bg-yellow/50 w-0 group-hover:w-full duration-500'></div>
        <input
          type={inputType}
          name={value}
          className='bg-pink/40  w-full font-NT text-yellow tracking-widest shadowYellow  pl-2 p-2  py-3 hover:bg-pink/0 duration-500'
          onChange={action}
        />
      </div>
    </>
  );
}
export default UnderlineInput;
