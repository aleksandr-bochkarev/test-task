import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })

export class FilterPipe implements PipeTransform {
	transform(data, filterParametr) {
		if (filterParametr === undefined) {
			return data;
		}
		return data.filter((element) => {
			return this.isElementIncluded(element, filterParametr);
		})
	}

	isElementIncluded(element, target) {
		let isIncluded = element.description.toLowerCase().includes(target.toLowerCase());

		if (isIncluded) {
			return true;
		} else {
			if (element.nodes.length !== 0) {
				return element.nodes.some((element) => this.isElementIncluded(element, target));
			}
			return false;
		}
	}

}