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
  const wrapper = button.parentElement;
  const tooltip = document.getElementById(button.getAttribute('aria-describedby'));
  let pinned = false;
  let hovering = false;
  let focused = false;
  let dismissed = false;

  function updateTooltip() {
    tooltip.hidden = button.disabled || dismissed || !(pinned || hovering || focused);
  }

  function render(now = Date.now()) {
    const countdown = getCountdown(target, now);
    display.hidden = countdown.ended;
    ended.hidden = !countdown.ended;
    button.disabled = countdown.ended;
    updateTooltip();
    if (countdown.ended) return;

    tooltip.textContent = getUnits(countdown, true)
      .map(([label, value]) => `${value} ${label}`)
      .join(' · ');
    const units = getUnits(countdown, false);
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
    dismissed = false;
    updateTooltip();
  });
  wrapper.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') {
      hovering = true;
      dismissed = false;
      updateTooltip();
    }
  });
  wrapper.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') {
      hovering = false;
      updateTooltip();
    }
  });
  button.addEventListener('focus', () => {
    focused = button.matches(':focus-visible');
    dismissed = false;
    updateTooltip();
  });
  button.addEventListener('blur', () => {
    focused = false;
    pinned = false;
    updateTooltip();
  });
  button.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      pinned = false;
      dismissed = true;
      updateTooltip();
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(error => {
    console.error('Unable to enable offline access:', error);
  });
}
