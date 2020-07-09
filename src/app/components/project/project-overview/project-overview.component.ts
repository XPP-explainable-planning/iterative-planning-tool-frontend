import {takeUntil} from 'rxjs/operators';
import {DemoCreatorComponent} from './../../demo/demo-creator/demo-creator.component';
import {DemosService} from '../../../service/demo/demo-services';
import {PlanRun} from 'src/app/interface/run';
import {RunService} from '../../../service/planner-runs/run-services';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResponsiveService} from 'src/app/service/responsive/responsive.service';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {CurrentProjectService} from 'src/app/service/project/project-services';
import {Observable, Subject} from 'rxjs';
import {PlanProperty} from 'src/app/interface/plan-property/plan-property';
import {Project} from 'src/app/interface/project';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  currentProject: Project;
  properties$: Observable<Map<string, PlanProperty>>;
  runs$: Observable<PlanRun[]>;

  constructor(
    private responsiveService: ResponsiveService,
    private propertiesService: PlanPropertyMapService,
    private currentProjectService: CurrentProjectService,
    public runsService: RunService,
    public demosService: DemosService,
    public dialog: MatDialog) {
      this.properties$ = this.propertiesService.getMap();
      this.currentProjectService.selectedObject$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(project => {
        if (project !== null) {
          this.currentProject = project;
          // this.propertiesService.findCollection([{param: 'projectId', value: project._id}]);
        }
      });
    }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createDemo(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data  = {
      update: false,
      projectId: this.currentProject._id,
    };

    const dialogRef = this.dialog.open(DemoCreatorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
