import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  rates: any[];
  loading = true;
  error: any;
  displayedColumns: string[] = ['id', 'title', 'description', 'price'];
  dataSource = new MatTableDataSource();
  isLoadingResults = true;
  isRateLimitReached = false;
  length: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.fetchItems(0);
  }

  fetchItems(offset: number) {
    this.apollo
      .watchQuery({
        query: gql`
        {
          items(pageInfo: {offset: ${offset ? offset : 0}, limit: ${this.paginator.pageSize}})
          {
            title
            description
            price
            id
          }
        }
      `,
      })
      .valueChanges.subscribe((item: any) => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource(item?.data?.items);
        this.length = 10;
        this.dataSource.sort = this.sort;
      });
  }

  getNext(event: PageEvent) {
    const offset = event.pageSize * event.pageIndex;
    this.fetchItems(offset);
  }
}
