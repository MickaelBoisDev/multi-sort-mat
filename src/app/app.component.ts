import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  revenues: number;
  [key: string]: string | number;
}

interface SortState {
  column: string;
  direction: 'asc' | 'desc' | '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'multi-sort-mat';

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'role',
    'revenues',
  ];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  sortStates: SortState[] = [];

  sortInput: string = '';

  constructor() {}
  ngOnInit(): void {
    const users: UserData[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Admin',
        revenues: 24,
      },
      {
        id: '1',
        firstName: 'Tonny',
        lastName: 'James',
        role: 'Admin',
        revenues: 2542,
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: 'Developer',
        revenues: 414,
      },
      {
        id: '3',
        firstName: 'David',
        lastName: 'Davis',
        role: 'Manager',
        revenues: 24,
      },
      {
        id: '4',
        firstName: 'Emily',
        lastName: 'Johnson',
        role: 'Analyst',
        revenues: 43,
      },
      {
        id: '5',
        firstName: 'Alex',
        lastName: 'Miller',
        role: 'Admin',
        revenues: 777,
      },
    ];
    this.dataSource = new MatTableDataSource(users);
    this.dataSource.filterPredicate = (data: UserData, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

      const fieldsToFilter = [
        data.firstName.toLowerCase(),
        data.lastName.toLowerCase(),
        data.role.toLowerCase(),
      ];

      return fieldsToFilter.some((field) => field.includes(transformedFilter));
    };
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSortChange(column: string, direction: 'asc' | 'desc' | '') {
    const existingIndex = this.sortStates.findIndex((s) => s.column === column);

    if (existingIndex > -1) {
      if (direction) {
        this.sortStates[existingIndex].direction = direction;
      } else {
        this.sortStates.splice(existingIndex, 1);
      }
    } else if (direction) {
      this.sortStates.push({ column, direction });
    }

    this.dataSource.data = this.multiSortData(this.dataSource.data);
  }

  multiSortData(data: UserData[]): UserData[] {
    return data.sort((a, b) => {
      for (const sortState of this.sortStates) {
        const valueA = a[sortState.column];
        const valueB = b[sortState.column];
        const sortDirection = sortState.direction === 'asc' ? 1 : -1;

        if (valueA < valueB) {
          return -1 * sortDirection;
        } else if (valueA > valueB) {
          return 1 * sortDirection;
        }
      }
      return 0;
    });
  }
}
