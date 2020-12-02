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

export const TABLE = {
  minWidth: 0,
  maxWidth: 26,
  minHeight: 0,
  maxHeight: 100,
}

export function getMinAndMax(a, b) {
  return [Math.min(a, b), Math.max(a, b)]
}

export function range(start, end) {
  if (start > end) {
    [start, end] = [end, start]
  }
  const ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i);
  }

  return ans;
}
