import React, { useState } from 'react'
import { useEffect } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
} from 'date-fns'

import Reminders from '../components/Reminders'

const Calendar = () => {
  const [weeks, setWeeks] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState({
    day: new Date(),
    reminders: [],
  })
  const [selectedreminder, setSelectedReminder] = useState({})
  const [reminders, setReminders] = useState({})

  const getHeader = () => {
    const weekStartDate = startOfWeek(selectedMonth)
    const weekDays = []

    for (let day = 0; day < 7; day++) {
      weekDays.push(format(addDays(weekStartDate, day), 'eeee'))
    }

    return (
      <thead className='tableHeader'>
        <tr className='header'>
          {weekDays.map((day, index) => (
            <th key={index} className='weekNames'>
              {day}
            </th>
          ))}
        </tr>
      </thead>
    )
  }

  useEffect(() => {
    setReminders(JSON.parse(localStorage.getItem('reminders')))
  }, [])

  useEffect(() => {
    const monthWeeks = []
    const startOfTheSelectedMonth = startOfMonth(selectedMonth)
    const startDate = startOfWeek(startOfTheSelectedMonth)

    let accumulateDate = startDate
    for (let week = 0; week < 5; week++) {
      const week = []
      for (let day = 0; day < 7; day++) {
        const dateReminders = reminders && reminders[accumulateDate]
        dateReminders &&
          dateReminders.sort((a, b) => {
            const timeA = new Date(`01/01/1970 ${a.time}`).getTime()
            const timeB = new Date(`01/01/1970 ${b.time}`).getTime()

            return timeA - timeB
          })

        const dateObject = {
          day: accumulateDate,
          reminders: dateReminders ? dateReminders : [],
        }

        if (isSameDay(accumulateDate, selectedDate.day)) {
          setSelectedDate(dateObject)
          setSelectedReminder({})
        }
        week.push(dateObject)
        accumulateDate = addDays(accumulateDate, 1)
      }
      monthWeeks.push(week)
    }

    setWeeks(monthWeeks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, reminders])

  return (
    <>
      <div className='functions'>
        <div
          className='todayButton'
          onClick={() => {
            setSelectedDate({ day: new Date(), reminders: [] })
            setSelectedMonth(new Date())
          }}
        >
          Today
        </div>
        <AiOutlineLeft
          className='navIcon'
          onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
        />
        <AiOutlineRight
          className='navIcon'
          onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
        />
        <h2 className='currentMonth'>{format(selectedMonth, 'MMMM yyyy')}</h2>
      </div>
      <table className='calendar'>
        {getHeader()}
        <tbody className='dateContainer'>
          {weeks.map((week, index) => (
            <tr key={index} className='daysRow'>
              {week.map((date, index) => (
                <td
                  key={index}
                  className={`day
                  ${isSameMonth(date.day, selectedMonth) ? '' : 'inactiveDay'}
                  ${isSameDay(date.day, selectedDate.day) ? 'selectedDay' : ''}
                  ${isSameDay(date.day, new Date()) ? 'today' : ''}`}
                  onClick={() => {
                    setSelectedDate(date)
                    setSelectedReminder({})
                  }}
                >
                  {format(date.day, 'd')}
                  <ul className='reminderContainer'>
                    {date.reminders.map((reminder, index) => {
                      const string = `${reminder.time ? reminder.time : ''} - ${
                        reminder.title ? reminder.title : ''
                      }`
                      return (
                        <li
                          className='reminder'
                          key={index}
                          onClick={(event) => {
                            setSelectedDate(date)
                            setSelectedReminder(reminder)
                            event.stopPropagation()
                          }}
                        >
                          {string.slice(0, 18)}
                        </li>
                      )
                    })}
                  </ul>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Reminders
        selectedDate={selectedDate}
        selectedReminder={selectedreminder}
        setReminders={setReminders}
      />
    </>
  )
}

export default Calendar
