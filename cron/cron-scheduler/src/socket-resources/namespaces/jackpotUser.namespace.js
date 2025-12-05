import { NAMESPACES, ROOMS } from '@src/utils/constants/socket.constants'

/**
 *
 *
 * @export
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(NAMESPACES.JACKPOT_USER)

  namespace.on('connection', (socket) => {
    socket.join(ROOMS.PUBLIC.JACKPOT)
  })
}
