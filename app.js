import { getCountdown, getUnits } from './countdown.js';

const targets = {
  arrival: Date.parse('2026-12-07T10:00:00Z'),
  second: Date.parse('2026-12-10T10:00:00Z')
};

const timers = [...document.querySelectorAll('[data-countdown]')].map(button => {
  const target = targets[button.dataset.countdown];
  if (!Number.isFinite(target)) throw new Error('Unknown countdown target');
  const display = button.querySelector('[data-display]');
  const ended = button.querySelector('[data-ended]');
  let pinned = false;
  let hovering = false;

  function render(now = Date.now()) {
    const countdown = getCountdown(target, now);
    display.hidden = countdown.ended;
    ended.hidden = !countdown.ended;
    button.disabled = countdown.ended;
    if (countdown.ended) return;

    const showDays = pinned || hovering;
    const units = getUnits(countdown, showDays);
    display.replaceChildren(...units.map(([label, value], index) => {
      const part = document.createElement('span');
      part.className = 'timer-part';
      const number = document.createElement('span');
      number.className = 'timer-number';
      number.textContent = String(value).padStart(2, '0');
      const unit = document.createElement('span');
      unit.className = 'timer-unit';
      unit.textContent = label;
      part.append(number, unit);
      if (index < units.length - 1) {
        const separator = document.createElement('span');
        separator.className = 'timer-separator';
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = ':';
        part.append(separator);
      }
      return part;
    }));
  }

  button.addEventListener('click', () => {
    pinned = !pinned;
    button.setAttribute('aria-pressed', String(pinned));
    render();
  });
  button.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') {
      hovering = true;
      render();
    }
  });
  button.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') {
      hovering = false;
      render();
    }
  });
  return render;
});

function tick() {
  const now = Date.now();
  timers.forEach(render => render(now));
  setTimeout(tick, 1000 - (now % 1000));
}

tick();
