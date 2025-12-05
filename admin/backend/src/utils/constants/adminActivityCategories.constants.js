export const allCategories = [
  'Admin',

  'User',

  'Casino',

  'Bonus',

  'Content',

  'Setting'
]

export const categoriesTableMapping = {
  Admin: [
    'admin_roles', 'admin_users'
  ],
  User: [
    'users', 'addresses', 'user_comments', 'user_tags', 'favorite_games',
    'user_limits', 'user_notification', 'user_vip_tiers',
    'user_activity', 'user_bonus', 'user_tournaments', 'user_chat_groups', 'segment'
  ],
  Casino: ['casino_games', 'casino_categories', 'casino_game_categories', 'casino_providers', 'casino_aggregators'],
  Bonus: ['bonus'],
  Content: ['banners', 'pages', 'tags'],
  Setting: ['settings', 'wheel_devision_configurations', 'states', 'packages', 'vip_tiers']
}

export const tableCategoriesMapping = {
  admin_roles: 'Admin',
  admin_users: 'Admin',

  users: 'User',
  addresses: 'User',
  user_comments: 'User',
  user_tags: 'User',
  favorite_games: 'User',
  user_limits: 'User',
  user_notification: 'User',
  user_vip_tiers: 'User',
  user_activity: 'User',
  user_bonus: 'User',
  user_tournaments: 'User',
  user_chat_groups: 'User',
  segment: 'User',
  
  casino_games: 'Casino',
  casino_categories: 'Casino',
  casino_game_categories: 'Casino',
  casino_providers: 'Casino',
  casino_aggregators: 'Casino',
  segmentation: 'Casino',

  bonus: 'Bonus',
  bonus_currencies: 'Bonus',

  banners: 'Content',
  pages: 'Content',
  tags: 'Content',

  settings: 'Setting',
  wheel_devision_configurations: 'Setting',
  states: 'Setting',
  packages: 'Setting',
  vip_tiers: 'Setting'
}
