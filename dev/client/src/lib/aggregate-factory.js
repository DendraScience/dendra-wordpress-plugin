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
