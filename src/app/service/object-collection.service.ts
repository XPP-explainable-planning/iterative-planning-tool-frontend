import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ADD, EDIT, ListStore, LOAD, REMOVE} from '../store/generic-list.store';
import {IHTTPData} from '../interface/http-data.interface';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Goal, GoalType} from '../interface/goal';
import * as assert from 'assert';



type Id = string | number;
interface Identifiable {
  _id?: Id;
}
interface QueryParam {
  param: string;
  value: string;
}



@Injectable({
  providedIn: 'root'
})
export class ObjectCollectionService<T extends Identifiable> {

  BASE_URL = environment.apiURL;
  readonly collection$: BehaviorSubject<T[]>;

  http: HttpClient;
  listStore: ListStore<T>;

  constructor(http: HttpClient, listStore: ListStore<T>) {
    this.http = http;
    this.listStore = listStore;
    this.collection$ = listStore.items$;
  }


  pipeFindData = map((value: IHTTPData<T[]>): T[] =>  value.data);
  pipeGetData = map((value: IHTTPData<T>): T => value.data);

  pipeFind = map((value: T[]): T[] =>  value);
  pipeGet = map((value: T): T => value);

  findCollection(queryParams: QueryParam[] = []) {
    let httpParams = new HttpParams();
    for ( const  qp of queryParams) {
      httpParams = httpParams.set(qp.param, qp.value);
    }

    this.http.get<IHTTPData<T[]>>(this.BASE_URL, {params: httpParams}).pipe(this.pipeFindData, this.pipeFind)
      .subscribe((res) => {
        this.listStore.dispatch({type: LOAD, data: res});
      });

    return this.collection$;
  }

  getObject(id: number | string): Observable<T> {
    console.assert(id != null);
    return this.http.get<IHTTPData<T>>(this.BASE_URL + id).pipe(this.pipeGetData, this.pipeGet);
  }

  copyObject(object: T) {
    assert(object._id);
    return this.http.post<IHTTPData<T>>(this.BASE_URL + object._id, object)
      .subscribe(httpData => {
        console.log('Result Post:');
        console.log(httpData.data);
        const action = {type: ADD, data: httpData.data};
        this.listStore.dispatch(action);
      });
  }

  saveObject(object: T) {

    console.log('Service save object:');
    console.log(object);

    if (object._id) {
      return this.http.put<IHTTPData<T>>(this.BASE_URL + object._id, object)
        .subscribe(httpData => {
          assert(httpData !== undefined);
          const action = {type: EDIT, data: httpData.data};
          this.listStore.dispatch(action);
        });
    }

    return this.http.post<IHTTPData<T>>(this.BASE_URL, object)
      .subscribe(httpData => {
        assert(httpData !== undefined);
        console.log('Result Post:');
        console.log(httpData);
        const action = {type: ADD, data: httpData.data};
        this.listStore.dispatch(action);
      });
  }

  saveAndUpdateObject(object: T) {
    assert(! object._id);

    const action1 = {type: ADD, data: object};
    this.listStore.dispatch(action1);
    return this.http.post<IHTTPData<T>>(this.BASE_URL, object)
      .subscribe(httpData => {
        console.log('Result Post:');
        console.log(httpData.data);
        const action2 = {type: EDIT, data: httpData.data};
        this.listStore.dispatch(action2);
      });
  }

  deleteObject(object: T) {
    console.log('Delete : ' + object._id);
    return this.http.delete(this.BASE_URL + object._id)
      .subscribe(response => {
        console.log('Delete File response');
        this.listStore.dispatch({type: REMOVE, data: object});
      });
  }
}