import {Component, EventEmitter, Input, Output} from '@angular/core';
import * as _ from 'lodash';
import {startCase} from 'lodash';
import {Router, RouterModule} from "@angular/router";


@Component({
  selector: 'grid-component',
  standalone:true,
  imports: [
    RouterModule
  ],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {

  gridColumnConfig: any[] = [];
  @Input() titleGridVisible: boolean = false;
  @Input() titleGrid : string = '';
  @Input() dataSource: any[] = [];
  @Input() columns: string[] = [];
  @Input() routerByEditDblClick: boolean = false;

  @Output() dblClickLine = new EventEmitter<any>();

  private _typeDataSource:any;


  get typeDataSource(): any {
    return this._typeDataSource;
  }


  @Input()
  set typeDataSource(value: any) {
    if (!value || _.isEqual(value, this._typeDataSource)) return;

    this._typeDataSource = value;

    const ctor = value.constructor as any;
    const cols = ctor.__grid_columns__;

    if (Array.isArray(cols)) {
      this.gridColumnConfig = cols
        .filter(c => !c.hidden)
        .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

      this.columns = this.gridColumnConfig.map(c => c.key);
    }
  }

  constructor(private router: Router) {

  }

  /** Metodo responsavel por formatar datas
   *
   * @param value
   */
  formatDate(value: any): string {
    if (!value) {
      return '';
    }

    let date: Date;

    // Se já for Date
    if (value instanceof Date) {
      date = value;
    }
    // Se vier como string yyyy-MM-dd ou yyyy-MM-ddTHH:mm:ss
    else if (typeof value === 'string') {
      const parsed = new Date(value);
      if (isNaN(parsed.getTime())) {
        return value;
      }
      date = parsed;
    }
    // Se vier como timestamp
    else if (typeof value === 'number') {
      date = new Date(value);
    } else {
      return value;
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();

    return `${d}/${m}/${y}`;
  }

  formatTitle(col: string): string {
    if (!col) return '';
    return startCase(col.replace(/[._]/g, ' '));
  }

  applyMask(value: any, mask: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    const onlyNumbers = value.toString().replace(/\D/g, '');
    let result = '';
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < onlyNumbers.length; i++) {
      if (mask[i] === '0') {
        result += onlyNumbers[valueIndex];
        valueIndex++;
      } else {
        result += mask[i];
      }
    }

    return result;
  }

  editItem(row: any) {
    if(this.routerByEditDblClick && row?.id){
      const currentUrl = this.router.url;
      const newUrl = `${currentUrl}/editar/${row?.id}`;
      this.router.navigateByUrl(newUrl);

    }
    this.dblClickLine.emit(row);
  }

  formatByType(value: any, col: any) {

    if (value == null) return '';

    switch (col.type) {

      case 'date':
        return this.formatDate(value);

      case 'documento':
        if (value.toString().length <= 11) {
        return this.applyMask(value, col.mask ?? '000.000.000-00');
      }
        else {
        return this.applyMask(value, col.mask ?? '00.000.000/0000-00 ');}

      case 'telefone':
        return this.applyMask('11987654321', '(00) 00000-0000');

      case 'enum':
        return value;

      case 'boolean':
        return value == true ? 'Sim' : 'Não'

      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);

      default:
        return value;
    }
  }
}
