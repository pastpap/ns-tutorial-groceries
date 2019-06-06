import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";

import { throwError, pipe } from "rxjs";
import { map, catchError, timeout } from "rxjs/operators";

import { Config } from "../config";
import { Grocery } from "./grocery";

@Injectable()
export class GroceryListService {
  private baseUrl = Config.apiUrl + "appdata/" + Config.appKey + "/Groceries";

  constructor(private http: HttpClient) {}

  public load() {
    return this.http
      .get(this.baseUrl, {
        headers: this.getCommonHeaders()
      })
      .pipe(
        map((data: any[]) => {
          const groceryList = data
            .sort((a, b) => {
              return a._kmd.lmt > b._kmd.lmt ? -1 : 1;
            })
            .map(grocery => new Grocery(grocery._id, grocery.Name));
          return groceryList;
        }),
        timeout(5000),
        catchError(this.handleErrors)
      );
  }
  public add(name: string) {
    return this.http
      .post(this.baseUrl, JSON.stringify({ Name: name }), {
        headers: this.getCommonHeaders()
      })
      .pipe(
        map((data: any) => {
          return new Grocery(data._id, name);
        }),
        catchError(this.handleErrors)
      );
  }
  delete(id: string) {
    return this.http
      .delete(this.baseUrl + "/" + id, { headers: this.getCommonHeaders() })
      .pipe(
        map(res => JSON.stringify(res)),
        catchError(this.handleErrors)
      );
  }
  private getCommonHeaders() {
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Kinvey " + Config.token
    });
  }

  private handleErrors(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }
}
