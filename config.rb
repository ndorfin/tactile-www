env_name = ENV['APP_ENV'] || 'development'
require "config/environments/#{env_name}"
require 'helpers/asset_helpers'

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

set :env_name, env_name

set :font_dir, 'fonts'
set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'

set :url_root, ApplicationConfig::BASE_URL

page '/blog/*', :layout => 'legacy'

activate :directory_indexes
activate :gzip

activate :autoprefixer do |config|
  config.browsers = ['last 2 versions', 'Explorer >= 9']
  config.cascade  = false
end

activate :syntax, :line_numbers => true

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :asset_hash

  activate :minify_html do |html|
    html.remove_http_protocol    = false
    html.remove_input_attributes = false
  end
end
