/**
 * Factory functions to create aggregate requests.
 */

import moment from 'moment'

export function avgByDayForMonth ({ datastreamId, time, timeCursor }) {
  return {
    method: 'rollupDatapoints',
    // Cache for 1 hour
    expires_at: moment().add(1, 'h').toISOString(),
    spec: {
      big_math: true,
      query: {
        datastream_id: datastreamId,
        time_local: true
      },
      rollups: [
        {
          aggregations: [
            {
              field: 'v',
              func: 'avg'
            }
          ],
          window: '1_d'
        }
      ],
      shift: 'so_d',
      // Default is 10 minute data
      time_cursor: timeCursor || '12_d',
      time_gte: time.clone().startOf('M').toISOString(),
      time_lt: time.clone().startOf('M').add(1, 'M').toISOString()
    }
  }
}

export function sumByDayForMonth ({ datastreamId, time, timeCursor }) {
  return {
    method: 'rollupDatapoints',
    // Cache for 1 hour
    expires_at: moment().add(1, 'h').toISOString(),
    spec: {
      big_math: true,
      query: {
        datastream_id: datastreamId,
        time_local: true
      },
      rollups: [
        {
          aggregations: [
            {
              field: 'v',
              func: 'sum'
            }
          ],
          window: '1_d'
        }
      ],
      shift: 'so_d',
      // Default is 10 minute data
      time_cursor: timeCursor || '12_d',
      time_gte: time.clone().startOf('M').toISOString(),
      time_lt: time.clone().startOf('M').add(1, 'M').toISOString()
    }
  }
}

// Identical to station dashboard request
export function currYTDPrecip ({ datastreamId, offsetEdit, timeCursor }) {
  return {
    method: 'rollupDatapoints',
    build_every: '1_d',
    // Stop rebuilding after 7 days
    expires_at: moment().add(7, 'd').toISOString(),
    spec: {
      big_math: true,
      query: {
        datastream_id: datastreamId,
        time_local: true
      },
      rollups: [
        {
          aggregations: [
            {
              alias: 'v_sum',
              field: 'v',
              func: 'sum'
            }
          ],
          window: '1_d'
        }
      ],
      shift: 'so_M,su_9_M,so_y,ad_9_M',
      // Default is 10 minute data
      time_cursor: timeCursor || '12_d',
      time_gte: `${offsetEdit},so_M,su_9_M,so_y,ad_9_M`,
      time_lt: `${offsetEdit},so_d,ad_1_d`
    }
  }
}

// Identical to station dashboard request
export function twoDayPrecip ({ datastreamId, offsetEdit, timeCursor }) {
  return {
    method: 'rollupDatapoints',
    build_every: '1_h',
    // Stop rebuilding after 7 days
    expires_at: moment().add(7, 'd').toISOString(),
    spec: {
      big_math: true,
      query: {
        datastream_id: datastreamId,
        time_local: true
      },
      rollups: [
        {
          aggregations: [
            {
              alias: 'v_sum',
              field: 'v',
              func: 'sum'
            }
          ],
          window: '1_d'
        }
      ],
      // Default is 10 minute data
      time_cursor: timeCursor || '12_d',
      time_gte: `${offsetEdit},so_d,su_1_d`,
      time_lt: `${offsetEdit},so_d,ad_1_d`
    }
  }
}
