import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

import { format } from 'date-fns'

import { getCities, getCityWeather } from '../api/WeatherApi'

export default function Reminder({
  selectedDate,
  selectedReminder,
  setReminders,
}) {
  const [currentTime, setCurrentTime] = useState(selectedReminder.time)
  const [currentCity, setCurrentCity] = useState(selectedReminder.city)
  const [currentTitle, setCurrentTitle] = useState(selectedReminder.title)
  const [currentDescription, setCurrentDescription] = useState(
    selectedReminder.description
  )
  const [cities, setCities] = useState([])
  const isEditing = selectedReminder?.id
  const [remindersData, setRemindersData] = useState([])

  useEffect(() => {
    setCurrentTime(selectedReminder.time)
    setCurrentCity(selectedReminder.city)
    setCurrentTitle(selectedReminder.title)
    setCurrentDescription(selectedReminder.description)
  }, [selectedReminder])

  const addReminder = () => {
    const newReminder = {
      id: selectedDate.day + currentTime,
      time: currentTime,
      city: currentCity,

      title: currentTitle,
      description: currentDescription,
    }

    const reminders = JSON.parse(localStorage.getItem('reminders'))
    const selectedDateReminders = reminders && reminders[selectedDate.day]

    let data
    if (reminders) {
      data = selectedDateReminders
        ? {
            ...reminders,
            [selectedDate.day]: [...selectedDateReminders, newReminder],
          }
        : { ...reminders, [selectedDate.day]: [newReminder] }
    } else {
      data = { [selectedDate.day]: [newReminder] }
    }

    setReminders(data)
    localStorage.setItem('reminders', JSON.stringify(data))
  }

  const deleteReminder = (id) => {
    const reminders = JSON.parse(localStorage.getItem('reminders'))
    const selectedDateReminders = reminders[selectedDate.day]

    const filteredData = selectedDateReminders.filter((reminder) => {
      return reminder.id !== id
    })

    reminders[selectedDate.day] = filteredData

    setReminders(reminders)
    localStorage.setItem('reminders', JSON.stringify(reminders))
  }

  const editReminder = () => {
    const newReminderData = {
      id: selectedDate.day + currentTime,
      time: currentTime,
      city: currentCity,
      title: currentTitle,
      description: currentDescription,
    }

    const reminders = JSON.parse(localStorage.getItem('reminders'))

    const editIndex = reminders[selectedDate.day].findIndex(
      (reminder) => reminder.id === selectedReminder.id
    )

    reminders[selectedDate.day][editIndex] = newReminderData

    setReminders(reminders)
    localStorage.setItem('reminders', JSON.stringify(reminders))
  }

  const searchCities = async (text) => {
    try {
      const searchCities = await getCities(text)
      if (searchCities?.data) {
        setCities(searchCities.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const searchCityWeather = async (city) => {
    const day = selectedDate.day
    const date = day.getFullYear() + '-' + day.getMonth() + '-' + day.getDate()
    if (city && date) {
      try {
        const weather = await getCityWeather(city, date)
        return weather?.data ? weather.data.days[0].conditions : ''
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    ;(async () => {
      const reminders = await Promise.all(
        selectedDate.reminders.map(async (reminder) => {
          const conditions = await searchCityWeather(reminder?.city)
          return { ...reminder, conditions }
        })
      )
      setRemindersData(reminders)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  return (
    <div className='flex mt-20'>
      <section className='w-full'>
        <h3>Day {format(selectedDate.day, 'd')} Reminders</h3>
        {remindersData.map((reminder, index) => {
          return (
            <div key={index} className='card'>
              <div className='flex'>
                <p className='w-full'>
                  {reminder?.time}
                  {reminder?.city && ' - ' + reminder.city}
                  {reminder?.conditions && ' - ' + reminder.conditions}
                </p>
                <AiOutlineClose
                  className='closeIcon'
                  onClick={() => deleteReminder(reminder.id)}
                />
              </div>
              <h4>{reminder?.title}</h4>
              <p>{reminder?.description}</p>
            </div>
          )
        })}
      </section>
      <section className='w-full'>
        <h3>{isEditing ? 'Edit' : 'Add'} a Reminder</h3>
        <form>
          <div className='flex'>
            <div>
              <label className='label' htmlFor='time'>
                Enter the time
              </label>
              <input
                type='text'
                name='time'
                id='time'
                placeholder='hh:mm'
                value={currentTime || ''}
                onChange={(event) => setCurrentTime(event.target.value)}
              />
            </div>
            <div className='relative'>
              <label className='label' htmlFor='city'>
                Enter the city
              </label>
              <input
                name='city'
                id='city'
                onChange={(event) => {
                  searchCities(event.target.value)
                  setCurrentCity(event.target.value)
                }}
                value={currentCity || ''}
              />
              <div className='dropdown-container'>
                {!!cities.length &&
                  cities.map((city, index) => (
                    <div
                      onClick={() => {
                        setCurrentCity(city.AdministrativeArea.EnglishName)
                        setCities([])
                      }}
                      key={index}
                      className='dropdown-content'
                    >
                      {city?.AdministrativeArea.EnglishName}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className='flex'>
            <div>
              <label className='label' htmlFor='title'>
                Enter the title
              </label>
              <input
                type='text'
                name='title'
                id='title'
                value={currentTitle || ''}
                onChange={(event) => setCurrentTitle(event.target.value)}
              />
            </div>
            <div>
              <label className='label' htmlFor='description'>
                Enter the description
              </label>
              <input
                type='text'
                name='description'
                id='description'
                value={currentDescription || ''}
                onChange={(event) => setCurrentDescription(event.target.value)}
              />
            </div>
          </div>
          <button
            onClick={(event) => {
              event.preventDefault()
              isEditing ? editReminder() : addReminder()
            }}
          >
            {isEditing ? 'Edit' : 'Add'} Reminder
          </button>
        </form>
      </section>
    </div>
  )
}
