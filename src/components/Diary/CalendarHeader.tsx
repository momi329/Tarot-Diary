type CalendarHeaderProps = {
  selectedDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
};
export function CalendarHeader({
  selectedDate,
  prevMonth,
  nextMonth,
}: CalendarHeaderProps) {
  const year = selectedDate.getFullYear();
  const monthNumber = selectedDate.getMonth() + 1;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[selectedDate.getMonth()];
  const monthYear = `${year}.${monthNumber},${monthName}`;
  return (
    <div
      className="flex justify-between items-center 
    p-1 bg-black rounded-sm text-yellow pt-2 rounde-t-lg "
    >
      <button
        className="cursor-pointer text-notoSansJP shadowYellow text-yellow p-2"
        onClick={prevMonth}
      >
        &lt;
      </button>
      <div className="text-lg yellowShadow">{monthYear}</div>
      <button
        className="cursor-pointer text-notoSansJP shadowYellow text-yellow p-2"
        onClick={nextMonth}
      >
        &gt;
      </button>
    </div>
  );
}
