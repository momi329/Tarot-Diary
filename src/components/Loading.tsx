function Loading({ text }) {
  return (
    <>
      <p className='font-NT  text-pink shadowPink'>{text}</p>
      <div className='container self-start'>
        <div className='block'></div>
        <div className='block'></div>
        <div className='block'></div>
        <div className='block'></div>
      </div>
    </>
  );
}
export default Loading;
