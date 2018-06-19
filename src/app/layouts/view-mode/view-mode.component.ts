import { Component, OnInit, Input,PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}

@Component({
  selector: 'view-mode',
  templateUrl: './view-mode.component.html',
  styles: []
})
export class ViewModeComponent implements OnInit {

  @Input('') details;
  @Input('') title;
  constructor() { }

  ngOnInit() {
  }

}
