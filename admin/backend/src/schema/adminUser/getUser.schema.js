export const getUserSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
                emailVerified: { type: 'boolean' },
                phone: { type: 'string' },
                phoneVerified: { type: 'string' },
                password: { type: 'string' },
                parentAdminId: { type: 'string' },
                adminRoleId: { type: 'string' },
                isActive: { type: 'boolean' },
                siteLayout: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    isMobile: { type: 'boolean' },
                    leftMenu: { type: 'boolean' },
                    isLoading: { type: 'boolean' },
                    layoutType: { type: 'string' },
                    isPreloader: { type: 'boolean' },
                    layoutWidth: { type: 'string' },
                    showSidebar: { type: 'boolean' },
                    topbarTheme: { type: 'string' },
                    layoutModeType: { type: 'string' },
                    showBreadcrumb: { type: 'boolean' },
                    leftSideBarType: { type: 'string' },
                    leftSideBarTheme: { type: 'string' },
                    showRightSidebar: { type: 'boolean' },
                    leftSideBarThemeImage: { type: 'string' }
                  }
                },
                permission: { type: 'object' },
                adminRole: { type: 'object' }
              }
            }
          }
        },
        errors: { type: 'array' }
      }
    }
  }
}
