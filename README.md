---
title: Sanskrit documentation theme- README
tags: [getting_started]
---

## Intro

This is the "Sanskrit" collaborative documentation theme for use with the Jekyll static website generator.

Some notable things you get with this theme (in decreasing order of interest):
- A collapsible "accordion" sidebar
- A collapsible "accordion" table-of-contents for each page.
- A layout which automatically
- An "Edit me" link on top of each page.
- Search engine optimization and webmaster stuff - which you would use with various search engines.
- Google custom search configuration
- Disqus for comments.
- Google analytics configuration
- Special formatting consideration for fonts which need to be displayed bigger (eg: Devanagari for sanskrit.)
- the usual Jekyll blog.
  - Post tag support

### Screenshots and examples
- See this test site: <https://sanskrit-coders.github.io/sanskrit-documentation-theme/>!

[![Screenshot 1](https://i.imgur.com/2ggUjKK.png)](https://i.imgur.com/2ggUjKK.png){:target="_blank"}

## Usage
Take a look at this very repository for an example!

In particular, note the files that you would need to add / modify as needed:
- the `_config.yml` file.
  - Especially, specify that you're using this theme by either adding `remote_theme: sanskrit-coders/sanskrit-documentation-theme` or `theme: sanskrit-documentation-theme` (In which case you'd need to install the theme gem).
- The _data/sidebars/*.yml file, which defines the contents of the sidebar and top navigation menu you see for each page.
- The 404.md file, which defines how the "Page Not Found" results look like.
- The Gemfile : no modification needed.

### Installation
PS: Installation is not needed if you are using the 'remote-theme' method described above.

Steps:
- Add this line to your Jekyll site's `Gemfile`: `gem "sanskrit-documentation-theme"`
- Execute `bundle` Or install it yourself as: `gem install sanskrit-documentation-theme`

### Search / webmaster tips
- sitemap.xml can be explicitly submitted to various search engines.

## Contributing
To experiment with this code, add some sample content and run `bundle exec jekyll serve` – this directory is setup just like a Jekyll site!

Bug reports and pull requests are welcome on GitHub. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Development
To set up your environment to develop this theme, run `bundle install`.

Your theme is setup just like a normal Jekyll site! To test your theme, run `bundle exec jekyll serve` and open your browser at `http://localhost:4000`. This starts a Jekyll server using your theme. Add pages, documents, data, etc. like normal to test your theme's contents. As you make modifications to your theme and to your content, your site will regenerate and you should see the changes in the browser after a refresh, just like normal.

When your theme is released, only the files in `_layouts`, `_includes`, `_sass` and `assets` tracked with Git will be bundled.
To add a custom directory to your theme-gem, please edit the regexp in `sanskrit-documentation-theme.gemspec` accordingly.

### Publishing to RubyGems.org
- Update `sanskrit-documentation-theme.gemspec`
- `gem build *.gemspec`
- `gem push *.gem`

## License and acknowledgement
We fork off the [tomjoht/documentation-theme-jekyll](http://github.com/tomjoht/documentation-theme-jekyll) theme.

The theme is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

