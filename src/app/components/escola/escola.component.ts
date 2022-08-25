import { Component, OnInit, ViewChild } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { MatDialog} from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import * as _ from 'lodash';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { Escola } from '../../core/escola';
import { BaseComponent } from '../../architeture/base/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast/toast.service';
import { PageInfo } from '../../core/page-info';
import { EscolaService } from '../../services/escola/escola.service';
import { FiltroEscola } from '../../core/filtro/filtro-escola';


@Component({
  selector: 'escola',
  templateUrl: './escola.component.html',
  styleUrls: ['./escola.component.css']
})
export class EscolaComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  regioesAdministrativas: Escola[];

  mostrarTabela = false;
  msg: string;

  displayedColumns: string[] = ['codigo', 'nome', 'tipo', 'acoes'];
  dataSource: MatTableDataSource<Escola> = new MatTableDataSource();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  tipoEscolaList: any[] = [
    { tipo: 'Selecione', flag: null },
    { tipo: 'Pública', flag: 'P' },
    { tipo: 'Privada', flag: 'R' }
  ];

  constructor(
    protected formBuilder: FormBuilder,
    private escolaService: EscolaService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
  ) {
    super();
    this.carregarPerfil = new CarregarPerfil();
  }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);
    this.dataSource.paginator = this.paginator;
    this.createForm();
    this.consultar();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      nome: [null],
      tipoEscola: [null],
    });
  }

  limpar() {
    this.mostrarTabela = false;
    this.dataSource.data = [];
    this.form.reset();
  }

  consultar() {
    const pageInfo = new PageInfo();
    if(this.paginator) {
      this.paginator.firstPage();
    }
    this.consultarRegioesAdministrativas(pageInfo);
  }

  private consultarRegioesAdministrativas(pageInfo: PageInfo) {
    const filtro = this.createFiltro();
    this.escolaService.listFilteredAndPaged(pageInfo, filtro)
      .subscribe((resp: any) => {
        this.numberItens = resp.totalElements;
        this.verificaMostrarTabela(resp.content);
      });
  }

  private createFiltro() {
    const filtro = new FiltroEscola();
    filtro.nome = this.getValueForm(this.form, 'nome');
    filtro.tipo = this.getValueForm(this.form, 'tipoEscola');
    return filtro;
  }

  onEventPaginate(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const pageInfo = new PageInfo();
    pageInfo.pageSize = this.pageSize;
    pageInfo.actualPage = this.pageIndex;
    this.consultarRegioesAdministrativas(pageInfo);
  }


  atualizar(escola: Escola) {
    this.router.navigate(['/regiaoadministrativa/cadastrar'], { queryParams: { id: escola.id } });
  }

  deletar(escola: Escola) {
    this.chamaCaixaDialogo(escola);
  }

  chamaCaixaDialogo(escola: Escola) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir a Região Administrativa ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.escolaService.excluir(escola.id).subscribe(() => {
          this.consultar();
        });
      } else {
        dialogRef.close();
      }
    });
  }


  verificaMostrarTabela(rigioesAdministrativas: Escola[]) {
    if (!rigioesAdministrativas || rigioesAdministrativas.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhuma região administrativa encontrada.';
    } else {
      this.mostrarTabela = true;
    }
    this.dataSource.data = rigioesAdministrativas ? rigioesAdministrativas : [];
  }


}

