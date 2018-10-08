/**
 * Utilities and helpers.
 */

const DIRECTION_NAMES = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

export function degreesToIndex (deg) {
  return Math.abs(Math.round((deg % 360 + (deg < 0 ? 360 : 0) - 11.25) / 22.5))
}

export function degreesToName (deg) {
  return DIRECTION_NAMES[degreesToIndex(deg)]
}
