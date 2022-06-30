import { act, render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import * as api from '../api/WeatherApi'
import Calendar from './Calendar'

const weather = jest.spyOn(api, 'getCityWeather')

test('Add Reminder to calendar', async () => {
  weather.mockResolvedValue({ data: { days: [{ conditions: 'Rain' }] } })

  render(<Calendar />)

  const inputs = screen.getAllByRole('textbox')
  // time / city / title / description

  fireEvent.change(inputs[0], { target: { value: '11:11' } })
  fireEvent.change(inputs[1], { target: { value: 'New York' } })
  fireEvent.change(inputs[2], { target: { value: 'Test' } })
  fireEvent.change(inputs[3], { target: { value: 'Test Description' } })

  const addButton = screen.getByText('Add Reminder')
  await act(async () => {
    fireEvent.click(addButton)
  })

  expect(screen.getByText('11:11 - New York - Rain')).toBeInTheDocument()
  expect(screen.getByText('Test')).toBeInTheDocument()
  expect(screen.getByText('Test Description')).toBeInTheDocument()
})
