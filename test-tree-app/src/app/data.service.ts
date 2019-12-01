import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

	constructor(private http: HttpClient) { }
	
	// dataUrl = 'http://127.0.0.1:8080/';
	dataUrl = '/data';

	getData() {
		return this.http.get(this.dataUrl);
	}
}
