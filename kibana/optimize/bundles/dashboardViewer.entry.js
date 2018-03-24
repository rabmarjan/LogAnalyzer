
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
require('plugins/dashboard_mode/dashboard_viewer');
require('plugins/apm/hacks/toggle_app_link_in_nav');
require('plugins/console/hacks/register');
require('plugins/graph/hacks/toggle_app_link_in_nav');
require('plugins/grokdebugger/sections/grokdebugger/register');
require('plugins/input_control_vis/register_vis');
require('plugins/kbn_doc_views/kbn_doc_views');
require('plugins/kbn_vislib_vis_types/kbn_vislib_vis_types');
require('plugins/kibana/dashboard/saved_dashboard/saved_dashboard_register');
require('plugins/kibana/dev_tools/hacks/hide_empty_tools');
require('plugins/kibana/discover/embeddable/search_embeddable_factory_provider');
require('plugins/kibana/discover/saved_searches/saved_search_register');
require('plugins/kibana/field_formats/register');
require('plugins/kibana/visualize/embeddable/visualize_embeddable_factory_provider');
require('plugins/kibana/visualize/saved_visualizations/saved_visualization_register');
require('plugins/markdown_vis/markdown_vis');
require('plugins/metric_vis/metric_vis');
require('plugins/metrics/kbn_vis_types');
require('plugins/ml/hacks/toggle_app_link_in_nav');
require('plugins/monitoring/hacks/telemetry_trigger');
require('plugins/monitoring/hacks/toggle_app_link_in_nav');
require('plugins/monitoring/hacks/welcome_banner');
require('plugins/region_map/region_map_vis');
require('plugins/reporting/controls/dashboard');
require('plugins/reporting/controls/discover');
require('plugins/reporting/controls/visualize');
require('plugins/reporting/hacks/job_completion_notifier');
require('plugins/searchprofiler/register');
require('plugins/security/hacks/on_session_timeout');
require('plugins/security/hacks/on_unauthorized_response');
require('plugins/security/views/nav_control');
require('plugins/spy_modes/req_resp_stats_spy_mode');
require('plugins/spy_modes/table_spy_mode');
require('plugins/table_vis/table_vis');
require('plugins/tagcloud/tag_cloud_vis');
require('plugins/tile_map/tile_map_vis');
require('plugins/tilemap/vis_type_enhancers/update_tilemap_settings');
require('plugins/timelion/lib/panel_registry');
require('plugins/timelion/panels/timechart/timechart');
require('plugins/timelion/vis');
require('plugins/vega/vega_type');
require('plugins/xpack_main/hacks/check_xpack_info_change');
require('ui/vis/editors/default/default');
require('ui/vis/request_handlers/courier');
require('ui/vis/request_handlers/none');
require('ui/vis/response_handlers/basic');
require('ui/vis/response_handlers/none');
require('ui/vis/response_handlers/tabify');
require('ui/chrome').bootstrap(/* xoxo */);

