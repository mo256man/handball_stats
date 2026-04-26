import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from "date-fns/locale";
import { format } from "date-fns";
import "./Calendar.css";

// 汎用カレンダーコンポーネント
// props:
// - value: string (YYYY-MM-DD)
// - onChange: (newValue: string) => void
// - showTodayButtonInHeader: boolean
export default function Calendar({ value, onChange, showTodayButtonInHeader = true, highlightedDates = [], onlyHighlightSelectable = false, calendarClassName }) {
  const datePickerRef = useRef(null);

  const parseDate = (str) => {
    if (!str) return null;
    const d = new Date(str);
    if (isNaN(d)) return null;
    return d;
  };

  const formatDateSv = (d) => {
    return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  };

  const handleToday = () => {
    const today = new Date();
    const formatted = formatDateSv(today);
    onChange(formatted);
    if (datePickerRef.current && typeof datePickerRef.current.setOpen === "function") {
      datePickerRef.current.setOpen(false);
    }
  };

  const highlightedSet = new Set(highlightedDates.map(d => {
    try { return new Date(d).toLocaleDateString("sv-SE"); } catch (_) { return d; }
  }));

  const dayClassName = (date) => {
    const dateStr = date.toLocaleDateString("sv-SE");
    const today = new Date().toLocaleDateString("sv-SE");
    
    // 試合がある日付を最優先
    if (highlightedSet.has(dateStr)) {
      return "highlighted-date";
    }
    
    // 別の月の today には特別なクラスを付ける
    const currentDate = parseDate(value);
    const isCurrentMonth = currentDate && 
      date.getFullYear() === currentDate.getFullYear() && 
      date.getMonth() === currentDate.getMonth();
    
    if (!isCurrentMonth && dateStr === today) {
      return "hide-outside-today";
    }
    
    return undefined;
  };

  const filterDate = onlyHighlightSelectable
    ? (date) => highlightedSet.has(date.toLocaleDateString("sv-SE"))
    : undefined;

  return (
    <DatePicker
      ref={datePickerRef}
      selected={parseDate(value)}
      onChange={(selectedDate) => {
        if (!selectedDate) return;
        onChange(formatDateSv(selectedDate));
      }}
      dateFormat="yyyy-MM-dd"
      locale={ja}
      inline
      renderCustomHeader={
        showTodayButtonInHeader
          ? ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
              <div className="react-datepicker__header-month-nav">
                <button type="button" className="month-nav-button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                  ＜
                </button>
                <div className="react-datepicker__header-month-text">{format(date, 'yyyy年M月', { locale: ja })}</div>
                <button type="button" className="month-nav-button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                  ＞
                </button>
              </div>
            )
          : undefined
      }
      calendarClassName={calendarClassName}
      dayClassName={dayClassName}
      filterDate={filterDate}
    />
  );
}
