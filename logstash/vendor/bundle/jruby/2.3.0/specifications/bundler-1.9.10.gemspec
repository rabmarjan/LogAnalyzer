# -*- encoding: utf-8 -*-
# stub: bundler 1.9.10 ruby lib

Gem::Specification.new do |s|
  s.name = "bundler".freeze
  s.version = "1.9.10"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Andr\u{e9} Arko".freeze, "Terence Lee".freeze, "Carl Lerche".freeze, "Yehuda Katz".freeze]
  s.date = "2015-06-23"
  s.description = "Bundler manages an application's dependencies through its entire life, across many machines, systematically and repeatably".freeze
  s.email = ["andre.arko+terence.lee@gmail.com".freeze]
  s.executables = ["bundle".freeze, "bundler".freeze]
  s.files = ["bin/bundle".freeze, "bin/bundler".freeze]
  s.homepage = "http://bundler.io".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 1.8.7".freeze)
  s.rubygems_version = "2.6.13".freeze
  s.summary = "The best way to manage your application's dependencies".freeze

  s.installed_by_version = "2.6.13" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<mustache>.freeze, ["= 0.99.6"])
      s.add_development_dependency(%q<rdiscount>.freeze, ["~> 1.6"])
      s.add_development_dependency(%q<ronn>.freeze, ["~> 0.7.3"])
      s.add_development_dependency(%q<rspec>.freeze, ["~> 3.0"])
      s.add_development_dependency(%q<rake>.freeze, [">= 0"])
    else
      s.add_dependency(%q<mustache>.freeze, ["= 0.99.6"])
      s.add_dependency(%q<rdiscount>.freeze, ["~> 1.6"])
      s.add_dependency(%q<ronn>.freeze, ["~> 0.7.3"])
      s.add_dependency(%q<rspec>.freeze, ["~> 3.0"])
      s.add_dependency(%q<rake>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<mustache>.freeze, ["= 0.99.6"])
    s.add_dependency(%q<rdiscount>.freeze, ["~> 1.6"])
    s.add_dependency(%q<ronn>.freeze, ["~> 0.7.3"])
    s.add_dependency(%q<rspec>.freeze, ["~> 3.0"])
    s.add_dependency(%q<rake>.freeze, [">= 0"])
  end
end
