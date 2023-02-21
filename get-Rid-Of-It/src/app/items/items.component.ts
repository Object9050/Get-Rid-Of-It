import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Item } from '../item.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];
  newItem: any = {};
  selectedItem?: Item;

  /** takes an instance of the ItemService as a parameter and assigns it to a 
   * private property of the class. It's used for dependency injection in Angular. */
  constructor(private itemService: ItemService) { }

  /** Calls getItems() when component has been initialized
   * (So called ngOnInit-lifecycle hook) */  
  ngOnInit(): void {
    this.getItems();
  }

  /** Retrieves the items from the server by calling the 
   * getItems method of the itemService. The items returned 
   * by the server are then assigned to the items property 
   * of the component. */
  getItems(): void {
    this.itemService.getItems()
      .subscribe(itemsFromServer => this.items = itemsFromServer);
  }

  /** Adds a new item to the items array, assigning it a 
   * unique id and a name. The id is generated by the genId() 
   * method and the item is added to the array using the 
   * itemService.addItem() method. */
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    const id = this.genId(this.items);
    this.itemService.addItem({ id, name } as Item)
      .subscribe(newItem => {
        this.items.push(newItem);
      });
  }

  /** Generates an ID depending on the length of the items array 
  * Description: If items.length > 0 ... do Math.max... else set ID as '1'. */
  genId(items: Item[]): string {
    return items.length > 0 ? (Math.max(...items.map(item => +item.id)) + 1).toString() : '1';
  }

  /** OLD-AS-NUMBER // Generate an ID for each new Item */
  // genId(items: Item[]): number {
  //   return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  // }

  /** Subscribes to the DELETE request of ItemService */
  deleteItem(item: Item): void {
    this.itemService.deleteItem(item.id)
      .subscribe(() => {
        this.getItems();
      });
  }
}
