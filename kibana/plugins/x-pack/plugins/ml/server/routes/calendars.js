/*
 * ELASTICSEARCH CONFIDENTIAL
 *
 * Copyright (c) 2017 Elasticsearch BV. All Rights Reserved.
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

import { callWithRequestFactory } from '../get_client_ml';
import { wrapError } from '../errors';
import { CalendarManager } from '../models/calendar';


function getAllCalendars(callWithRequest) {
  const cal = new CalendarManager(callWithRequest);
  return cal.getAllCalendars();
}

function getCalendar(callWithRequest, calendarId) {
  const cal = new CalendarManager(callWithRequest);
  return cal.getCalendar(calendarId);
}

function newCalendar(callWithRequest, calendar) {
  const cal = new CalendarManager(callWithRequest);
  return cal.newCalendar(calendar);
}

function updateCalendar(callWithRequest, calendarId, calendar) {
  const cal = new CalendarManager(callWithRequest);
  return cal.updateCalendar(calendarId, calendar);
}

function deleteCalendar(callWithRequest, calendarId) {
  const cal = new CalendarManager(callWithRequest);
  return cal.deleteCalendar(calendarId);
}

export function calendars(server, commonRouteConfig) {

  server.route({
    method: 'GET',
    path: '/api/ml/calendars',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      return getAllCalendars(callWithRequest)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'GET',
    path: '/api/ml/calendars/{calendarId}',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const calendarId = request.params.calendarId;
      return getCalendar(callWithRequest, calendarId)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'PUT',
    path: '/api/ml/calendars',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const body = request.payload;
      return newCalendar(callWithRequest, body)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'PUT',
    path: '/api/ml/calendars/{calendarId}',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const calendarId = request.params.calendarId;
      const body = request.payload;
      return updateCalendar(callWithRequest, calendarId, body)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/ml/calendars/{calendarId}',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const calendarId = request.params.calendarId;
      return deleteCalendar(callWithRequest, calendarId)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

}
