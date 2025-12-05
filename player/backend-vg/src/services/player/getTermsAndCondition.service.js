import ServiceBase from "../serviceBase"


export class GetActiveTermsAndConditions extends ServiceBase {
  async run () {
    const {
      dbModels: { TermsAndConditions: TermsAndConditionsModel }
    } = this.context

    try {
      const activeTerms = await TermsAndConditionsModel.findOne({
        where: { status: 'active' },
        attributes: ['description', 'link', 'id', 'createdAt']
      })

      return {
        success: true,
        data: activeTerms
      }
    } catch (error) {
      console.error('GetActiveTermsAndConditions error:', error)
      return this.addError('InternalServerErrorType', error.message || 'Failed to fetch active terms and conditions')
    }
  }
}
