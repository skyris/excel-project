export function capitalize(string='') {
  if (typeof string !== 'string') {
    return ''
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const CODES = {
  A: 65,
  Z: 90,
}

export const filter = Array.prototype.filter

export function getMinAndMax(a, b) {
  return [Math.min(a, b), Math.max(a, b)]
}
