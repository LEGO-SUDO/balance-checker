export function Toast({ message, onClose, style }) {
  return (
    <div className='fixed right-[20px]' style={style}>
      <div className='bg-[#ffcc00] px-[20px] py-[10px] rounded-[5px] shadow-md'>
        {message}
        <button onClick={onClose} className='ml-2'>
          X
        </button>
      </div>
    </div>
  )
}
