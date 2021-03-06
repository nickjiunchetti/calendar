import Head from 'next/head'
import Calendar from '../src/components/Calendar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Calendar</title>
        <meta name='description' content='Generated by create next app' />
      </Head>

      <main className='container'>
        <h1>Calendar</h1>
        <Calendar />
      </main>
    </div>
  )
}
