# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "sanskrit-documentation-theme"
  spec.version       = "0.1.8"
  spec.authors       = ["vvasuki"]
  spec.email         = ["sanskrit-programmers@googlegroups.com"]

  spec.summary       = "A documentation theme forked off http://github.com/tomjoht/documentation-theme-jekyll ."
  spec.homepage      = "https://github.com/sanskrit-coders/sanskrit-documentation-theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "jekyll", "~> 3.8"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.0"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.9"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.2.0"
  spec.add_runtime_dependency "jekyll-regex-replace", "~> 1.1.0"

  spec.add_development_dependency "bundler", "~> 2.0"
  spec.add_development_dependency "rake", "~> 12.0"
end
