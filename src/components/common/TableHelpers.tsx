import { TableCellRenderer, SortFunction } from "react-table";
import { User } from '../../model/Models';
import * as React from "react";

export const UserCellRenderer: TableCellRenderer = row => {
    if(row.value == null) {
        return  (<p style={ { margin: '0px' } }>None</p>);
    }
    
    return (<div className="user">
         <img className="avatar" src={row.value.avatarUrl} />
         <p>{row.value.firstName} {row.value.lastName}</p>
     </div>)
};

export const BooleanCellRenderer: TableCellRenderer = row => {
    if(row.value){
        return (<span data-uk-icon="icon: check"></span>)
    }
    return (<span data-uk-icon="icon: close"></span>)    
};

export const UserSorter: SortFunction = (a: User, b: User) => {
    var compareResult = a.firstName.toLocaleLowerCase().localeCompare(b.firstName.toLocaleLowerCase());
    if(compareResult == 0){
        var secondNameResult = a.lastName.toLocaleLowerCase().localeCompare(b.lastName.toLocaleLowerCase());
        switch(secondNameResult){
            case 1:
                return 1;
            case -1:
                return -1;
            default:
                return 0;
        }
    }
    switch(compareResult){
        case 1:
            return 1;
        case -1:
            return -1;
        default:
            return 0;
    }
  }

  
