source "https://rubygems.org"

# Matches the GitHub Pages build environment exactly, so what you see
# locally is what gets published. Run `bundle exec jekyll serve` to preview.
gem "github-pages", group: :jekyll_plugins

# Jekyll plugins used by the site.
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end

# Platform / tooling shims.
gem "webrick", "~> 1.8"      # needed to serve on Ruby >= 3.0
gem "tzinfo", ">= 1", "< 3"
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
