import {HelpPageComponent} from './components/login/help-page/help-page.component';
import {MainInfoComponent} from './components/login/main-info/main-info.component';
import {Routes} from '@angular/router';
import {MainPageComponent} from './components/login/main-page/main-page.component';
import {UserMainPageComponent} from './components/user/user-main-page/user-main-page.component';
import {ProjectSelectionComponent} from './components/project/project-selection/project-selection.component';
import {ProjectBaseComponent} from './components/project/project-base/project-base.component';
import {ProjectOverviewComponent} from './components/project/project-overview/project-overview.component';
import {PropertyCollectionComponent} from './components/plan_properties/property-collection/property-collection.component';
import {IterativePlanningBaseComponent} from './components/iter-planning/iterative-planning-base/iterative-planning-base.component';
import {IterativePlanningBaseMobileComponent} from './components/iter-planning/mobile/iterative-planning-base-mobile/iterative-planning-base-mobile.component';
import {PlanningStepComponent} from './components/iter-planning/planning-step/planning-step/planning-step.component';
import {FinishedPlanningStepComponent} from './components/iter-planning/planning-step/finished-planning-step/finished-planning-step.component';
import {QuestionStepComponent} from './components/iter-planning/question-step/question-step/question-step.component';
import {FinishedQuestionStepComponent} from './components/iter-planning/question-step/finished-question-step/finished-question-step.component';
import {AnimationSettingsComponent} from './components/animation/animation-settings/animation-settings.component';
import {DemoSelectionComponent} from './components/demo/demo-selection/demo-selection.component';
import {DemoBaseComponent} from './components/demo/demo-base/demo-base.component';
import {FilesCollectionComponent} from './components/files/files-collection/files-collection.component';
import {UserStudySelectionComponent} from './components/user-study/user-study-selection/user-study-selection.component';
import {UserStudyCreatorComponent} from './components/user-study/user-study-creator/user-study-creator.component';
import {UserStudyBaseComponent} from './components/user-study/user-study-base/user-study-base.component';
import {UserStudyStartComponent} from './components/user-study/user-study-start/user-study-start.component';
import {UserStudyExecuterComponent} from './components/user-study/user-study-executer/user-study-executer.component';
import {UserStudyEndComponent} from './components/user-study/user-study-end/user-study-end.component';
import {AuthGuard} from './route-guards/auth-guard.guard';

export const appRoutes: Routes = [
  { path: '', component: MainPageComponent},
  { path: 'info', component: MainInfoComponent},
  { path: 'help', component: HelpPageComponent},
  { path: 'overview', component: UserMainPageComponent, canActivate: [AuthGuard]},
  { path: 'projects', component: ProjectSelectionComponent , canActivate: [AuthGuard]},
  { path: 'projects/:projectid', component: ProjectBaseComponent, canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: ProjectOverviewComponent},
      { path: 'properties', component: PropertyCollectionComponent},
      { path: 'iterative-planning', component: IterativePlanningBaseComponent,
        children: [
          { path: 'run-overview-mobile', component: IterativePlanningBaseMobileComponent},
          { path: 'new-planning-step', component: PlanningStepComponent},
          { path: 'planning-step/:runid', component: FinishedPlanningStepComponent},
          { path: 'planning-step/:runid/new-question', component: QuestionStepComponent},
          { path: 'planning-step/:runid/question-step/:expid', component: FinishedQuestionStepComponent},
        ]
      },
      { path: 'animation-settings', component: AnimationSettingsComponent},
    ]
  },
  { path: 'demos', component: DemoSelectionComponent},
  { path: 'demos/:demoid', component: DemoBaseComponent,
    children: [
      { path: 'new-planning-step', component: PlanningStepComponent},
      { path: 'planning-step/:runid', component: FinishedPlanningStepComponent},
      { path: 'planning-step/:runid/new-question', component: QuestionStepComponent},
      { path: 'planning-step/:runid/question-step/:expid', component: FinishedQuestionStepComponent}
    ]
  },
  { path: 'user-studies', component: UserStudySelectionComponent},
  { path: 'user-studies/new-user-study', component: UserStudyCreatorComponent},
  { path: 'user-studies/:userStudyId', component: UserStudyBaseComponent,
      children: [
        { path: 'info', component: UserStudyCreatorComponent},
        { path: 'start', component: UserStudyStartComponent},
        { path: 'exec', component: UserStudyExecuterComponent,
            children: [
              { path: 'new-planning-step', component: PlanningStepComponent},
              { path: 'planning-step/:runid', component: FinishedPlanningStepComponent},
              { path: 'planning-step/:runid/new-question', component: QuestionStepComponent},
              { path: 'planning-step/:runid/question-step/:expid', component: FinishedQuestionStepComponent}
            ]
        },
        { path: 'end', component: UserStudyEndComponent},
      ]
  },
  { path: 'pddl-database', component: FilesCollectionComponent, canActivate: [AuthGuard]},
];
