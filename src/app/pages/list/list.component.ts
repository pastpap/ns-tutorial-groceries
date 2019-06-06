import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone
} from "@angular/core";
import { Grocery } from "../../shared/grocery/grocery";
import { GroceryListService } from "../../shared/grocery/grocery-list.service";
import { TextField } from "tns-core-modules/ui/text-field";

import * as SocialShare from "nativescript-social-share";

@Component({
  selector: "list",
  providers: [GroceryListService],
  templateUrl: "list.component.html",
  styleUrls: ["list-common.css", "list.css"]
})
export class ListComponent implements OnInit {
  public groceryList: Grocery[] = [];
  public grocery = "";
  public isLoading = false;
  public listLoaded = false;
  @ViewChild("groceryTextField") groceryTextField: ElementRef;

  constructor(
    private groceryListService: GroceryListService,
    private zone: NgZone
  ) {}

  public ngOnInit() {
    this.isLoading = true;
    this.groceryListService.load().subscribe(
      loadedGroceries => {
        loadedGroceries.forEach(groceryObject => {
          this.groceryList.unshift(groceryObject);
        });
        this.isLoading = false;
        this.listLoaded = true;
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  public add() {
    this.isLoading = true;
    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    this.groceryListService.add(this.grocery).subscribe(
      groceryObject => {
        this.groceryList.unshift(groceryObject);
        this.grocery = "";
        this.isLoading = false;
      },
      () => {
        alert({
          message: "And error occurred while adding an item to your list.",
          okButtonText: "OK"
        });
        // this.grocery = "";
        this.isLoading = false;
      }
    );
  }
  delete(grocery: Grocery) {
    this.groceryListService.delete(grocery.id).subscribe(() => {
      // Running the array splice in a zone ensures that change detection gets triggered.
      this.zone.run(() => {
        let index = this.groceryList.indexOf(grocery);
        this.groceryList.splice(index, 1);
      });
    });
  }
  public share() {
    const list = [];
    for (let i = 0, size = this.groceryList.length; i < size; i++) {
      list.push(this.groceryList[i].name);
    }
    const listString = list.join(", ").trim();
    SocialShare.shareText(listString);
  }
}
