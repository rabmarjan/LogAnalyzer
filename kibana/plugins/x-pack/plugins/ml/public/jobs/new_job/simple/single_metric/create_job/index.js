/*
 * ELASTICSEARCH CONFIDENTIAL
 *
 * Copyright © 2017 Elasticsearch BV. All Rights Reserved.
 *
 * Notice: this software, and all information contained
 * therein, is the exclusive property of Elasticsearch BV
 * and its licensors, if any, and is protected under applicable
 * domestic and foreign law, and international treaties.
 *
 * Reproduction, republication or distribution without the
 * express written consent of Elasticsearch BV is
 * strictly prohibited.
 */

import './styles/main.less';
import './create_job_controller';
import './create_job_service';
import './create_job_chart_directive';
import 'plugins/ml/services/mapping_service';
import 'plugins/ml/jobs/new_job/simple/components/utils/search_service';
import 'plugins/ml/jobs/new_job/simple/components/post_save_options';
import 'plugins/ml/jobs/new_job/simple/components/bucket_span_estimator';
import 'plugins/ml/components/job_group_select';
import 'plugins/ml/components/full_time_range_selector';
import 'plugins/ml/components/field_type_icon';
