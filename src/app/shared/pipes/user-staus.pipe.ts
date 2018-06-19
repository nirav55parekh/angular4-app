import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userStatus'
})
export class UserStatusPipe implements PipeTransform {

    transform(value: any) {

        switch (value) {
            case 1:
                return "<span class='label label-success'>Approved</span>";
            case true:
                return "<span class='label label-success'>Approved</span>";
            case 2:
                return "<span class='label label-danger'>Not Approved</span>";
            case false:
                return "<span class='label label-danger'>Not Approved</span>";
            default:
                return "<span class='label label-danger'>Not Approved</span>";
        }
    }

}