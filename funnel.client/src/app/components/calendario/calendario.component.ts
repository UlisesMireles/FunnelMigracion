import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {
  CreateFormGroupArgs,
  EventStyleArgs,
  SchedulerEvent,
  CrudOperation,
  CancelEvent,
  EditMode,
  EventClickEvent,
  KENDO_SCHEDULER,
  RemoveEvent,
  SaveEvent,
  SchedulerComponent,
  SlotClickEvent,
} from '@progress/kendo-angular-scheduler';

import { EditCalendarioService } from '../../services/edit-calendario.service';
import { filter } from "rxjs/operators";
import { MapboxLayers } from 'plotly.js-dist-min';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
  providers: [EditCalendarioService],
})
export class CalendarioComponent {
  public selectedDate: Date = new Date("2025-10-22T00:00:00");
   public events: SchedulerEvent[] = [
    {
      id: 1,
      title: "Breakfast",
      start: new Date("2025-10-20T09:00:00"),
      end: new Date("2025-10-20T09:30:00"),
    },
    {
      id: 2,
      title: "Team Meeting",
      start: new Date("2025-10-22T10:00:00"),
      end: new Date("2025-10-22T11:00:00"),
    },
    {
      id: 3,
      title: "Lunch",
      start: new Date("2025-10-22T12:30:00"),
      end: new Date("2025-10-22T13:30:00"),
    },
  ];
  public formGroup!: FormGroup | undefined;

  public group: any = {
    resources: ["Rooms"],
    orientation: "horizontal",
  };

  public resources: any[] = [
    {
      name: "Rooms",
      data: [
        { text: "Meeting Room 101", value: 1, color: "#6eb3fa" },
        { text: "Meeting Room 201", value: 2, color: "#f58a8a" },
      ],
      field: "roomId",
      valueField: "value",
      textField: "text",
      colorField: "color",
    },
    {
      name: "Attendees",
      data: [
        { text: "Alex", value: 1, color: "#f8a398" },
        { text: "Bob", value: 2, color: "#51a0ed" },
        { text: "Charlie", value: 3, color: "#56ca85" },
      ],
      multiple: true,
      field: "attendees",
      valueField: "value",
      textField: "text",
      colorField: "color",
    },
  ];

  constructor(private formBuilder: FormBuilder, public editService: EditCalendarioService) {
    this.createFormGroup = this.createFormGroup.bind(this);
  }

  public ngOnInit(): void {
    this.editService.read();
  }

  public slotDblClickHandler({
    sender,
    start,
    end,
    isAllDay,
  }: SlotClickEvent): void {
    this.closeEditor(sender);

    this.formGroup = this.formBuilder.group({
      Start: [start, Validators.required],
      End: [end, Validators.required],
      StartTimezone: new FormControl(),
      EndTimezone: new FormControl(),
      IsAllDay: isAllDay,
      Title: new FormControl(""),
      Description: new FormControl(""),
      RecurrenceRule: new FormControl(),
      RecurrenceID: new FormControl(),
    });

    sender.addEvent(this.formGroup);
  }

  public eventDblClickHandler({ sender, event }: EventClickEvent): void {
    this.closeEditor(sender);

    let dataItem = event.dataItem;

    this.formGroup = this.createFormGroup(dataItem, EditMode.Event);
    sender.editEvent(dataItem, { group: this.formGroup });
  }

  public createFormGroup(dataItem: any, mode: EditMode): FormGroup {
    const isOccurrence = mode === EditMode.Occurrence;
    const exceptions = isOccurrence ? [] : dataItem.RecurrenceException;

    return this.formBuilder.group({
      Start: [dataItem.Start, Validators.required],
      End: [dataItem.End, Validators.required],
      StartTimezone: [dataItem.StartTimezone],
      EndTimezone: [dataItem.EndTimezone],
      IsAllDay: dataItem.IsAllDay,
      Title: dataItem.Title,
      Description: dataItem.Description,
      RecurrenceRule: dataItem.RecurrenceRule,
      RecurrenceID: dataItem.RecurrenceID,
      RecurrenceException: [exceptions],
    });
  }

  public cancelHandler({ sender }: CancelEvent): void {
    this.closeEditor(sender);
  }

  public removeHandler({ sender, dataItem }: RemoveEvent): void {
    if (this.editService.isRecurring(dataItem)) {
      sender
        .openRecurringConfirmationDialog(CrudOperation.Remove)
        // The result will be undefined if the dialog was closed.
        .pipe(filter((editMode) => editMode !== undefined))
        .subscribe((editMode) => {
          this.handleRemove(dataItem, editMode);
        });
    } else {
      sender.openRemoveConfirmationDialog().subscribe((shouldRemove) => {
        if (shouldRemove) {
          this.editService.remove(dataItem);
        }
      });
    }
  }

  public saveHandler({
    sender,
    formGroup,
    isNew,
    dataItem,
    mode,
  }: SaveEvent): void {
    if (formGroup.valid) {
      const formValue = formGroup.value;

      if (isNew) {
        this.editService.create(formValue);
      } else {
        this.handleUpdate(dataItem, formValue, mode);
      }

      this.closeEditor(sender);
    }
  }

  public dragEndHandler({ sender, event, start, end, isAllDay }: {
    sender: SchedulerComponent,
    event: any,
    start: Date,
    end: Date,
    isAllDay: boolean
  }): void {
    let value = { Start: start, End: end, IsAllDay: isAllDay };
    let dataItem = event.dataItem;
    this.handleUpdate(dataItem, value, EditMode.Event);
  }

  public resizeEndHandler({ sender, event, start, end }: {
    sender: SchedulerComponent,
    event: any,
    start: Date,
    end: Date
  }): void {
    let value = { Start: start, End: end };
    let dataItem = event.dataItem;

    this.handleUpdate(dataItem, value, EditMode.Event);

  }

  private closeEditor(scheduler: SchedulerComponent): void {
    scheduler.closeEvent();

    this.formGroup = undefined;
  }

  private handleUpdate(item: any, value: any, mode?: EditMode): void {
    const service = this.editService;
    if (mode === EditMode.Occurrence) {
      if (service.isException(item)) {
        service.update(item, value);
      } else {
        service.createException(item, value);
      }
    } else {
      // The item is non-recurring or we are editing the entire series.
      service.update(item, value);
    }
  }

  private handleRemove(item: any, mode: EditMode): void {
    const service = this.editService;
    if (mode === EditMode.Series) {
      service.removeSeries(item);
    } else if (mode === EditMode.Occurrence) {
      if (service.isException(item)) {
        service.remove(item);
      } else {
        service.removeOccurrence(item);
      }
    } else {
      service.remove(item);
    }
  }

  private seriesDate(head: Date, occurence: Date, current: Date): Date {
    const year =
      occurence.getFullYear() === current.getFullYear()
        ? head.getFullYear()
        : current.getFullYear();
    const month =
      occurence.getMonth() === current.getMonth()
        ? head.getMonth()
        : current.getMonth();
    const date =
      occurence.getDate() === current.getDate()
        ? head.getDate()
        : current.getDate();
    const hours =
      occurence.getHours() === current.getHours()
        ? head.getHours()
        : current.getHours();
    const minutes =
      occurence.getMinutes() === current.getMinutes()
        ? head.getMinutes()
        : current.getMinutes();

    return new Date(year, month, date, hours, minutes);
  }
  public getEventClass = (args: EventStyleArgs) => {
    const eventId = args.event.dataItem.id;
    return eventId % 2 === 0 ? "even-id" : "odd-id";
  };
}
