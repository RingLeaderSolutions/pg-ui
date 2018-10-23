import { TableCellRenderer, SortFunction, TextProps, Column, SortingRule } from "react-table";
import { User } from '../../model/Models';
import * as React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import * as cn from "classnames";
import { IsNullOrEmpty } from "../../helpers/extensions/ArrayExtensions";

export const UserCellRenderer: TableCellRenderer = row => {
    if(row.value == null) {
        return  (<p style={ { margin: '0px' } }>None</p>);
    }
    
    return (
    <div className="d-flex">
         <img className="user-avatar rounded-circle mr-2" src={row.value.avatarUrl} style={{height: '30px'}}/>
         <p className="flex-grow-1 m-0"><span className="align-middle">{row.value.firstName} {row.value.lastName}</span></p>
     </div>)
};

export const BooleanCellRenderer: TableCellRenderer = row => {
    if(row.value){
        return (<i className="fas fa-check"></i>)
        
    }
    return (<i className="fas fa-times"></i>)
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

interface PaginationProps extends Partial<TextProps> {
    pages: number;
    page: number | string;
    onPageChange: (page: number) => void;

    showPageSizeOptions: boolean;
    pageSizeOptions: number[];
    pageSize: number;
    onPageSizeChange: (size: number) => void;

    showPageJump: boolean;

    canPrevious: boolean;
    canNext: boolean; 
    
    className?: string;
    style: React.CSSProperties;

    PreviousComponent: React.ReactType;
    NextComponent: React.ReactType;
}

interface PaginationState {
    page: number;
}

const defaultButton = (props: any) => (
    <button type="button" {...props} className="-btn">
      {props.children}
    </button>
  )

export function SortFirstColumn(columns: Column[], order: "desc" | "asc" = "desc"): SortingRule[] {
    if(IsNullOrEmpty(columns)){
        return null;
    }

    return [{
            id: String(columns[0].accessor),
            sort: order
        }];
}

export class NoMatchesComponent extends React.Component<{},{}> {
    render(){
        return <div className="rt-no-search-matches">No matching records found</div>
    }
}

export class ReactTablePagination extends React.Component<Partial<PaginationProps>, PaginationState> {
    constructor(props: Partial<PaginationProps>) {
        super(props);
        this.state = {
            page: Number(this.props.page)
        }

        this.getSafePage = this.getSafePage.bind(this);
        this.changePage = this.changePage.bind(this);
        this.applyPage = this.applyPage.bind(this);
    }

    componentWillReceiveProps (nextProps: Partial<PaginationProps>) {
        if (this.props.page !== nextProps.page) {
          this.setState({ page: Number(nextProps.page) })
        }
      }
    
      getSafePage (page: number) {
        if (Number.isNaN(page)) {
          page = Number(this.props.page)
        }
        return Math.min(Math.max(page, 0), this.props.pages - 1)
      }
    
      changePage (page: number) {
        page = this.getSafePage(page)
        this.setState({ page })
        if (this.props.page !== page) {
          this.props.onPageChange(page)
        }
      }
    
      applyPage (e?: React.FocusEvent<HTMLInputElement>) {
        if (e) {
          e.preventDefault()
        }
        this.changePage(this.state.page);
      }
    
      renderEllipsisPageItem(key: string){
          return (
            <PaginationItem key={key}>
                <PaginationLink className="ellipsis">...</PaginationLink>
            </PaginationItem>
          )
      };

      renderPageItem(page: number, isActive: boolean){
          return (
            <PaginationItem key={`page-${page}`} active={isActive}>
                <PaginationLink onClick={() => this.changePage(page - 1)}>{page}</PaginationLink>
            </PaginationItem>
          )
      }

      renderPageOptions(currentPage: number, maxPage: number){
        if(maxPage === 0 || (currentPage === 0 && maxPage === 1)){
            return null;
        }

          let isActivePage = (page: number): boolean => currentPage == page - 1;

          let pageOptions: JSX.Element[] = [
              this.renderPageItem(1, isActivePage(1))
          ];

          if(currentPage == maxPage || currentPage > maxPage - 5){
              pageOptions.push(this.renderEllipsisPageItem("previous-ellipsis"));
              for (let index = maxPage - 5; index < maxPage; index++) {
                  let latePage = this.renderPageItem(index, isActivePage(index))
                  pageOptions.push(latePage);
              }
          }
          else if(currentPage < 5){
              for (let index = 2; index < 6; index++) {
                  if(index == maxPage){
                      break;
                  }
                  let earlyPage = this.renderPageItem(index, isActivePage(index))
                  pageOptions.push(earlyPage);
              }
              pageOptions.push(this.renderEllipsisPageItem("next-ellipsis"));
          }
          else {
              pageOptions.push(this.renderEllipsisPageItem("previous-ellipsis"));
              pageOptions.push(this.renderPageItem(currentPage - 1, false));
              pageOptions.push(this.renderPageItem(currentPage, true));
              pageOptions.push(this.renderPageItem(currentPage + 1, false));
              pageOptions.push(this.renderEllipsisPageItem("next-ellipsis"));
          }

          let finalPage = this.renderPageItem(maxPage, isActivePage(maxPage));
          pageOptions.push(finalPage);

          return pageOptions;
      }

      render () {
        const {
          // Computed
          pages,
          // Props
          showPageSizeOptions,
          pageSizeOptions,
          pageSize,
          showPageJump,
          canPrevious,
          canNext,
          onPageSizeChange,
          className,
          PreviousComponent = defaultButton,
          NextComponent = defaultButton,
        } = this.props
    
        const page = Number(this.props.page);

        return (
            <div className={cn(className, 'pagination-container', "d-flex", "justify-content-center", "p-2")} style={this.props.style}>
                <Pagination className="m-0">
                    <PaginationItem disabled={!canPrevious} className="previous">
                        <PaginationLink className="previous"
                            onClick={() => {
                                if (!canPrevious) return
                                this.changePage(page - 1)
                            }}>
                                Previous
                        </PaginationLink>
                    </PaginationItem>
                    {this.renderPageOptions(page, pages)}
                    <PaginationItem disabled={!canNext} className="next">
                    <PaginationLink className="next"
                            onClick={() => {
                                if (!canNext) return
                                this.changePage(page + 1)
                            }}>
                                Next
                        </PaginationLink>
                    </PaginationItem>
                </Pagination>
            </div>)
      }
    }

