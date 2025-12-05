export const adminActivitiesSchema = {
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        adminActivities: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    adminUserId: { type: ['string', 'null'] },
                                    entityId: { type: 'string' },
                                    entityType: { type: 'string' },
                                    action: { type: 'string' },
                                    changeTableId: { type: 'string' },
                                    changeTableName: { type: 'string' },
                                    previousData: { type: 'object' },
                                    modifiedData: { type: 'object' },
                                    service: { type: 'string' },
                                    category: { type: 'string' },
                                    moreDetails: { type: ['object', 'null'] },
                                    createdAt: { type: 'string' },
                                    updatedAt: { type: 'string' }
                                }
                            }
                        },
                        page: { type: 'number' },
                        totalPages: { type: 'number' }
                    }
                },
                errors: { type: 'array' }
            }
        }
    }
}
