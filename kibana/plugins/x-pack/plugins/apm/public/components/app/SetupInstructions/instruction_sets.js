export const serverInstructions = [
  {
    id: 'deb',
    name: 'Debian',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Download and unpack APM Server for Debian',
        downloadButton: true
      },
      {
        indicatorNumber: 2,
        title: 'Import dashboards (optional)',
        textPre: 'APM Server ships with pre-configured dashboards.',
        code: './apm-server setup',
        textPost:
          "If you're using an X-Pack secured version of Elastic Stack, you need to specify credentials in the `apm-server.yml` config file. [Documentation](https://www.elastic.co/guide/en/apm/server/6.2/configuring.html)."
      },
      {
        indicatorNumber: 3,
        title: 'Start APM Server',
        textPre:
          'The server processes and stores application performance metrics in Elasticsearch.',
        code: './apm-server -e'
      },
      {
        indicatorNumber: 4,
        title: 'APM Server status',
        textPre:
          'Make sure APM Server is running before you start implementing the APM agents.',
        isStatusStep: true
      }
    ]
  },
  {
    id: 'rpm',
    name: 'RPM',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Download and unpack APM Server for RPM',
        downloadButton: true
      },
      {
        indicatorNumber: 2,
        title: 'Import dashboards (optional)',
        textPre: 'APM Server ships with pre-configured dashboards.',
        code: './apm-server setup',
        textPost:
          "If you're using an X-Pack secured version of Elastic Stack, you need to specify credentials in the `apm-server.yml` config file. [Documentation](https://www.elastic.co/guide/en/apm/server/6.2/configuring.html)."
      },
      {
        indicatorNumber: 3,
        title: 'Start APM Server',
        textPre:
          'The server processes and stores application performance metrics in Elasticsearch.',
        code: './apm-server -e'
      },
      {
        indicatorNumber: 4,
        title: 'APM Server status',
        textPre:
          'Make sure APM Server is running before you start implementing the APM agents.',
        isStatusStep: true
      }
    ]
  },
  {
    id: 'linux',
    name: 'Linux',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Download and unpack APM Server for Linux',
        downloadButton: true
      },
      {
        indicatorNumber: 2,
        title: 'Import dashboards (optional)',
        textPre: 'APM Server ships with pre-configured dashboards.',
        code: './apm-server setup',
        textPost:
          "If you're using an X-Pack secured version of Elastic Stack, you need to specify credentials in the `apm-server.yml` config file. [Documentation](https://www.elastic.co/guide/en/apm/server/6.2/configuring.html)."
      },
      {
        indicatorNumber: 3,
        title: 'Start APM Server',
        textPre:
          'The server processes and stores application performance metrics in Elasticsearch.',
        code: './apm-server -e'
      },
      {
        indicatorNumber: 4,
        title: 'APM Server status',
        textPre:
          'Make sure APM Server is running before you start implementing the APM agents.',
        isStatusStep: true
      }
    ]
  },
  {
    id: 'mac',
    name: 'Mac',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Download and unpack APM Server for Mac',
        downloadButton: true
      },
      {
        indicatorNumber: 2,
        title: 'Import dashboards (optional)',
        textPre: 'APM Server ships with pre-configured dashboards.',
        code: './apm-server setup',
        textPost:
          "If you're using an X-Pack secured version of Elastic Stack, you need to specify credentials in the `apm-server.yml` config file. [Documentation](https://www.elastic.co/guide/en/apm/server/6.2/configuring.html)."
      },
      {
        indicatorNumber: 3,
        title: 'Start APM Server',
        textPre:
          'The server processes and stores application performance metrics in Elasticsearch.',
        code: './apm-server -e'
      },
      {
        indicatorNumber: 4,
        title: 'APM Server status',
        textPre:
          'Make sure APM Server is running before you start implementing the APM agents.',
        isStatusStep: true
      }
    ]
  },
  {
    id: 'win',
    name: 'Windows',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Download and unpack APM Server for Windows',
        downloadButton: true
      },
      {
        indicatorNumber: 2,
        title: 'Import dashboards (optional)',
        textPre: 'APM Server ships with pre-configured dashboards.',
        code: 'apm-server.exe setup',
        textPost:
          "If you're using an X-Pack secured version of Elastic Stack, you need to specify credentials in the `apm-server.yml` config file. [Documentation](https://www.elastic.co/guide/en/apm/server/6.2/configuring.html)."
      },
      {
        indicatorNumber: 3,
        title: 'Start APM Server',
        textPre:
          'The server processes and stores application performance metrics in Elasticsearch.',
        code: 'apm-server.exe -e'
      },
      {
        indicatorNumber: 4,
        title: 'APM Server status',
        textPre:
          'Make sure APM Server is running before you start implementing the APM agents.',
        isStatusStep: true
      }
    ]
  },
  {
    id: 'docker',
    name: 'Docker',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Run APM Server in Docker',
        textPre: 'Start APM Server image in Docker.',
        code: `docker run -p 8200:8200 docker.elastic.co/apm/apm-server:6.2.0 apm-server -e`,
        textPost: `To configure APM Server in Docker, please see [the documentation](https://www.elastic.co/guide/en/apm/server/6.2/running-on-docker.html#running-on-docker).`
      },
      {
        indicatorNumber: 2,
        title: 'APM Server status',
        textPre:
          'Make sure APM Server is running before you go and implement the APM agents.',
        isStatusStep: true
      }
    ]
  }
];

export const agentInstructions = [
  {
    id: 'node',
    name: 'Node.js',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Install the APM agent',
        textPre:
          'Install the APM agent for Node.js as a dependency to your application.',
        code: `npm install elastic-apm-node --save`
      },
      {
        indicatorNumber: 2,
        title: 'Configure the agent',
        textPre:
          'Agents are libraries that run inside of your application process. APM services are created programmatically based on the `serviceName`. This agent supports Express, Koa, hapi, and custom Node.js.',
        codeLanguage: 'javascript',
        code: `// Add this to the VERY top of the first file loaded in your application
var apm = require('elastic-apm-node').start({
    // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
    serviceName: '',
    // Use if APM Server requires a token
    secretToken: '',
    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: ''
})`,
        textPost:
          'See [the documentation](https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/index.html) for advanced usage, including how to use with [Babel/ES Modules](https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/advanced-setup.html#es-modules).'
      },
      {
        indicatorNumber: 3,
        title: 'APM agent status',
        textPre:
          "Let's check that the agent is running and sending up data to APM Server.",
        isStatusStep: true
      }
    ]
  },
  {
    id: 'django',
    name: 'Django',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Install the APM agent',
        textPre: 'Install the APM agent for Python as a dependency.',
        code: `$ pip install elastic-apm`
      },
      {
        indicatorNumber: 2,
        title: 'Configure the agent',
        textPre:
          'Agents are libraries that run inside of your application process. APM services are created programmatically based on the `SERVICE_NAME`.',
        codeLanguage: 'python',
        code: `# Add the agent to INSTALLED_APPS in your settings.py
INSTALLED_APPS = (
    'elasticapm.contrib.django',
    # ...
)

# Choose a service name and optionally a secret token
ELASTIC_APM = {
    # allowed characters in SERVICE_NAME: a-z, A-Z, 0-9, -, _, and space
    'SERVICE_NAME': '<SERVICE-NAME>',
    'SECRET_TOKEN': '<SECRET-TOKEN>',
}

# To send performance metrics, add our tracing middleware:
MIDDLEWARE = (
    'elasticapm.contrib.django.middleware.TracingMiddleware',
    #...
)
`,
        textPost:
          'See the [documentation](https://www.elastic.co/guide/en/apm/agent/python/2.x/django-support.html) for advanced usage.'
      },
      {
        indicatorNumber: 3,
        title: 'APM agent status',
        textPre:
          "Let's check that the agent is running and sending up data to APM Server.",
        isStatusStep: true
      }
    ]
  },
  {
    id: 'flask',
    name: 'Flask',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Install the APM agent',
        textPre: 'Install the APM agent for Python as a dependency.',
        code: `$ pip install elastic-apm[flask]`
      },
      {
        indicatorNumber: 2,
        title: 'Configure the agent',
        textPre:
          'Agents are libraries that run inside of your application process. APM services are created programmatically based on the `SERVICE_NAME`.',
        codeLanguage: 'python',
        code: `# initialize using environment variables
from elasticapm.contrib.flask import ElasticAPM
app = Flask(__name__)
apm = ElasticAPM(app)

# or configure to use ELASTIC_APM in your application's settings
from elasticapm.contrib.flask import ElasticAPM
app.config['ELASTIC_APM'] = {
    # allowed characters in SERVICE_NAME: a-z, A-Z, 0-9, -, _, and space
    'SERVICE_NAME': '<SERVICE-NAME>',
    'SECRET_TOKEN': '<SECRET-TOKEN>',
}
apm = ElasticAPM(app)
`,
        textPost:
          'See [the documentation](https://www.elastic.co/guide/en/apm/agent/python/2.x/flask-support.html) for advanced usage.'
      },
      {
        indicatorNumber: 3,
        title: 'APM agent status',
        textPre:
          "Let's check that the agent is running and sending up data to APM Server.",
        isStatusStep: true
      }
    ]
  },
  {
    id: 'rails',
    name: 'Ruby on Rails (Beta)',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Install the APM agent',
        textPre: 'Add the agent to your Gemfile',
        code: `gem 'elastic-apm'`
      },
      {
        indicatorNumber: 2,
        title: 'Configure the agent: Ruby on Rails',
        textPre:
          'APM is automatically installed. Configure the agent, by creating the config file `config/elastic_apm.yml`',
        codeLanguage: 'ruby',
        code: `# config/elastic_apm.yml
        server_url: 'http://localhost:8200'`,
        textPost:
          'See [the documentation](https://www.elastic.co/guide/en/apm/agent/ruby/1.x/index.html) for configuration options and advanced usage.'
      },
      {
        indicatorNumber: 3,
        title: 'APM agent status',
        textPre:
          "Let's check that the agent is running and sending up data to APM Server.",
        textPost:
          '**Warning: The Ruby agent is currently in Beta and not meant for production use.**',
        isStatusStep: true
      }
    ]
  },
  {
    id: 'rack',
    name: 'Rack (Beta)',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Install the APM agent',
        textPre: 'Add the agent to your Gemfile',
        code: `gem 'elastic-apm'`
      },
      {
        indicatorNumber: 2,
        title:
          'Configure the agent: Rack or compatible framework (like Sinatra)',
        textPre: 'Include the middleware in your app and start the agent.',
        codeLanguage: 'ruby',
        code: `# config.ru

require 'sinatra/base'
class MySinatraApp < Sinatra::Base
  use ElasticAPM::Middleware
  
  # ...
end

# Takes optional ElasticAPM::Config values
ElasticAPM.start(
  app: MySinatraApp, # required
  server_url: 'http://localhost:8200'
)

run MySinatraApp

at_exit { ElasticAPM.stop }`,
        textPost:
          'See [the documentation](https://www.elastic.co/guide/en/apm/agent/ruby/1.x/index.html) for configuration options and advanced usage.'
      },
      {
        indicatorNumber: 3,
        title: 'APM agent status',
        textPre:
          "Let's check that the agent is running and sending up data to APM Server.",
        textPost:
          '**Warning: The Ruby agent is currently in Beta and not meant for production use.**',
        isStatusStep: true
      }
    ]
  },
  {
    id: 'js',
    name: 'JS (Alpha)',
    steps: [
      {
        indicatorNumber: 1,
        title: 'Enable experimental frontend support in the APM server',
        textPre:
          'Please refer to [the documentation](https://www.elastic.co/guide/en/apm/server/6.2/frontend.html).'
      },
      {
        indicatorNumber: 2,
        title: 'Install the APM agent',
        textPre:
          'Install the APM agent for JavaScript as a dependency to your application:',
        code: `npm install elastic-apm-js-base --save`
      },
      {
        indicatorNumber: 3,
        title: 'Configure the agent',
        textPre: 'Agents are libraries that run inside of your application.',
        codeLanguage: 'javascript',
        code: `import { init as initApm } from 'elastic-apm-js-base'
var apm = initApm({
  
  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'http://localhost:8200',
  
  // Set required service name
  serviceName: 'service-name',
  
  // Set service version (required for sourcemap feature)
  serviceVersion: 'service-version'
})`,
        textPost:
          'See [the documentation](https://www.elastic.co/guide/en/apm/agent/js-base/0.x/index.html) for advanced usage.'
      },
      {
        indicatorNumber: 4,
        title: 'APM agent status',
        textPre:
          "Let's check that the agent is running and sending up data to APM Server.",
        textPost:
          '**Warning: The JS agent is currently in Alpha and not meant for production use.**',
        isStatusStep: true
      }
    ]
  }
];
