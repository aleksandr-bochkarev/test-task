import { Component } from '@angular/core';
import { DataService } from './data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [DataService]
})
export class AppComponent {
	title = 'tree-test-app';
	data: any = [];
	searchInput: string;
	
	constructor(private dataService: DataService) {};

	ngOnInit() {
		this.fetchData();
	}

	fetchData() {
		this.dataService.getData().subscribe((data) => this.data = data);
	}

}
