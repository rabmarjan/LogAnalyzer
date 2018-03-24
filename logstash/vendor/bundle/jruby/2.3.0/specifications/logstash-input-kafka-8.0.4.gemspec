# -*- encoding: utf-8 -*-
# stub: logstash-input-kafka 8.0.4 ruby lib

Gem::Specification.new do |s|
  s.name = "logstash-input-kafka".freeze
  s.version = "8.0.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "logstash_group" => "input", "logstash_plugin" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["Elasticsearch".freeze]
  s.date = "2018-01-05"
  s.description = "This gem is a Logstash plugin required to be installed on top of the Logstash core pipeline using $LS_HOME/bin/logstash-plugin install gemname. This gem is not a stand-alone program".freeze
  s.email = "info@elastic.co".freeze
  s.homepage = "http://www.elastic.co/guide/en/logstash/current/index.html".freeze
  s.licenses = ["Apache License (2.0)".freeze]
  s.requirements = ["jar 'org.apache.kafka:kafka-clients', '1.0.0'".freeze, "jar 'org.apache.logging.log4j:log4j-slf4j-impl', '2.8.2'".freeze]
  s.rubygems_version = "2.6.13".freeze
  s.summary = "Reads events from a Kafka topic".freeze

  s.installed_by_version = "2.6.13" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<jar-dependencies>.freeze, ["~> 0.3.2"])
      s.add_runtime_dependency(%q<logstash-core-plugin-api>.freeze, ["<= 2.99", ">= 1.60"])
      s.add_runtime_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<stud>.freeze, ["< 0.1.0", ">= 0.0.22"])
      s.add_development_dependency(%q<logstash-devutils>.freeze, [">= 0"])
      s.add_development_dependency(%q<rspec-wait>.freeze, [">= 0"])
    else
      s.add_dependency(%q<jar-dependencies>.freeze, ["~> 0.3.2"])
      s.add_dependency(%q<logstash-core-plugin-api>.freeze, ["<= 2.99", ">= 1.60"])
      s.add_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
      s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
      s.add_dependency(%q<stud>.freeze, ["< 0.1.0", ">= 0.0.22"])
      s.add_dependency(%q<logstash-devutils>.freeze, [">= 0"])
      s.add_dependency(%q<rspec-wait>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<jar-dependencies>.freeze, ["~> 0.3.2"])
    s.add_dependency(%q<logstash-core-plugin-api>.freeze, ["<= 2.99", ">= 1.60"])
    s.add_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_dependency(%q<stud>.freeze, ["< 0.1.0", ">= 0.0.22"])
    s.add_dependency(%q<logstash-devutils>.freeze, [">= 0"])
    s.add_dependency(%q<rspec-wait>.freeze, [">= 0"])
  end
end
