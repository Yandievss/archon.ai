import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

function replaceQueryParam(key: string, nextValue: string | null) {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const currentValue = url.searchParams.get(key)

  if (nextValue === null || nextValue === '') {
    if (currentValue === null) return
    url.searchParams.delete(key)
  } else {
    if (currentValue === nextValue) return
    url.searchParams.set(key, nextValue)
  }

  window.history.replaceState({}, '', url.toString())
}

export function useDashboardQueryEnum<const T extends string>(
  key: string,
  defaultValue: T,
  allowedValues: readonly T[]
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = new URLSearchParams(window.location.search).get(key)
    if (!raw) return

    const nextValue = allowedValues.includes(raw as T) ? (raw as T) : defaultValue
    if (nextValue === value) return

    const id = requestAnimationFrame(() => setValue(nextValue))
    return () => cancelAnimationFrame(id)
  }, [allowedValues, defaultValue, key, value])

  useEffect(() => {
    if (value === defaultValue) {
      replaceQueryParam(key, null)
      return
    }
    replaceQueryParam(key, value)
  }, [defaultValue, key, value])

  return [value, setValue]
}

export function useDashboardQueryText(
  key: string,
  defaultValue = ''
): [string, Dispatch<SetStateAction<string>>] {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = new URLSearchParams(window.location.search).get(key)
    if (raw == null) return
    if (raw === value) return

    const id = requestAnimationFrame(() => setValue(raw))
    return () => cancelAnimationFrame(id)
  }, [key, value])

  useEffect(() => {
    if (value === defaultValue) {
      replaceQueryParam(key, null)
      return
    }
    replaceQueryParam(key, value)
  }, [defaultValue, key, value])

  return [value, setValue]
}

export function useDashboardQueryNumber(
  key: string,
  defaultValue: number,
  options?: { min?: number; max?: number }
): [number, Dispatch<SetStateAction<number>>] {
  const [value, setValue] = useState(defaultValue)
  const min = options?.min ?? Number.MIN_SAFE_INTEGER
  const max = options?.max ?? Number.MAX_SAFE_INTEGER

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = new URLSearchParams(window.location.search).get(key)
    if (raw == null) return

    const parsed = Number.parseInt(raw, 10)
    if (!Number.isFinite(parsed)) return

    const clamped = Math.max(min, Math.min(max, parsed))
    if (clamped === value) return

    const id = requestAnimationFrame(() => setValue(clamped))
    return () => cancelAnimationFrame(id)
  }, [key, max, min, value])

  useEffect(() => {
    if (value === defaultValue) {
      replaceQueryParam(key, null)
      return
    }
    replaceQueryParam(key, String(value))
  }, [defaultValue, key, value])

  return [value, setValue]
}
