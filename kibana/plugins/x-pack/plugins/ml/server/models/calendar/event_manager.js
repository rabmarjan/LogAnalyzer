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

import Boom from 'boom';

export class EventManager {

  constructor(callWithRequest) {
    this.callWithRequest = callWithRequest;
  }

  async getCalendarEvents(calendarId) {
    try {
      const resp = await this.callWithRequest('ml.events', { calendarId });
      return resp.events;
    } catch (error) {
      throw Boom.badRequest(error);
    }
  }

  // jobId is optional
  async getAllEvents(jobId) {
    const calendarId = '_all';
    try {
      const resp = await this.callWithRequest('ml.events', { calendarId, jobId });
      return resp.events;
    } catch (error) {
      throw Boom.badRequest(error);
    }
  }

  async addEvents(calendarId, events) {
    const body = { events };

    try {
      return await this.callWithRequest('ml.addEvent', { calendarId, body });
    } catch (error) {
      throw Boom.badRequest(error);
    }
  }

  async deleteEvent(calendarId, eventId) {
    return this.callWithRequest('ml.deleteEvent', { calendarId, eventId });
  }

  isEqual(ev1, ev2) {
    return (ev1.event_id === ev2.event_id &&
      ev1.description === ev2.description &&
      ev1.start_time === ev2.start_time &&
      ev1.end_time === ev2.end_time);
  }
}
