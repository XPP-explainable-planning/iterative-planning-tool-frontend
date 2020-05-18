import { TasktSchemaStore } from './../../../../store/stores.store';
import { TaskSchema } from './../../../../interface/schema';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-nomystery-task-view',
  templateUrl: './nomystery-task-view.component.html',
  styleUrls: ['./nomystery-task-view.component.css']
})
export class NomysteryTaskViewComponent implements OnInit {

@ViewChild('mapSVG') mapSVG: ElementRef;
taskSchema: TaskSchema;


  constructor(private taskSchemaStore: TasktSchemaStore) {}

  ngOnInit(): void {
  }

}