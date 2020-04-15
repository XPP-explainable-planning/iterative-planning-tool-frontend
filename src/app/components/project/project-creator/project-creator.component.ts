import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {PddlFilesService} from '../../../_service/pddl-files.service';
import {Observable} from 'rxjs';
import {PDDLFile} from '../../../_interface/pddlfile';
import {DomainFilesService, ProblemFilesService} from '../../../_service/pddl-file-services';
import {PlanPropertyCollectionService, ProjectsService} from '../../../_service/general-services';
import {Project} from '../../../_interface/project';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-project-creator',
  templateUrl: './project-creator.component.html',
  styleUrls: ['./project-creator.component.css']
})
export class ProjectCreatorComponent implements OnInit {

  // form fields
  projectForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
  });

  domainFiles$: Observable<PDDLFile[]>;
  problemFiles: Observable<PDDLFile[]>;

  selectedDomain: PDDLFile;
  selectedProblem: PDDLFile;

  projects$: Observable<Project[]>;


  constructor(private domainFilesService: DomainFilesService,
              private problemFilesService: ProblemFilesService,
              private projectService: ProjectsService,
              public dialogRef: MatDialogRef<ProjectCreatorComponent>) {
    this.domainFiles$ = this.domainFilesService.files$;
    this.problemFiles = this.problemFilesService.files$;
    this.projects$ = this.projectService.collection$;
  }

  ngOnInit(): void {
    this.domainFilesService.findFiles().subscribe();
    this.problemFilesService.findFiles().subscribe();
  }

  onSave(): void {
    console.log('Save project');
    const newProject: Project = {
      _id: null,
      name: this.projectForm.controls.name.value,
      description: this.projectForm.controls.description.value,
      domainFile: this.selectedDomain,
      problemFile: this.selectedProblem,
      properties: [],
    };

    console.log('Save new Project: ');
    console.log(newProject);

    this.projectService.saveObject(newProject);

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

}
