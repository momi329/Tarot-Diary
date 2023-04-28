function Loading({ text }) {
  return (
    <>
      <p className='shadowPink'>{text}</p>
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
