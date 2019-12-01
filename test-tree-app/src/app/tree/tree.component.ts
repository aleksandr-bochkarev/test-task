import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ArrayType } from '@angular/compiler';
interface ItemFromEvent {
	childCode: string,
	value: boolean
};
interface DataNode {
	code: string,
	description: string,
	nodes: Array<object>,
	isSelected?: boolean,
	showChildren?: boolean
};

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

	constructor() {}

	ngOnInit() {
		this.data.forEach(item => {
			item.showChildren = false;
			item.isSelected = this.isSelected;
		});
	}

	trackByFn(index) {
    return index;
  }

	getNodeByCode(data: Array<object>, code: string) {
		let foundedNode = data.find((element: DataNode) => {
			return element.code === code;
		});

		if (foundedNode) {
			return foundedNode;
		} else {
			data.forEach((node: DataNode) => {
				if (node.nodes.length) {
					return node.nodes.some((node, index, nodes) => this.getNodeByCode(nodes, code));
				}
			});
		}

	}

	getParentCode(item: ItemFromEvent){
		let parentCode = item.childCode.slice(0, -1);
		if (parentCode.substr(-1) === '.') {
			parentCode = parentCode.slice(0, -1);
		};
		return parentCode;
	}

	checkChildrenSelection(parentNode){
		if (parentNode.nodes.every((elem) => elem.isSelected)) {
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

	onNotifyRecieved(item: ItemFromEvent) {
		const parentCode = this.getParentCode(item);
		const parentNode = this.getNodeByCode(this.data, parentCode);

		this.checkChildrenSelection(parentNode);
	}

	toggleView(item: DataNode) {
		item.showChildren = !item.showChildren;
	}

	toggleSelection(item: DataNode) {
		this.toggleSelectionForParentAndAllChildren(item, !item.isSelected);
		
		this.notify.emit({
			childCode: item.code,
			value: !item.isSelected
		});
	}

	toggleSelectionForParentAndAllChildren(item: DataNode, toState: boolean) {
		item.isSelected = toState;
		if (item.nodes.length){
			item.nodes.forEach((element: DataNode) => this.toggleSelectionForParentAndAllChildren(element, toState));
		}
	}

}
