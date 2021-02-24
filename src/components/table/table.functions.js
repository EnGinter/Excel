export function isCellLeftClick(event) {
  return event.target.dataset.id && event.button === 0
}

export function shouldResize(event) {
  return event.target.dataset.resize
}
