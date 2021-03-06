import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RunsStore} from '../../store/stores.store';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {PlanRunsService} from './planruns.service';

interface QueryParam {
  param: string;
  value: string;
}

@Injectable({
    providedIn: 'root'
})
export class DemoRunService extends PlanRunsService {

    constructor(
        http: HttpClient,
        store: RunsStore,
        planPropertyMapService: PlanPropertyMapService) {
        super(http, store, planPropertyMapService);
    }

    findCollection(queryParams: QueryParam[] = []) {
        return this.collection$;
    }
}
