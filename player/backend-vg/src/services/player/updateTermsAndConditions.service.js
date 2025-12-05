import { SUCCESS_MSG } from "../../utils/constants/success";
import ServiceBase from "../serviceBase";


export class UpdateTermsAndConditions extends ServiceBase { 
 
    async run () {
        const {
            req: {
              user: { detail: user }
            },
            dbModels: { TermsAndConditions: TermsAndConditionsModel, User: UserModel },
            sequelizeTransaction: transaction
        } = this.context
    
        try 
        {
            const activeTerms = await TermsAndConditionsModel.findOne({
                where: { status: 'active' },
                attributes: ['id', 'description', 'link'],
                order: [['created_at', 'DESC']]
            })
      
            if (activeTerms) {
                const previousAccepted = user.moreDetails?.termsAndConditionsAccepted || []
            
                const newAcceptedEntry = {
                    id: activeTerms.id,
                    description: activeTerms.description,
                    link: activeTerms.link,
                    acceptedAt: new Date()
                }
            
                const updatedMoreDetails = {
                    ...(user.moreDetails || {}),
                    termsAndConditionsAccepted: [...previousAccepted, newAcceptedEntry]
                }
            
                await UserModel.update(
                    {
                    isTermsAccepted: true,
                    moreDetails: updatedMoreDetails
                    },
                    {
                    where: { userId: user.userId },
                    transaction
                    }
                )
            }
            return {
                success: true,
                message: SUCCESS_MSG.UPDATE_SUCCESS
            }
        } catch (error) {
          console.error('GetActiveTermsAndConditions error:', error)
          return this.addError('InternalServerErrorType', error.message || 'Failed to fetch active terms and conditions')
        }
    }
}