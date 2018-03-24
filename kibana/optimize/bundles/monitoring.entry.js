
/**
 * Test entry file
 *
 * This is programatically created and updated, do not modify
 *
 * context: {
  "env": "production",
  "kbnVersion": "6.2.2",
  "buildNum": 16588,
  "plugins": [
    "apm",
    "cloud",
    "console",
    "dashboard_mode",
    "elasticsearch",
    "graph",
    "grokdebugger",
    "input_control_vis",
    "kbn_doc_views",
    "kbn_vislib_vis_types",
    "kibana",
    "license_management",
    "logstash",
    "markdown_vis",
    "metric_vis",
    "metrics",
    "ml",
    "monitoring",
    "region_map",
    "reporting",
    "searchprofiler",
    "security",
    "spy_modes",
    "state_session_storage_redirect",
    "status_page",
    "table_vis",
    "tagcloud",
    "tile_map",
    "tilemap",
    "timelion",
    "vega",
    "watcher",
    "xpack_main"
  ]
}
 */

require('ui/chrome');
require('plugins/monitoring/monitoring');
require('plugins/apm/hacks/toggle_app_link_in_nav');
require('plugins/console/hacks/register');
require('plugins/graph/hacks/toggle_app_link_in_nav');
require('plugins/grokdebugger/sections/grokdebugger/register');
require('plugins/kibana/dev_tools/hacks/hide_empty_tools');
require('plugins/ml/hacks/toggle_app_link_in_nav');
require('plugins/monitoring/hacks/telemetry_trigger');
require('plugins/monitoring/hacks/toggle_app_link_in_nav');
require('plugins/monitoring/hacks/welcome_banner');
require('plugins/reporting/hacks/job_completion_notifier');
require('plugins/searchprofiler/register');
require('plugins/security/hacks/on_session_timeout');
require('plugins/security/hacks/on_unauthorized_response');
require('plugins/security/views/nav_control');
require('plugins/timelion/lib/panel_registry');
require('plugins/timelion/panels/timechart/timechart');
require('plugins/xpack_main/hacks/check_xpack_info_change');
require('ui/chrome').bootstrap(/* xoxo */);

