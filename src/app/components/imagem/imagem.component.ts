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
import { BaseComponent } from '../../architeture/base/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast/toast.service';
import { PageInfo } from '../../core/page-info';
import { ArquivoMetadados } from '../../core/arquivo-metadado';
import { ArquivoInstituicaoService } from '../../services/arquivo/arquivo-instituicao.service';


@Component({
  selector: 'imagem',
  templateUrl: './imagem.component.html',
  styleUrls: ['./imagem.component.css']
})
export class ImagemComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  imagens: ArquivoMetadados[];

  mostrarTabela = false;
  msg: string;

  displayedColumns: string[] = ['nome', 'tipo', 'acoes'];
  dataSource: MatTableDataSource<ArquivoMetadados> = new MatTableDataSource();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  constructor(
    protected formBuilder: FormBuilder,
    private arquivoInstituicaoService: ArquivoInstituicaoService,
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
    this.consultar();
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
    this.consultarImagens(pageInfo);
  }

  private consultarImagens(pageInfo: PageInfo) {
    this.verificaMostrarTabela([]);
    // this.imagemService.listFilteredAndPaged(pageInfo, filtro)
    //   .subscribe((resp: any) => {
    //     this.numberItens = resp.totalElements;
    //     this.verificaMostrarTabela(resp.content);
    //   });
  }


  onEventPaginate(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const pageInfo = new PageInfo();
    pageInfo.pageSize = this.pageSize;
    pageInfo.actualPage = this.pageIndex;
    this.consultarImagens(pageInfo);
  }


  deletar(imagem: ArquivoMetadados) {
    this.chamaCaixaDialogo(imagem);
  }

  chamaCaixaDialogo(imagem: ArquivoMetadados) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir a Imagem ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        // this.imagemService.excluir(imagem.id).subscribe(() => {
        //   this.consultar();
        // });
      } else {
        dialogRef.close();
      }
    });
  }


  verificaMostrarTabela(imagems: ArquivoMetadados[]) {
    if (!imagems || imagems.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhuma imagem encontrada.';
    } else {
      this.mostrarTabela = true;
    }
    this.dataSource.data = imagems ? imagems : [];
  }


}

