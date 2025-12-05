import { SOCKET_NAMESPACES, SOCKET_ROOMS } from '../../utils/constants/socket'

/**
 *
 *
 * @export
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(SOCKET_NAMESPACES.WINNER)

  namespace.on('connection', (socket) => {
    socket.join(SOCKET_ROOMS.LIVE_WINNERS)
  })
}
