const CSTIMER_TRIM_PERCENT = 5;

const getCstimerTrimCount = (n) => {
  if (n <= 0) return 0;

  const trim = Math.ceil(n * CSTIMER_TRIM_PERCENT / 100);
  return trim * 2 >= n ? Math.max(0, trim - 1) : trim;
}

export const cstimerAverage = (times, n) => {
  if (n <= 0) return 0;
  if (times.length < n) return 0;

  const sortedTimes = times
      .slice(-n)
      .map(s => s.ms)
      .sort((a, b) => a - b);

  const trim = getCstimerTrimCount(n);
  const trimmedTimes = sortedTimes.slice(trim, n - trim);
  if (trimmedTimes.length === 0) return 0;

  const total = trimmedTimes.reduce((sum, ms) => sum + ms, 0);

  return total / trimmedTimes.length;
}
