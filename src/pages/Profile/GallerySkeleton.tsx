function GallerySkeleton() {
  return (
    <div className="flex gap-4 flex-col  w-[100%] animate-pulse">
      <div className="bg-yellow-100 px-6 py-5 relative  bg-pink bg-opacity-30 h-[400px]">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row  align-center ">
            <div className="rounded-full w-[50px] h-[50px] mr-[16px] bg-yellow/20" />
            <div className=" w-40 h-4 self-center bg-gray/20 rounded-sm  w-40 h-4" />
            <div
              className="font-NT bg-gray rounded-sm shadowGray self-center 
              leading-normal tracking-widest mt-1"
            />
          </div>
        </div>
        <div className="w-[100%] h-[1px] bg-white/20 mt-3 " />
        <div className=" w-[90%] h-4 self-center bg-white/20 rounded-sm   h-4 m-4 mt-7" />
        <div className=" w-80 h-4 self-center bg-gray/20 rounded-sm  h-4 m-4" />
        <div className=" w-96 h-4 self-center bg-white/20 rounded-sm   h-4 m-4" />
        <div className=" w-[90%] h-4 self-center bg-gray/20 rounded-sm   h-4 m-4" />
        <div className=" w-96 h-4 self-center bg-gray/20 rounded-sm   h-4 m-4" />
        <div className="w-[90%] h-4 bg-white/20 mt-3 m-4" />
        <div className=" w-96 h-4 self-center bg-white/20 rounded-sm   h-4 m-4" />
        <div className=" w-[90%] h-4 self-center bg-gray/20 rounded-sm   h-4 m-4" />
      </div>
    </div>
  );
}
export default GallerySkeleton;
