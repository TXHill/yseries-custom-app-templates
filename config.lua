Config = {}

Config.AppKey = 'news-app'
Config.PhoneResourceName = 'yseries'

-- Framework Detection (Auto-detects by default)
Config.Framework = 'auto' -- Options: 'qb-core', 'es_extended', 'qbox', 'standalone'

-- Language Settings
Config.Language = 'en'

-- Job Configuration
Config.JobName = 'reporter'
Config.Permissions = {
    create = 0,  -- Minimum grade to create articles
    edit = 1,    -- Minimum grade to edit articles
    delete = 2   -- Minimum grade to delete articles
}

-- Logging Configuration
Config.Logs = {
    Enabled = true,
    Service = 'ox_lib' -- Options: 'fivemanage', 'ox_lib', 'discord'
}

-- Discord Notifications
Config.DiscordNotifications = {
    Enabled = true,
    NewArticle = true,
    EditedArticle = true
}

-- App Design
Config.Header = {
    text = 'Los Santos News',
    color = '#e74c3c',
    fontSize = '24px',
    image = nil -- Set to image URL if you want to use an image instead of text
}