# -*- encoding: utf-8 -*-
# stub: filesize 0.0.4 ruby lib

Gem::Specification.new do |s|
  s.name = "filesize".freeze
  s.version = "0.0.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Dominik Honnef".freeze]
  s.date = "2009-07-26"
  s.description = "filesize is a small class for handling filesizes with both the SI and binary prefixes, allowing conversion from any size to any other size.".freeze
  s.email = "dominikh@fork-bomb.org".freeze
  s.extra_rdoc_files = ["README.markdown".freeze, "CHANGELOG".freeze, "lib/filesize.rb".freeze]
  s.files = ["CHANGELOG".freeze, "README.markdown".freeze, "lib/filesize.rb".freeze]
  s.homepage = "http://filesize.rubyforge.org/".freeze
  s.required_ruby_version = Gem::Requirement.new(">= 1.8.6".freeze)
  s.rubyforge_project = "filesize".freeze
  s.rubygems_version = "2.6.13".freeze
  s.summary = "filesize is a small class for handling filesizes with both the SI and binary prefixes, allowing conversion from any size to any other size.".freeze

  s.installed_by_version = "2.6.13" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rspec>.freeze, ["~> 3.0"])
    else
      s.add_dependency(%q<rspec>.freeze, ["~> 3.0"])
    end
  else
    s.add_dependency(%q<rspec>.freeze, ["~> 3.0"])
  end
end
