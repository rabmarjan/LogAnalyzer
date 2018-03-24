# -*- encoding: utf-8 -*-
# stub: logstash-output-kafka 7.0.8 ruby lib

Gem::Specification.new do |s|
  s.name = "logstash-output-kafka".freeze
  s.version = "7.0.8"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "group" => "output", "logstash_plugin" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["Elasticsearch".freeze]
  s.date = "2018-01-24"
  s.description = "This gem is a Logstash plugin required to be installed on top of the Logstash core pipeline using $LS_HOME/bin/logstash-plugin install gemname. This gem is not a stand-alone program".freeze
  s.email = "info@elastic.co".freeze
  s.homepage = "http://www.elastic.co/guide/en/logstash/current/index.html".freeze
  s.licenses = ["Apache License (2.0)".freeze]
  s.requirements = ["jar 'org.apache.kafka:kafka-clients', '1.0.0'".freeze, "jar 'org.slf4j:slf4j-log4j12', '1.7.21'".freeze, "jar 'org.apache.logging.log4j:log4j-1.2-api', '2.6.2'".freeze]
  s.rubygems_version = "2.6.13".freeze
  s.summary = "Writes events to a Kafka topic".freeze

  s.installed_by_version = "2.6.13" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<jar-dependencies>.freeze, ["~> 0.3.2"])
      s.add_runtime_dependency(%q<logstash-core-plugin-api>.freeze, ["<= 2.99", ">= 1.60"])
      s.add_runtime_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
      s.add_development_dependency(%q<logstash-devutils>.freeze, [">= 0"])
      s.add_development_dependency(%q<poseidon>.freeze, [">= 0"])
      s.add_development_dependency(%q<snappy>.freeze, [">= 0"])
    else
      s.add_dependency(%q<jar-dependencies>.freeze, ["~> 0.3.2"])
      s.add_dependency(%q<logstash-core-plugin-api>.freeze, ["<= 2.99", ">= 1.60"])
      s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
      s.add_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
      s.add_dependency(%q<logstash-devutils>.freeze, [">= 0"])
      s.add_dependency(%q<poseidon>.freeze, [">= 0"])
      s.add_dependency(%q<snappy>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<jar-dependencies>.freeze, ["~> 0.3.2"])
    s.add_dependency(%q<logstash-core-plugin-api>.freeze, ["<= 2.99", ">= 1.60"])
    s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-devutils>.freeze, [">= 0"])
    s.add_dependency(%q<poseidon>.freeze, [">= 0"])
    s.add_dependency(%q<snappy>.freeze, [">= 0"])
  end
end
