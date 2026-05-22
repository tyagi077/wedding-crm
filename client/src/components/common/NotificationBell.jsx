import { useEffect, useState } from 'react'

import socket from '../../services/socket'

const NotificationBell = () => {

  const [notifications, setNotifications] =
    useState([])

  useEffect(() => {

    socket.on('newNotification', (data) => {

      setNotifications((prev) => [
        data,
        ...prev,
      ])

    })

    return () => {

      socket.off('newNotification')

    }

  }, [])

  return (

    <button
      onClick={() =>
        window.location.href = '/notifications'
      }
      className='relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 transition'
    >

      {/* ICON */}

      <span className='text-2xl'>
        🔔
      </span>

      {/* COUNT */}

      {
        notifications.length > 0 && (

          <div className='absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow'>

            {notifications.length}

          </div>

        )
      }

    </button>

  )
}

export default NotificationBell