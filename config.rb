env_name = ENV['APP_ENV'] || 'development'
require "config/environments/#{env_name}"
require 'helpers/asset_helpers'

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

# set :font_dir, 'fonts'
set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'

set :env_name, env_name
set :url_root, ApplicationConfig::BASE_URL

page '/blog/*', layout: 'legacy'
page '/feed.xml', layout: false

activate :autoprefixer do |config|
  config.browsers = ['last 2 versions', 'Explorer >= 9']
  config.cascade  = false
end

activate :blog do |blog|
  blog.prefix = 'blog'
  blog.permalink = '{year}/{title}'
  blog.default_extension = '.html.erb'
end

activate :syntax, :line_numbers => true
activate :directory_indexes
activate :gzip

# Build-specific configuration
configure :build do

  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :asset_hash

  activate :minify_html do |html|
    html.remove_multi_spaces        = true   # Remove multiple spaces
    html.remove_comments            = true   # Remove comments
    html.remove_intertag_spaces     = false  # Remove inter-tag spaces
    html.remove_quotes              = true   # Remove quotes
    html.simple_doctype             = false  # Use simple doctype
    html.remove_script_attributes   = true   # Remove script attributes
    html.remove_style_attributes    = true   # Remove style attributes
    html.remove_link_attributes     = true   # Remove link attributes
    html.remove_form_attributes     = false  # Remove form attributes
    html.remove_input_attributes    = false   # Remove input attributes
    html.remove_javascript_protocol = true   # Remove JS protocol
    html.remove_http_protocol       = false  # Remove HTTP protocol
    html.remove_https_protocol      = false  # Remove HTTPS protocol
    html.preserve_line_breaks       = false  # Preserve line breaks
    html.simple_boolean_attributes  = true   # Use simple boolean attributes
    html.preserve_patterns          = nil    # Patterns to preserve
  end

end

activate :deploy do |deploy|
  deploy.deploy_method = :git
  # Optional Settings
  # deploy.remote   = 'custom-remote' # remote name or git url, default: origin
  # deploy.branch   = 'custom-branch' # default: gh-pages
  # deploy.strategy = :submodule      # commit strategy: can be :force_push or :submodule, default: :force_push
  # deploy.commit_message = 'custom-message'      # commit message (can be empty), default: Automated commit at `timestamp` by middleman-deploy `version`
end
