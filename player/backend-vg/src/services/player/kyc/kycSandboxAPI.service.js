import axios from 'axios'
import ServiceBase from '../../serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class KycSandboxAPIService extends ServiceBase {
  async run () {
    const { applicantId, answer, rejectLabels } = this.args
    const options = {
      url: `https://api.sumsub.com/resources/applicants/${applicantId}/status/testCompleted`,
      method: 'POST',
      data: {
        reviewAnswer: answer,
        rejectLabels: rejectLabels
      }
    }

    await axios(options)

    return { success: SUCCESS_MSG.GET_SUCCESS }
  }
}
