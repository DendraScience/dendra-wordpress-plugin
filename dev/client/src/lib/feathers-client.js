import feathers from '@feathersjs/feathers'
import superagent from 'superagent'
import rest from '@feathersjs/rest-client'

// import socketio from '@feathersjs/socketio-client'
// import io from 'socket.io-client'

// const socket = io('http://api.dendra.science', {
//   path: '/v1/socket.io'
//   // transports: ['websocket']
// })

// const feathersClient = feathers()
//   .configure(socketio(socket))

const feathersClient = feathers()

const restClient = rest('http://api.dendra.science/v1')

feathersClient.configure(restClient.superagent(superagent))

export default feathersClient
