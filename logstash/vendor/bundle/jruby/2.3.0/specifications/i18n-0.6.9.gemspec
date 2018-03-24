# -*- encoding: utf-8 -*-
# stub: i18n 0.6.9 ruby lib

Gem::Specification.new do |s|
  s.name = "i18n".freeze
  s.version = "0.6.9"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.5".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Sven Fuchs".freeze, "Joshua Harvey".freeze, "Matt Aimonetti".freeze, "Stephan Soller".freeze, "Saimon Moore".freeze]
  s.date = "2013-12-03"
  s.description = "New wave Internationalization support for Ruby.".freeze
  s.email = "rails-i18n@googlegroups.com".freeze
  s.homepage = "http://github.com/svenfuchs/i18n".freeze
  s.licenses = ["MIT".freeze]
  s.rubyforge_project = "[none]".freeze
  s.rubygems_version = "2.6.13".freeze
  s.summary = "New wave Internationalization support for Ruby".freeze

  s.installed_by_version = "2.6.13" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<activesupport>.freeze, [">= 3.0.0"])
      s.add_development_dependency(%q<sqlite3>.freeze, [">= 0"])
      s.add_development_dependency(%q<mocha>.freeze, [">= 0"])
      s.add_development_dependency(%q<test_declarative>.freeze, [">= 0"])
    else
      s.add_dependency(%q<activesupport>.freeze, [">= 3.0.0"])
      s.add_dependency(%q<sqlite3>.freeze, [">= 0"])
      s.add_dependency(%q<mocha>.freeze, [">= 0"])
      s.add_dependency(%q<test_declarative>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<activesupport>.freeze, [">= 3.0.0"])
    s.add_dependency(%q<sqlite3>.freeze, [">= 0"])
    s.add_dependency(%q<mocha>.freeze, [">= 0"])
    s.add_dependency(%q<test_declarative>.freeze, [">= 0"])
  end
end
