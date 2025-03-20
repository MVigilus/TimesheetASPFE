import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { DatePipe, NgClass } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FeatherIconsComponent } from "@shared/components/feather-icons/feather-icons.component";
import { MAT_DATE_LOCALE, MatOption, MatRippleModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from "@shared";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { Direction } from "@angular/cdk/bidi";
import { Impiegatolist } from "@core/models/admin/impiegatolist.model";
import { AdvanceTableService } from "@core/service/advance-table.service";
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from "@angular/common/http";
import { ImpiegatoFormComponent } from "./impiegato-form-component/impiegato-form-component.component";
import { DeleteImpiegatoFormComponentComponent } from "./delete-impiegato-form-component/delete-impiegato-form-component.component";
import { confirmModal } from "@core/utils/functions";
import { MatSelect } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
import { MatSlideToggle, MatSlideToggleChange } from "@angular/material/slide-toggle";

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
    MatSelect,
    FormsModule,
    MatOption,
  ],
  templateUrl: './gestione-utente.component.html',
  styleUrl: './gestione-utente.component.scss'
})
export class GestioneUtenteComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  displayedColumns = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'nominativo', label: 'Nominativo', type: 'text', visible: true },
    { def: 'codice_fiscale', label: 'Codice Fiscale', type: 'text', visible: true },
    { def: 'data_assunzione', label: 'Data Assunzione', type: 'date', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'ore_permesso', label: 'Ore Permesso', type: 'text', visible: true },
    { def: 'ore_ferie', label: 'Ore Ferie', type: 'text', visible: true },
    { def: 'giorniPermesso', label: 'Ore Permesso Prec.', type: 'text', visible: true },
    { def: 'giorniFerie', label: 'Ore Ferie Prec.', type: 'text', visible: true },
    { def: 'ore_lavorative', label: 'Ore Lavorative', type: 'text', visible: true },
    { def: 'rimborsoKm', label: 'Rimborso Km', type: 'gender', visible: true },
    { def: 'actions', label: ' ', type: 'actionBtn', visible: true },
  ];

  exampleDatabase?: AdvanceTableService;
  dataSource = new MatTableDataSource<Impiegatolist>([]);
  selection = new SelectionModel<Impiegatolist>(true, []);
  id?: number;
  advanceTable?: Impiegatolist;
  checkedFR: boolean = false;
  isLoading = true;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    public dialog: MatDialog,
    public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    this.openDialog('add');
  }

  openDialog(action: 'add' | 'edit', data?: Impiegatolist) {
    const varDirection: Direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';
    const dialogRef = this.dialog.open(ImpiegatoFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { advanceTable: data, action },
      direction: varDirection,
      autoFocus: false,
    });

    this.subs.sink=dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        this.refreshTable();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'black',
          `${action === 'add' ? 'Add' : 'Edit'} Record Successfully...!!!`,
          'bottom',
          'center'
        );
      }
    });
  }

  private updateRecord(updatedRecord: Impiegatolist) {
    const index = this.dataSource.data.findIndex((record) => record.id === updatedRecord.id);
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  resetImp(row: Impiegatolist) {
    confirmModal('Sei sicuro di voler ripristinare il seguente Impiegato?', row.nominativo)
      .then((res) => {
        if (res.value) {
          this.subs.sink=this.advanceTableService.deleteAdvanceTable(row.id).subscribe({
            next: () => {
              this.showNotification('snackbar-danger', 'TABLES.ADMIN.GESTIONEIMP.SETFRR', 'bottom', 'center');
            },
            error: () => {
              this.showNotification('snackbar-danger', 'QUALCOSA è ANDATO STORTO', 'bottom', 'center');
            },
            complete: () => {
              this.loadData();
            }
          });
        }
      });
  }

  deleteItem(row: Impiegatolist) {
    const dialogRef = this.dialog.open(DeleteImpiegatoFormComponentComponent, { data: row });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex((x) => x.id === this.id);
        if (foundIndex != null && this.exampleDatabase) {
          const service$ = this.checkedFR ?
            this.advanceTableService.deleteAdvanceTableImp(row.id) :
            this.advanceTableService.deleteAdvanceTable(row.id);

          this.subs.sink=service$.subscribe({
            next: () => {
              this.showNotification('snackbar-danger', this.checkedFR ? 'TABLES.ADMIN.GESTIONEIMP.DELETEFORM' : 'TABLES.ADMIN.GESTIONEIMP.SETFR', 'bottom', 'center');
            },
            error: () => {
              this.showNotification('snackbar-danger', 'QUALCOSA è ANDATO STORTO', 'bottom', 'center');
            },
            complete: () => {
              this.dataSource.data = this.dataSource.data.filter((record) => record.id !== row.id);
              this.refreshTable();
            }
          });
        }
      }
    });
  }

  editCall(row: Impiegatolist) {
    this.openDialog('edit', row);
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter((item) => !this.selection.selected.includes(item));
    this.selection.clear();
    this.showNotification('snackbar-danger', `${totalSelect} Record(s) Deleted Successfully...!!!`, 'bottom', 'center');
  }

  loadData() {
    this.isLoading = true;
    const service$ = this.checkedFR ?
      this.advanceTableService.getAllAdvanceTablesFR() :
      this.advanceTableService.getAllAdvanceTables();

    this.subs.sink=service$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: Impiegatolist, filter: string) =>
          Object.values(data).some((value) => value.toString().toLowerCase().includes(filter));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  showNotification(colorName: string, text: string, placementFrom: MatSnackBarVerticalPosition, placementAlign: MatSnackBarHorizontalPosition) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      'ID': x.id,
      'Nominativo': x.nominativo,
      'Codice Fiscale': x.codice_fiscale,
      'Data Assunzione': x.data_assunzione.toString(),
      'Rimborso': x.rimborso ? "Si" : "No",
      'Ore Permesso': x.ore_permesso,
      'Ore Ferie': x.ore_ferie,
      'Ore Lavorative': x.ore_lavorative,
      'Role': x.role,
      'Email': x.email
    }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  onContextMenu(event: MouseEvent, item: Impiegatolist) {
    event.preventDefault();
    this.contextMenuPosition = { x: `${event.clientX}px`, y: `${event.clientY}px` };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  visualizzaFR($event: MatSlideToggleChange) {
    this.checkedFR = $event.checked;
    this.loadData();
  }
}
