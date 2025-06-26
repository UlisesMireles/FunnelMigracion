import { Injectable } from '@angular/core';
import { Observable, zip } from "rxjs";
import { map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import {
  BaseEditService,
  SchedulerModelFields,
} from "@progress/kendo-angular-scheduler";
import { parseDate } from "@progress/kendo-angular-intl";

const CREATE_ACTION = "Create";
const UPDATE_ACTION = "Update";
const REMOVE_ACTION = "Destroy";

const fields: SchedulerModelFields = {
  id: "TaskID",
  title: "Title",
  description: "Description",
  startTimezone: "StartTimezone",
  start: "Start",
  end: "End",
  endTimezone: "EndTimezone",
  isAllDay: "IsAllDay",
  recurrenceRule: "RecurrenceRule",
  recurrenceId: "RecurrenceID",
  recurrenceExceptions: "RecurrenceException",
};

@Injectable({
  providedIn: 'root'
})
export class EditCalendarioService extends BaseEditService<MyEvent> {

 public loading = false;

  constructor(private readonly http: HttpClient) {
    super(fields);
  }

  public read(): void {
    if (this.data.length) {
      this.source.next(this.data);
      return;
    }

    this.fetch().subscribe((data) => {
      this.data = data.map((item) => this.readEvent(item));
      this.source.next(this.data);
    });
  }

  protected save(
    created: MyEvent[],
    updated: MyEvent[],
    deleted: MyEvent[]
  ): void {
    const completed = [];
    if (deleted.length) {
      completed.push(this.fetch(REMOVE_ACTION, deleted));
    }

    if (updated.length) {
      completed.push(this.fetch(UPDATE_ACTION, updated));
    }

    if (created.length) {
      completed.push(this.fetch(CREATE_ACTION, created));
    }

    zip(...completed).subscribe(() => this.read());
  }

  protected fetch(action = "", data?: any): Observable<any[]> {
    this.loading = true;

    return this.http
      .post(
        `https://demos.telerik.com/service/v2/core/Tasks/${action}`,
        this.serializeModels(data),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .pipe(
        map((res) => <any[]>res),
        tap(() => (this.loading = false))
      );
  }

  private readEvent(item: any): MyEvent {
    return {
      ...item,
      Start: parseDate(item.Start),
      End: parseDate(item.End),
      RecurrenceException: this.parseExceptions(item.RecurrenceException),
    };
  }

  private serializeModels(events: MyEvent[]): string {
    if (!events) {
      return "";
    }

    const data = events.map((event) => ({
      ...event,
      RecurrenceException: this.serializeExceptions(event.RecurrenceException),
    }));

    return JSON.stringify(data);
  }
}

interface MyEvent {
  TaskID?: number;
  OwnerID?: number;
  Title?: string;
  Description?: string;
  Start?: Date;
  End?: Date;
  StartTimezone?: string;
  EndTimezone?: string;
  IsAllDay?: boolean;
  RecurrenceException?: any;
  RecurrenceID?: number;
  RecurrenceRule?: string;
}
