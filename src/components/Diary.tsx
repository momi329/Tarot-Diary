import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";

import "../Calander.css";
import { doc, getDoc } from "firebase/firestore";
import cards from "../tarotcard/tarot-images";
import { db } from "../utils/firebase";

import { collection, setDoc, Timestamp } from "firebase/firestore";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import firebase from "../utils/firebase";
interface Props {
  selectedDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  diaryData: [] | [Day];
  isDiaryOpen: boolean;
  setIsDiaryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDayDiary: React.Dispatch<React.SetStateAction<Day | {}>>;
  dayDairy: Day | {};
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
  const [diaryData, setDiaryData] = useState<[]>([]);
  const [isDiaryOpen, setIsDiaryOpen] = useState<boolean>(false);
  const [dayDairy, setDayDiary] = useState({});

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
      if (docSnap.exists()) {
        setDiaryData(docSnap.data().diary);
      } else {
        console.log("No such document!");
      }
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
      />
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
  const clickedDiary = (day: Day | {}) => {
    console.log("click", day);
    if (day !== undefined) {
      setDayDiary(day);
      setIsDiaryOpen(true);
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
            isSelected ? "calendar__day--selected" : ""
          }`}
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          {i}
          {diaryData.map((day: Day, i: number) => {
            const daySeconds = day.time.seconds;
            if (
              targetSeconds <= daySeconds &&
              daySeconds < targetSeconds + 86400
            ) {
              return (
                <>
                  <button onClick={() => clickedDiary(day)} key={i}>
                    <img
                      src={cards.cards[day.card].img}
                      alt={day.title}
                      className={`${day.reverse ? "" : "rotate-180"}`}
                    />
                    {day.title}
                  </button>
                  {isDiaryOpen && (
                    <div className='w-[600px]  bg-white border border-slate-500 fixed top-0 left-0 text-slate-800'>
                      <img
                        src={cards.cards[day.card].img}
                        alt={cards.cards[day.card].name}
                        className={`${day.reverse ? "" : "rotate-180"} w-10`}
                      />
                      <div>
                        <h1>{day.title}</h1>
                        <h5>{cards.cards[day.card].name}</h5>
                        <p>{day.content}</p>
                        <button onClick={() => setIsDiaryOpen(false)}>
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            }
            return null;
          })}
        </div>
      </>
    );
  }

  return <div className='calendar__days'>{days}</div>;
}
export default Diary;
