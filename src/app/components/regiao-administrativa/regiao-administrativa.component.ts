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
import { RegiaoAdministrativa } from '../../core/regiao-administrativa';
import { BaseComponent } from '../../architeture/base/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast/toast.service';
import { PageInfo } from '../../core/page-info';
import { RegiaoAdministrativaService } from '../../services/regiao-administrativa/regiao-administrativa.service';
import { FiltroRegiaoAdministrativa } from '../../core/filtro/filtro-regiao-administrativa';


@Component({
  selector: 'regiao-administrativa',
  templateUrl: './regiao-administrativa.component.html',
  styleUrls: ['./regiao-administrativa.component.css']
})
export class RegiaoAdministrativaComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  regioesAdministrativas: RegiaoAdministrativa[];

  mostrarTabela = false;
  msg: string;

  displayedColumns: string[] = ['numero', 'nome', 'acoes'];
  dataSource: MatTableDataSource<RegiaoAdministrativa> = new MatTableDataSource();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  form: FormGroup;

  constructor(
    protected formBuilder: FormBuilder,
    private regiaoAdministrativaService: RegiaoAdministrativaService,
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
    this.regiaoAdministrativaService.listFilteredAndPaged(pageInfo, filtro)
      .subscribe((resp: any) => {
        this.numberItens = resp.totalElements;
        this.verificaMostrarTabela(resp.content);
      });
  }

  private createFiltro() {
    const filtro = new FiltroRegiaoAdministrativa();
    filtro.nome = this.getValueForm(this.form, 'nome');
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


  atualizar(regiaoAdministrativa: RegiaoAdministrativa) {
    this.router.navigate(['/regiaoadministrativa/cadastrar'], { queryParams: { id: regiaoAdministrativa.id } });
  }

  deletar(regiaoAdministrativa: RegiaoAdministrativa) {
    this.chamaCaixaDialogo(regiaoAdministrativa);
  }

  chamaCaixaDialogo(regiaoAdministrativa: RegiaoAdministrativa) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir a Região Administrativa ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.regiaoAdministrativaService.excluir(regiaoAdministrativa.id).subscribe(() => {
          this.consultar();
        });
      } else {
        dialogRef.close();
      }
    });
  }


  verificaMostrarTabela(rigioesAdministrativas: RegiaoAdministrativa[]) {
    if (!rigioesAdministrativas || rigioesAdministrativas.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhuma região administrativa encontrada.';
    } else {
      this.mostrarTabela = true;
    }
    this.dataSource.data = rigioesAdministrativas ? rigioesAdministrativas : [];
  }


}

