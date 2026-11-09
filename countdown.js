export function getCountdown(target, now = Date.now()) {
  const totalSeconds = Math.max(0, Math.ceil((target - now) / 1000));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalSeconds / 3600);

  return {
    ended: totalSeconds === 0,
    hours: totalHours,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
    days: Math.floor(totalHours / 24),
    dayHours: totalHours % 24
  };
}

export function getUnits(countdown, showDays) {
  return showDays
    ? [['days', countdown.days], ['hours', countdown.dayHours], ['minutes', countdown.minutes]]
    : [['hours', countdown.hours], ['minutes', countdown.minutes], ['seconds', countdown.seconds]];
}
