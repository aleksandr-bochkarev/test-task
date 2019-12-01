import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { element } from 'protractor';

@Component({
	selector: 'app-tree',
	templateUrl: './tree.component.html',
	styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
	@Input() data;
	@Input() isSelected;
	@Input() searchInput;

	@Output() notify: EventEmitter<object> = new EventEmitter<object>();

	constructor() { }

	ngOnInit() {
		this.data.forEach(obj => {
			obj.showChildren = false;
			obj.isSelected = this.isSelected;
		});
	}

	getNodeByCode(data, code) {
		let foundedNode = data.find(element => {
			return element.code === code;
		});

		if (foundedNode) {
			return foundedNode;
		} else {
			data.forEach(node => {
				if (node.nodes.length) {
					console.log(node.code);
					return node.nodes.some((node, index, nodes) => this.getNodeByCode(nodes, code));
				}
			});
		}

	}

	getParentCode(obj){
		let parentCode = obj.childCode.slice(0, -1);
		if (parentCode.substr(-1) === '.') {
			parentCode = parentCode.slice(0, -1);
		};
		return parentCode;
	}

	checkChildrenSelection(parentNode){
		if (parentNode.nodes.every(elem => elem.isSelected)) {
			parentNode.isSelected = true;

			this.notify.emit({
				childCode: parentNode.code,
				value: true
			});
		} else {
			parentNode.isSelected = false;

			this.notify.emit({
				childCode: parentNode.code,
				value: false
			});
		}
	}

	onNotifyRecieved(obj) {
		const parentCode = this.getParentCode(obj);
		const parentNode = this.getNodeByCode(this.data, parentCode);

		this.checkChildrenSelection(parentNode);
	}

	toggleView(obj) {
		obj.showChildren = !obj.showChildren;
	}

	toggleSelection(obj) {
		if (obj.isSelected !== true) {
			this.toggleSelectionForParentAndAllChildren(obj, true);
			
			this.notify.emit({
				childCode: obj.code,
				value: true
			});
		} else {
			this.toggleSelectionForParentAndAllChildren(obj, false);

			this.notify.emit({
				childCode: obj.code,
				value: false
			});
		}
	}

	toggleSelectionForParentAndAllChildren(obj, toState) {
		obj.isSelected = toState;
		if (obj.nodes.length){
			obj.nodes.forEach(element => this.toggleSelectionForParentAndAllChildren(element, toState));
		}
	}

}
