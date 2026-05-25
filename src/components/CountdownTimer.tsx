import React, { useState, useEffect } from 'react'
import { NumberFlow } from './NumberFlow'

export default function CountdownTimer() {
  const targetDate = new Date("2026-06-11T19:30:00").getTime()
  const [difference, setDifference] = useState<number>(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setDifference(targetDate - Date.now())

    const interval = setInterval(() => {
      const diff = targetDate - Date.now()
      setDifference(diff)
      if (diff <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (difference <= 0 && isMounted) {
    return (
      <span className="col-span-4 font-label-caps text-hazard-orange text-lg animate-pulse uppercase tracking-widest">
        שידור פעיל / ההקרנה החלה
      </span>
    )
  }

  const days = difference > 0 ? Math.floor(difference / (1000 * 60 * 60 * 24)) : 0
  const hours = difference > 0 ? Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0
  const minutes = difference > 0 ? Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)) : 0
  const seconds = difference > 0 ? Math.floor((difference % (1000 * 60)) / 1000) : 0

  const pad = (num: number) => String(num).padStart(2, '0')

  return (
    <div className="grid grid-cols-4 gap-2 text-center" id="countdown-timer" dir="ltr">
      <div className="flex flex-col border-r border-outline-variant/30 pr-2">
        <span className="font-terminal-xs text-3xl text-primary font-bold tracking-tight drop-shadow-[0_0_8px_rgba(181,196,255,0.6)]">
          {isMounted ? (
            <NumberFlow value={days} minimumIntegerDigits={2} />
          ) : (
            <span>{pad(days)}</span>
          )}
        </span>
        <span className="font-terminal-xs text-[10px] text-on-surface-variant uppercase tracking-wider">ימים</span>
      </div>
      <div className="flex flex-col border-r border-outline-variant/30 px-2">
        <span className="font-terminal-xs text-3xl text-primary font-bold tracking-tight drop-shadow-[0_0_8px_rgba(181,196,255,0.6)]">
          {isMounted ? (
            <NumberFlow value={hours} minimumIntegerDigits={2} />
          ) : (
            <span>{pad(hours)}</span>
          )}
        </span>
        <span className="font-terminal-xs text-[10px] text-on-surface-variant uppercase tracking-wider">שעות</span>
      </div>
      <div className="flex flex-col border-r border-outline-variant/30 px-2">
        <span className="font-terminal-xs text-3xl text-primary font-bold tracking-tight drop-shadow-[0_0_8px_rgba(181,196,255,0.6)]">
          {isMounted ? (
            <NumberFlow value={minutes} minimumIntegerDigits={2} />
          ) : (
            <span>{pad(minutes)}</span>
          )}
        </span>
        <span className="font-terminal-xs text-[10px] text-on-surface-variant uppercase tracking-wider">דקות</span>
      </div>
      <div className="flex flex-col pl-2">
        <span className="font-terminal-xs text-3xl text-primary font-bold tracking-tight drop-shadow-[0_0_8px_rgba(181,196,255,0.6)]">
          {isMounted ? (
            <NumberFlow value={seconds} minimumIntegerDigits={2} />
          ) : (
            <span className="animate-[pulse_1s_ease-in-out_infinite]">{pad(seconds)}</span>
          )}
        </span>
        <span className="font-terminal-xs text-[10px] text-on-surface-variant uppercase tracking-wider">שניות</span>
      </div>
    </div>
  )
}
