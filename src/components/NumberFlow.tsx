import { motion, type Transition } from 'framer-motion'
import React, { useMemo } from 'react'

import { Flex, Span } from './base'

/** Mirrors common “number flow” demos (e.g. Skiper Number flow): each digit sits in a masked column and springs vertically to the next digit. */
export type NumberFlowFormat = 'number' | 'currency' | 'percentage' | 'decimal'

const defaultSpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 38,
  mass: 0.85,
}

function intlOptionsForFormat(
  format: NumberFlowFormat,
  currency: string,
  minimumFractionDigits: number | undefined,
  maximumFractionDigits: number | undefined,
  minimumIntegerDigits?: number
): Intl.NumberFormatOptions {
  const base: Intl.NumberFormatOptions = {
    minimumIntegerDigits: minimumIntegerDigits ?? 1,
  }

  switch (format) {
    case 'currency':
      return {
        ...base,
        style: 'currency',
        currency,
        minimumFractionDigits: minimumFractionDigits ?? 2,
        maximumFractionDigits: maximumFractionDigits ?? 2,
      }
    case 'percentage':
      return {
        ...base,
        style: 'percent',
        minimumFractionDigits: minimumFractionDigits ?? 0,
        maximumFractionDigits: maximumFractionDigits ?? 2,
      }
    case 'decimal':
      return {
        ...base,
        style: 'decimal',
        useGrouping: true,
        minimumFractionDigits: minimumFractionDigits ?? 2,
        maximumFractionDigits: maximumFractionDigits ?? 2,
      }
    case 'number':
    default:
      return {
        ...base,
        style: 'decimal',
        useGrouping: true,
        minimumFractionDigits: minimumFractionDigits ?? 0,
        maximumFractionDigits: maximumFractionDigits ?? 20,
      }
  }
}

type DigitRollerProps = {
  digit: number
  transition?: Transition
}

function DigitRoller({ digit, transition }: DigitRollerProps) {
  const d = digit >= 0 && digit <= 9 ? digit : 0
  return (
    <Span
      css={{
        display: 'inline-block',
        height: '1em',
        overflow: 'hidden',
        verticalAlign: 'baseline',
      }}
    >
      <motion.span
        animate={{ y: `${-d}em` }}
        transition={transition ?? defaultSpring}
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: '1em',
        }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <Span
            key={n}
            css={{
              height: '1em',
              lineHeight: '1em',
              display: 'block',
            }}
          >
            {n}
          </Span>
        ))}
      </motion.span>
    </Span>
  )
}

export type NumberFlowProps = {
  value: number
  format?: NumberFlowFormat
  /** BCP 47 language tag, passed to `Intl.NumberFormat`. */
  locale?: string
  currency?: string
  prefix?: string
  suffix?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  minimumIntegerDigits?: number
  className?: string
  transition?: Transition
}

/**
 * Animated number display: locale-aware formatting via `Intl`, static symbols,
 * and per-digit vertical “odometer” motion similar in spirit to Skiper Number flow.
 */
export function NumberFlow({
  value,
  format = 'number',
  locale = 'en-US',
  currency = 'USD',
  prefix,
  suffix,
  minimumFractionDigits,
  maximumFractionDigits,
  minimumIntegerDigits,
  className,
  transition,
}: NumberFlowProps) {
  const intlOptions = useMemo(
    () =>
      intlOptionsForFormat(
        format,
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
        minimumIntegerDigits
      ),
    [format, currency, minimumFractionDigits, maximumFractionDigits, minimumIntegerDigits]
  )

  const body = useMemo(() => {
    if (!Number.isFinite(value)) {
      return <Span>{String(value)}</Span>
    }

    const formatter = new Intl.NumberFormat(locale, intlOptions)
    const parts = formatter.formatToParts(value)
    const out: React.ReactNode[] = []
    let k = 0

    for (const part of parts) {
      if (part.type === 'integer' || part.type === 'fraction') {
        for (const ch of part.value) {
          if (ch >= '0' && ch <= '9') {
            out.push(
              <DigitRoller
                key={`d-${k++}`}
                digit={Number(ch)}
                transition={transition}
              />
            )
          } else {
            out.push(
              <Span key={`s-${k++}`} css={{ display: 'inline-block' }}>
                {ch}
              </Span>
            )
          }
        }
      } else {
        out.push(
          <Span
            key={`p-${k++}`}
            css={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {part.value}
          </Span>
        )
      }
    }

    return out
  }, [value, locale, intlOptions, transition])

  return (
    <Flex
      className={className}
      css={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {prefix ? (
        <Span css={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {prefix}
        </Span>
      ) : null}
      {body}
      {suffix ? (
        <Span css={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {suffix}
        </Span>
      ) : null}
    </Flex>
  )
}
