import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RunsStore} from '../../store/stores.store';
import {RunningDemoService} from '../demo/demo-services';
import {ExplanationRun, PlanRun} from '../../interface/run';
import {Demo} from '../../interface/demo';
import {ADD, EDIT} from '../../store/generic-list.store';
import {IHTTPData} from '../../interface/http-data.interface';
import {PlannerService} from './planner.service';

@Injectable({
    providedIn: 'root'
})
export class DemoPlannerService extends PlannerService {

    myBaseURL = environment.apiURL + 'planner/';

    constructor(
        http: HttpClient,
        store: RunsStore,
        private runningDemoService: RunningDemoService) {
        super(http, store);
        this.BASE_URL = environment.apiURL + 'planner/';
    }

    private findPlan(planPropertiesGoalFacts: string[], demo: Demo): {planProperties: string[], plan: string} {
      let foundPlanObj: {planProperties: string[], plan: string} = null;
      for (const planObj of demo.data.plans) {
        if (planObj.planProperties.length === planPropertiesGoalFacts.length) {
          for (const goalFact of planPropertiesGoalFacts) {
            if (planObj.planProperties.indexOf(goalFact) === -1) {
              break;
            }
            foundPlanObj = planObj;
          }
        }
        if (foundPlanObj) {
          break;
        }
      }
      return foundPlanObj;
    }

    execute_plan_run(run: PlanRun, save = false): void {
        const demo: Demo = this.runningDemoService.getSelectedObject().getValue();

        if (!demo.data.plans || demo.data.plans.length === 0) {
            super.execute_plan_run(run, save);
            return;
        }

        const planPropertiesGoalFacts = run.hardGoals;
        const foundPlanObj = this.findPlan(planPropertiesGoalFacts, demo);

        run.planPath = demo.definition + '/' + foundPlanObj.plan;

        // get all properties which are satisfied by this plan
        run.satPlanProperties = demo.data.satPropertiesPerPlan.filter(p => p.plan === foundPlanObj.plan)[0].planProperties;
        this.listStore.dispatch({type: ADD, data: run});

    }


    private filterMUGS(questionPlanProperties: string[], demo: Demo): string [][] {
      const filteredMugs = [];
      for (const mugs of demo.data.MUGS) {
        for (const propertyGoalFact of questionPlanProperties) {
          if (mugs.indexOf(propertyGoalFact) > -1) {
            const mugsRest = [];
            for (const fact of mugs) {
              if (fact !== propertyGoalFact) {
                mugsRest.push(fact.replace('Atom ', ''));
              }
            }
            if (mugsRest.length !== 0) {
              filteredMugs.push(mugsRest);
            }

            break;
          }
        }
      }
      return filteredMugs;
    }

    execute_mugs_run(planRun: PlanRun, expRun: ExplanationRun, save = false): void {

        const demo: Demo = this.runningDemoService.getSelectedObject().getValue();

        // plan property hard goals which were no hard goals in the plan run
        const questionPlanProperties = expRun.hardGoals.filter(hg => !planRun.hardGoals.some(c => hg === c));

        expRun.mugs = this.filterMUGS(questionPlanProperties, demo);

        planRun.explanationRuns.push(expRun);
        this.listStore.dispatch({type: EDIT, data: planRun});

        if (save) {
            this.save_mugs_run(planRun, expRun);
        }

    }

    private save_mugs_run(planRun: PlanRun, expRun: ExplanationRun): void {
        const url = this.myBaseURL + 'mugs-save/' + planRun._id;

        this.http.post<IHTTPData<PlanRun>>(url, expRun)
            .subscribe(httpData => {
                console.log('Question saved on server.');
                // const action = {type: EDIT, data: httpData.data};
                // this.listStore.dispatch(action);
            });
    }

}