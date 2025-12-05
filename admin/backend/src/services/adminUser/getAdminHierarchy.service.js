import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    searchString: { type: 'string' },
    parentAdminId: { type: 'string' },
    isActive: { type: 'boolean' },
    order: { enum: ['asc', 'desc'] },
    associations: { type: 'boolean', default: false },
    orderBy: { enum: ['id', 'name', 'role', 'status', 'email', 'createdAt'] },
    page: { type: 'number', minimum: 1 },
    perPage: { type: 'number', minimum: 1, maximum: 100 }
  },
  required: ['adminUserId']
})

export class GetAdminHierarchyService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const order = this.args.order
    const page = this.args.page
    const orderBy = this.args.orderBy
    const perPage = this.args.perPage
    const isActive = this.args.isActive
    const searchString = this.args.searchString
    const parentAdminId = this.args.parentAdminId

    try {
      let where = ''
      if (searchString) {
        const finalString = `%${searchString}%`
        where += `WHERE (ah."firstName" || ' ' || ah."lastName" ILIKE '${finalString}' OR ah."email" ILIKE '${finalString}' OR ah."username" ILIKE '${finalString}' OR ah."phone" ILIKE '${finalString}') `
      }
      if (_.isBoolean(isActive)) where += `${where === '' ? 'WHERE' : 'AND '} ah."isActive" = ${isActive} `
      if (parentAdminId) where += `${where === '' ? 'WHERE' : 'AND '} ah."parentAdminId = ${parentAdminId} `

      const orderCheck = (order && orderBy) ? orderBy === 'name' ? `order by ah."firstName" || ah."lastName" ${order}` : `order by ah."${orderBy}" ${order}` : ''
      const limitCheck = (page && perPage) ? `limit ${perPage} offset ${(page - 1) * perPage}` : ''

      const adminHierarchy = await this.findAll(where, limitCheck, orderCheck, this.args.associations)
      const adminCount = limitCheck === '' ? adminHierarchy.length : await this.countAll(where)

      return {
        rows: adminHierarchy.map(admin => {
          const finalObject = {}
          const topLevelKeys = Object.keys(admin)
          for (const topLevelKey of topLevelKeys) {
            const [parentKey, childKey] = topLevelKey.split('.')
            if (!admin[topLevelKey]) continue
            if (!childKey) finalObject[parentKey] = admin[parentKey]
            else {
              if (!finalObject[parentKey]) finalObject[parentKey] = { [childKey]: admin[topLevelKey] }
              else finalObject[parentKey][childKey] = admin[topLevelKey]
            }
          }
          return finalObject
        }),
        count: adminCount
      }
    } catch (error) {
      throw new APIError(error)
    }
  }

  /**
   * @param {string} where
   * @returns {number}
   */
  async countAll (where) {
    const adminCount = (await this.context.sequelize.query(`WITH RECURSIVE AdminHierarchy AS (
      SELECT
        id,
        email,
        phone,
        username,
        last_name AS "lastName",
        first_name AS "firstName",
        email_verified AS "emailVerified",
        email_verified AS "emailVerified",
        parent_admin_id AS "parentAdminId",
        is_active AS "isActive",
        admin_role_id AS "adminRoleId"
      FROM admin_users WHERE id = ${this.args.adminUserId}
      UNION
      SELECT
        au.id,
        au.email,
        au.phone,
        au.username,
        au.last_name AS "lastName",
        au.first_name AS "firstName",
        au.email_verified AS "emailVerified",
        au.email_verified AS "emailVerified",
        au.parent_admin_id AS "parentAdminId",
        au.is_active AS "isActive",
        au.admin_role_id AS "adminRoleId"
      FROM admin_users au
      INNER JOIN AdminHierarchy h ON au.parent_admin_id = h.id
    ) SELECT COUNT(*) FROM AdminHierarchy AS ah ${where};`))[0][0].count
    return adminCount
  }

  /**
   * @param {string} where
   * @param {string} limitCheck
   * @param {string} orderCheck
   * @param {boolean} associations
   * @returns {Array}
   */
  async findAll (where, limitCheck, orderCheck, associations) {
    const select = associations
      ? 'SELECT ah.*, p.id as "permission.id", p.admin_user_id as "permission.adminUserId", p.permission as "permission.permission", ar.id as "adminRole.id", ar.name as "adminRole.name", ar.level as "adminRole.level" FROM AdminHierarchy AS ah JOIN permissions AS p ON p.admin_user_id=ah.id LEFT JOIN admin_roles AS ar ON ar.id = ah."adminRoleId"'
      : 'SELECT * FROM AdminHierarchy AS ah'
    const adminHierarchy = (await this.context.sequelize.query(`WITH RECURSIVE AdminHierarchy AS (
      SELECT
        id,
        email,
        phone,
        username,
        last_name AS "lastName",
        first_name AS "firstName",
        email_verified AS "emailVerified",
        email_verified AS "emailVerified",
        parent_admin_id AS "parentAdminId",
        is_active AS "isActive",
        admin_role_id AS "adminRoleId",
        created_at AS "createdAt"
      FROM admin_users WHERE id = ${this.args.adminUserId}
      UNION
      SELECT
        au.id,
        au.email,
        au.phone,
        au.username,
        au.last_name AS "lastName",
        au.first_name AS "firstName",
        au.email_verified AS "emailVerified",
        au.email_verified AS "emailVerified",
        au.parent_admin_id AS "parentAdminId",
        au.is_active AS "isActive",
        au.admin_role_id AS "adminRoleId",
        au.created_at AS "createdAt"
      FROM admin_users au
      INNER JOIN AdminHierarchy h ON au.parent_admin_id = h.id
    ) ${select} ${where} ${orderCheck} ${limitCheck};`
    ))[0]

    return adminHierarchy
  }
}
