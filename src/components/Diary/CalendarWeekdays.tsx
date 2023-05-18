export function CalendarWeekdays() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div
      className=" bg-black p-2 flex 
     text-yellow shadowYellow"
    >
      {weekdays.map((weekday) => (
        <div
          key={weekday}
          className="w-[17%]  flex cursor-auto pl-1  justify-center"
        >
          {weekday}
        </div>
      ))}
    </div>
  );
}
