import { JOB_OPTIMOVE_DATA, optimoveQueue } from '@src/queues/optimove.queue'
import { ServiceBase } from '@src/libs/serviceBase'

export class CreateOptimoveJobService extends ServiceBase {
  async run () {
    const {
      sendFiles = true,
      filesSuffix,
      startDate,
      endDate
    } = this.args

    const response = await this.getDates(startDate, endDate)

    if (!response.success) return response

    await Promise.all(response.dateRanges.map(({ startDate, endDate }) => {
      return optimoveQueue.add(
        JOB_OPTIMOVE_DATA,
        {
          sendFiles,
          filesSuffix,
          start: startDate,
          end: endDate,
          fileType: this.args.fileType
        },
        {
          priority: 1
        }
      )
    }))

    return {
      success: true,
      message: 'Jobs added successfully.'
    }
  }

  async getDates (startDate, endDate) {
    let start = new Date(startDate)
    const end = new Date(endDate)

    // Check if the dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return { success: false, message: 'Date format is wrong!!!' }

    // Check if the start date is before the end date
    if (start > end) return { success: false, message: 'Start date must be before end date!!!' }

    const dateRanges = []

    while (start <= end) {
      const startDateString = start.toISOString().split('T')[0] + 'T00:00:00+00:00'
      const endDateString = start.toISOString().split('T')[0] + 'T23:59:59.999+00:00'

      dateRanges.push({
        startDate: startDateString,
        endDate: endDateString
      })

      start = new Date(start.setDate(start.getDate() + 1))
    }

    return { success: true, dateRanges }
  }
}
