# -*- encoding: utf-8 -*-
# stub: gelfd 0.2.0 ruby lib

Gem::Specification.new do |s|
  s.name = "gelfd".freeze
  s.version = "0.2.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["John E. Vincent".freeze]
  s.date = "2011-11-11"
  s.description = "Standalone implementation of the Graylog Extended Log Format".freeze
  s.email = ["lusis.org+github.com@gmail.com".freeze]
  s.executables = ["gelfd".freeze]
  s.files = ["bin/gelfd".freeze]
  s.homepage = "".freeze
  s.rubyforge_project = "gelfd".freeze
  s.rubygems_version = "2.6.13".freeze
  s.summary = "Pure ruby gelf server and decoding library".freeze

  s.installed_by_version = "2.6.13" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<json>.freeze, ["~> 1.5.4"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 0.9.2"])
    else
      s.add_dependency(%q<json>.freeze, ["~> 1.5.4"])
      s.add_dependency(%q<rake>.freeze, ["~> 0.9.2"])
    end
  else
    s.add_dependency(%q<json>.freeze, ["~> 1.5.4"])
    s.add_dependency(%q<rake>.freeze, ["~> 0.9.2"])
  end
end
