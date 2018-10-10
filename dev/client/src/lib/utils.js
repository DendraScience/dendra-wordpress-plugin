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

export class SeqQueue {
  constructor () {
    this.interval = 100
  }

  async _run () {
    const task = this.queue && this.queue.shift()

    if (task) {
      try {
        task.resolve(await task.fn(...task.args))
      } catch (err) {
        task.reject(err)
      }

      task.fn = task.args = task.resolve = task.reject = null
    }

    if (this.queue.length) {
      this._next()
    } else {
      this.queue = null
    }
  }

  _next () {
    setTimeout(() => this._run(), this.interval)
  }

  push (fn, args = []) {
    return new Promise((resolve, reject) => {
      if (this.queue) {
        this.queue.push({ fn, args, resolve, reject })
      } else {
        this.queue = [{ fn, args, resolve, reject }]
        this._next()
      }
    })
  }
}
