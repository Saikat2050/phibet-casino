import adminNotificationNamespace from './adminNotification.namespace'
import leaderBoardNamespace from './leaderBoard.namespace'
import liveWinnerNamespace from './liveWinner.namespace'
import walletNamespace from './wallet.namespace'

export default function (io) {
  walletNamespace(io)
  liveWinnerNamespace(io)
  leaderBoardNamespace(io)
  adminNotificationNamespace(io)
}
