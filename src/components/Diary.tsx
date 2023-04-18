import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "../Calander.css";
import cards from "../tarotcard/tarot-images";
import { Timestamp } from "firebase/firestore";
import firebase from "../utils/firebase";
import { Post } from "./Post";
interface Props {
  selectedDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  diaryData: {}[] | Day[];
  isDiaryOpen: boolean;
  setIsDiaryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDayDiary: React.Dispatch<React.SetStateAction<Day | {}>>;
  dayDairy: Day | {};
  setTargetDiary?: any;
}
interface Day {
  title: string;
  card: number;
  reverse: boolean;
  secret: boolean;
  time: Timestamp;
  content: string;
}

function Diary() {
  const { isLogin, user, userUID } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [diaryData, setDiaryData] = useState<{}[] | []>([]);
  const [isDiaryOpen, setIsDiaryOpen] = useState<boolean>(false);
  const [dayDairy, setDayDiary] = useState({});
  const [targetDiary, setTargetDiary] = useState(null);
  const prevMonth = () => {
    setSelectedDate((prevDate) => {
      const prevMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      );
      return prevMonth;
    });
  };
  const nextMonth = () => {
    setSelectedDate((prevDate) => {
      const nextMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      );
      return nextMonth;
    });
  };

  useEffect(() => {
    async function getUserDiary(userUID: string) {
      const docSnap = await firebase.getUserDiary(userUID);
      setDiaryData(docSnap);
    }
    getUserDiary(userUID);
  }, []);

  return (
    <div className='calendar'>
      <CalendarHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        diaryData={diaryData}
        setIsDiaryOpen={setIsDiaryOpen}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        isDiaryOpen={isDiaryOpen}
        setDayDiary={setDayDiary}
        dayDairy={dayDairy}
      />
      <CalendarWeekdays />
      <CalendarDays
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        diaryData={diaryData}
        setIsDiaryOpen={setIsDiaryOpen}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        isDiaryOpen={isDiaryOpen}
        setDayDiary={setDayDiary}
        dayDairy={dayDairy}
        setTargetDiary={setTargetDiary}
      />
      {targetDiary !== null && (
        <Post
          targetDiary={targetDiary}
          setTargetDiary={setTargetDiary}
          setDiaryData={setDiaryData}
        />
      )}
    </div>
  );
}

function CalendarHeader({
  selectedDate,
  prevMonth,
  nextMonth,
}: Props): JSX.Element {
  const monthYear = selectedDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className='calendar__header'>
      <button className='calendar__button' onClick={prevMonth}>
        &lt;
      </button>
      <div className='calendar__month'>{monthYear}</div>
      <button className='calendar__button' onClick={nextMonth}>
        &gt;
      </button>
    </div>
  );
}

function CalendarWeekdays() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className='calendar__weekdays'>
      {weekdays.map((weekday) => (
        <div key={weekday} className='calendar__day--header'>
          {weekday}
        </div>
      ))}
    </div>
  );
}

function CalendarDays({
  selectedDate,
  setSelectedDate,
  diaryData,
  isDiaryOpen,
  setIsDiaryOpen,
  setDayDiary,
  setTargetDiary,
}: Props): JSX.Element {
  const startOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );

  const endOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  );
  const startWeekday = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const days: React.ReactNode[] = [];
  const clickedDiary = (day: Day | {}, i) => {
    console.log("click", diaryData[i]);
    if (day !== undefined) {
      setDayDiary(day);
      setTargetDiary && setTargetDiary(diaryData[i]);
    }
  };

  for (let i = 1; i <= startWeekday; i++) {
    days.push(
      <div key={`empty-${i}`} className='calendar__day calendar__day--empty' />
    );
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      i
    );
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // 將時間設定為 0
    const targetSeconds = Math.floor(targetDate.getTime() / 1000);

    const handleClick = () => {
      setSelectedDate(date);
    };
    days.push(
      <>
        <div
          key={`day-${i}`}
          className={`calendar__day ${isToday ? "calendar__day--today" : ""} ${
            isSelected ? "" : ""
          }`}
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          {i}
          <div className='flex flex-wrap gap-[4px]'>
            {diaryData.map((day, i) => {
              const daySeconds = day.time.seconds;
              if (
                targetSeconds <= daySeconds &&
                daySeconds < targetSeconds + 86400
              ) {
                return (
                  <button
                    onClick={() => clickedDiary(day, i)}
                    key={i}
                    className='w-4 h-4 rounded-full bg-amber-500 '
                  ></button>
                );
              }

              return null;
            })}
          </div>
        </div>
      </>
    );
  }

  return <div className='calendar__days'>{days}</div>;
}
export default Diary;
