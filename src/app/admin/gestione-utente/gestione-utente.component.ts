import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {DatePipe, formatDate, NgClass} from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";
import {MAT_DATE_LOCALE, MatRippleModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter} from "@shared";
import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Direction} from "@angular/cdk/bidi";
import {Impiegatolist} from "@core/models/admin/impiegatolist.model";
import {AdvanceTableService} from "@core/service/advance-table.service";
import {BehaviorSubject, fromEvent, merge, Observable, Subscription} from 'rxjs';
import {map} from "rxjs/operators";
import {HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ImpiegatoFormComponent} from "./impiegato-form-component/impiegato-form-component.component";
import {JwtInterceptor} from "@core/interceptor/jwt.interceptor";
import {ErrorInterceptor} from "@core/interceptor/error.interceptor";
import {AuthService} from "@core";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";
import {
  DeleteImpiegatoFormComponentComponent
} from "./delete-impiegato-form-component/delete-impiegato-form-component.component";
import {confirmModal} from "@core/utils/functions";

@Component({
  selector: 'app-gestione-utente',
  standalone: true,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'it-IT' }],
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
    MatSlideToggle,
  ],
  templateUrl: './gestione-utente.component.html',
  styleUrl: './gestione-utente.component.scss'
})
export class GestioneUtenteComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
    'select',
    'nominativo',
    'codice_fiscale', // added as per interface
    'data_assunzione', // added as per interface
    'email',
    'rimborso', // added as per interface
    'ore_permesso', // added as per interface
    'ore_ferie', // added as per interface
    'ore_permesso_prec', // added as per interface
    'ore_ferie_prec', // added as per interface
    'ore_lavorative', // commenting out as it was not mentioned in the message
    'rimborsoKm', // added as per interface
    'actions',
  ];
  exampleDatabase?: AdvanceTableService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Impiegatolist>(true, []);
  id?: number;
  advanceTable?: Impiegatolist;
  checkedFR:boolean=false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ImpiegatoFormComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase?.dataChange.value.unshift(
          this.advanceTableService.getDialogData()
        );
        this.loadData()
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }
  editCall(row: Impiegatolist) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ImpiegatoFormComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.advanceTableService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            'black',
            'Impiegato Modificato con Successo',
            'top',
            'center'
          );
        }
      }
    });
  }

  resetImp(row:Impiegatolist){
    let title=""
      confirmModal('Sei sicuro di voler ripristinare il seguente Impiegato?',row.nominativo)
        .then((res)=>{
        if (res.value) {
          this.advanceTableService.deleteAdvanceTable(row.id).subscribe({
            next:(res)=>{
              title='TABLES.ADMIN.GESTIONEIMP.SETFRR'
            },
            error:(res)=>{
              title='QUALCOSA è ANdato storto'
            },
            complete:()=>{
              this.loadData()
              this.showNotification(
                'snackbar-danger',
                title,
                'bottom',
                'center'
              );
            }
          })
        }
    });
  }

  deleteItem(row: any) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    row.checkedFR=this.checkedFR
    const dialogRef = this.dialog.open(DeleteImpiegatoFormComponentComponent, {
      data: row,
      direction: tempDirection,
    });
    console.log("ok")
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        let title="";
        if (foundIndex != null && this.exampleDatabase) {
          let sub:Subscription;
          if(!this.checkedFR){this.advanceTableService.deleteAdvanceTable(row.id).subscribe({
              next: (data) => {
                title="TABLES.ADMIN.GESTIONEIMP.SETFR"
              },
              error:(error: HttpErrorResponse) => {
                title='QUALCOSA è ANdato storto'
              },
              complete:()=>{
                this.refreshTable();
                this.showNotification(
                  'snackbar-danger',
                  title,
                  'bottom',
                  'center'
                );
              }
            });
          }else{this.advanceTableService.deleteAdvanceTableImp(row.id).subscribe({
              next: (data) => {
                title="TABLES.ADMIN.GESTIONEIMP.DELETEFORM"
              },
              error:(error: HttpErrorResponse) => {
                title='QUALCOSA è ANdato storto'
              },
            complete:()=>{
              this.refreshTable();
              this.showNotification(
                'snackbar-danger',
                title,
                'bottom',
                'center'
              );
            }
            });
          }
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        }
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    if(this.checkedFR){
      this.selection.selected.forEach((item) => {
        const index: number = this.dataSource.renderedData.findIndex(
          (d) => d === item
        );
        this.exampleDatabase?.dataChange.value.splice(index, 1);
        this.advanceTableService.deleteAdvanceTable(item.id)
        this.selection = new SelectionModel<Impiegatolist>(true, []);
      });
    }else{
      this.selection.selected.forEach((item) => {
        const index: number = this.dataSource.renderedData.findIndex(
          (d) => d === item
        );
        this.exampleDatabase?.dataChange.value.splice(index, 1);
        this.advanceTableService.deleteAdvanceTableImp(item.id)
        this.selection = new SelectionModel<Impiegatolist>(true, []);
      });
    }

    this.refreshTable();
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' TABLES.ADMIN.GESTIONEIMP.DELETEFORM',
      'bottom',
      'center'
    );
  }

  public loadData() {
    this.exampleDatabase = new AdvanceTableService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort,
      this.checkedFR
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        'ID': x.id,
        'Nominativo': x.nominativo,
        'Codice Fiscale': x.codice_fiscale,
        'Data Assunzione':  x.data_assunzione.toString(),
        'Rimborso': (x.rimborso)?"Si":"No",
        'Ore Permesso': x.ore_permesso,
        'Ore Ferie': x.ore_ferie,
        'Ore Lavorative': x.ore_lavorative,
        'Role': x.role,
        'Email': x.email
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  // context menu
  onContextMenu(event: MouseEvent, item: Impiegatolist) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }


  visualizzaFR($event: MatSlideToggleChange) {
    this.checkedFR=$event.checked
    this.loadData()
  }

}
export class ExampleDataSource extends DataSource<Impiegatolist> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Impiegatolist[] = [];
  renderedData: Impiegatolist[] = [];
  constructor(
    public exampleDatabase: AdvanceTableService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    private checked:boolean
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Impiegatolist[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    if(!this.checked){
      this.exampleDatabase.getAllAdvanceTables();
    }else {
      this.exampleDatabase.getAllAdvanceTablesFR();
    }
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((advanceTable: Impiegatolist) => {
            const searchStr = (
              advanceTable.nominativo +
              advanceTable.codice_fiscale +
              advanceTable.data_assunzione +
              advanceTable.rimborso +
              advanceTable.ore_permesso +
              advanceTable.ore_ferie +
              advanceTable.ore_lavorative +
              advanceTable.role +
              advanceTable.email
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {
    //disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: Impiegatolist[]): Impiegatolist[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string | Date | boolean = '';
      let propertyB: number | string | Date | boolean = '';

      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'nominativo':
          [propertyA, propertyB] = [a.nominativo, b.nominativo];
          break;
        case 'codice_fiscale':
          [propertyA, propertyB] = [a.codice_fiscale, b.codice_fiscale];
          break;
        case 'data_assunzione':
          [propertyA, propertyB] = [a.data_assunzione, b.data_assunzione];
          break;
        case 'rimborso':
          [propertyA, propertyB] = [a.rimborso, b.rimborso];
          break;
        case 'ore_permesso':
          [propertyA, propertyB] = [a.ore_permesso, b.ore_permesso];
          break;
        case 'ore_ferie':
          [propertyA, propertyB] = [a.ore_ferie, b.ore_ferie];
          break;
        case 'ore_lavorative':
          [propertyA, propertyB] = [a.ore_lavorative, b.ore_lavorative];
          break;
        case 'email':
          [propertyA, propertyB] = [a.email, b.email];
          break;
        // Add more case statements for other properties as necessary
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }

}
