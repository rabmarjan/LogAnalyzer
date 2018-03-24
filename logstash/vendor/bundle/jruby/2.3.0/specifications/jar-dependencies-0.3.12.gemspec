# -*- encoding: utf-8 -*-
# stub: jar-dependencies 0.3.12 ruby lib

Gem::Specification.new do |s|
  s.name = "jar-dependencies".freeze
  s.version = "0.3.12"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["christian meier".freeze]
  s.date = "2017-12-26"
  s.description = "manage jar dependencies for gems and keep track which jar was already loaded using maven artifact coordinates. it warns on version conflicts and loads only ONE jar assuming the first one is compatible to the second one otherwise your project needs to lock down the right version by providing a Jars.lock file.".freeze
  s.email = ["mkristian@web.de".freeze]
  s.executables = ["lock_jars".freeze]
  s.files = ["bin/lock_jars".freeze]
  s.homepage = "https://github.com/mkristian/jar-dependencies".freeze
  s.licenses = ["MIT".freeze]
  s.post_install_message = "\nif you want to use the executable lock_jars then install ruby-maven gem before using lock_jars\n\n  $ gem install ruby-maven -v '~> 3.3.11'\n\nor add it as a development dependency to your Gemfile\n\n   gem 'ruby-maven', '~> 3.3.11'\n\n".freeze
  s.rubygems_version = "2.6.13".freeze
  s.summary = "manage jar dependencies for gems".freeze

  s.installed_by_version = "2.6.13" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<minitest>.freeze, ["~> 5.3"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.2"])
      s.add_development_dependency(%q<ruby-maven>.freeze, ["~> 3.3.11"])
    else
      s.add_dependency(%q<minitest>.freeze, ["~> 5.3"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.2"])
      s.add_dependency(%q<ruby-maven>.freeze, ["~> 3.3.11"])
    end
  else
    s.add_dependency(%q<minitest>.freeze, ["~> 5.3"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.2"])
    s.add_dependency(%q<ruby-maven>.freeze, ["~> 3.3.11"])
  end
end
