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
  const monthYear = `${year} . ${monthNumber}`;
  return (
    <div
      className="flex justify-between items-center 
    p-1 bg-black rounded-sm text-yellow pt-2 rounde-t-lg "
    >
      <button
        className="text-3xl cursor-pointer text-notoSansJP shadowYellow text-yellow p-2"
        onClick={prevMonth}
      >
        &lt;
      </button>
      <div className="text-2xl leading-9 yellowShadow">{monthYear}</div>
      <button
        className="text-3xl cursor-pointer text-notoSansJP shadowYellow text-yellow p-2"
        onClick={nextMonth}
      >
        &gt;
      </button>
    </div>
  );
}
