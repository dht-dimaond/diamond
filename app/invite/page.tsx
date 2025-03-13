'use client'
import { useUser } from '@/context/UserContext' 
import ReferralSystem from '../components/ReferralSystem'

export default function Home() {
  const { initData, userData, isLoading, start_param, } = useUser()

    console.log('initData:', initData);
    console.log('userData:', userData);
    console.log('start_param:', start_param);

  if (isLoading) {
    return <div className='text-white-600'>Loading...</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center mt-8">
      <h1 className="text-4xl text-white font-bold mb-6">Refer A Friend</h1>
      <ReferralSystem initData={initData} userId={userData?.id.toString() || ''} startParam={start_param || ''} />
    </main>
  )
}