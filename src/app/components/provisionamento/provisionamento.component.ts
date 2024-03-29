import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ProgramaProjetoInstituicao } from 'src/app/core/programa-projeto-instituicao';
import { Provisao } from 'src/app/core/provisao';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ProgramaProjetoInstituicaoService } from 'src/app/services/programa-projeto-instituicao/programa-projeto-instituicao.service';
import { ProvisaoService } from 'src/app/services/provisao/provisao.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FileUtils } from 'src/app/utils/file-utils';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { MovimentosBancariosInconsistentesComponent } from '../common/movimentos-bancarios-inconsistentes/movimentos-bancarios-inconsistentes.component';


class Filter {
  dataInicio: Date;
  dataFim: Date;
  nomeProgramaProjeto: string
}

@Component({
  selector: 'provisionamento',
  templateUrl: './provisionamento.component.html',
  styleUrls: ['./provisionamento.component.css']
})
export class ProvisionamentoComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  selection = new SelectionModel<Provisao>(true, []);
  
  provisoes: Provisao[];
  filtro = new Filter();
  
  displayedColumns: string[] = ['select', 'situacao', 'dataprovisao', 'documento',  'complemento', 'descricaoFornecedor', 'categoria', 'valor', 'centroCusto', 'grupoContas',  'nomeFornecedor'];
  dataSource: MatTableDataSource<Provisao> = new MatTableDataSource();
  mostrarTabela: boolean = false;
  msg: string;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  inconsistentes: Provisao[] = [];

  centrosCustos: ProgramaProjetoInstituicao[];

  constructor(
    private provisaoService: ProvisaoService,
    private toastService: ToastService,
    private dataUtilService: DataUtilService,
    private router: Router,
    private fileUtils: FileUtils,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private loadingPopupService: LoadingPopupService,
    private programaProjetoInstituicaoService: ProgramaProjetoInstituicaoService
  ) { 
    this.carregarPerfil = new CarregarPerfil();
  }

  ngOnInit(): void {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    if (!this.perfilAcesso.insere){
      this.mostrarBotaoCadastrar = false;
    }

    if (!this.perfilAcesso.altera){
      this.mostrarBotaoAtualizar = false;
    }

    this.limpar();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.carregarMovimentosInconsistentes();

    this.programaProjetoInstituicaoService.getAll().subscribe((centrosCustos: ProgramaProjetoInstituicao[]) => {
      this.centrosCustos = centrosCustos;
    })
  
  }

  private carregarMovimentosInconsistentes(){
    this.provisaoService.getAllInconsistentes()
    .subscribe((inconsistentes: Provisao[]) => {
      this.inconsistentes = inconsistentes;
    });
  }

  carregar() {
    this.selection.clear();
    this.provisaoService.carregar(this.filtro.dataInicio, 
                                  this.filtro.dataFim,
                                  this.filtro.nomeProgramaProjeto)
    .subscribe((provisoes: Provisao[]) => {
      this.provisoes = provisoes;
      this.dataSource.data = provisoes ? provisoes : [];
      this.verificaMostrarTabela(provisoes);

      this.masterToggle();
      this.carregarMovimentosInconsistentes();
    })
  }


  buscar() {
    this.selection.clear();
    
    this.provisaoService.getFilter(this.filtro.dataInicio, 
                                   this.filtro.dataFim,
                                   this.filtro.nomeProgramaProjeto)
    .subscribe((provisoes: Provisao[]) => {
      this.provisoes = provisoes;
      this.dataSource.data = provisoes ? provisoes : [];
      this.verificaMostrarTabela(provisoes);

      this.selection.clear();
      this.dataSource.data.forEach(row => this.selection.select(row));
      
    })
  }

  verificaMostrarTabela(lista: Provisao[]) {
    if (!lista || lista.length == 0) {
      this.mostrarTabela = false;
      this.msg = "Nenhuma provisão encontrada."
    } else {
      this.mostrarTabela = true;
    }
  }

  public handlePageBottom(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.page.emit(event);
  }

  limpar() {
    this.mostrarTabela = false;
    this.dataSource.data = [];
    this.filtro = new Filter();
    this.provisoes = [];
    this.selection.clear();
  }


  exportar() {
    if(this.selection.selected && this.selection.selected.length === 0) {
      this.toastService.showAlerta('Selecione um registro que deseja enviar para provisão.');
      return;
    }

    this.chamaCaixaDialogoExportar();
  }

  isRegistroDivergente(c: Provisao): boolean {
    return !c.descricaoFornecedor && !c.semDocumento;
  }

  chamaCaixaDialogoExportar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja exportar ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        if(this.selection.selected && this.selection.selected.length > 0) {
          const fornecedoresSemDocumento=  this.selection.selected.filter(c => this.isRegistroDivergente(c));
          if(fornecedoresSemDocumento.length > 0) {
            this.toastService.showAlerta('Não é possível exportar, pois existem fornecedores sem documentos.')
          } else {

            this.loadingPopupService.mostrarMensagemDialog('Gerando arquivo de provisão, aguarde...');
            this.provisaoService.gerarArquivo(this.selection.selected)
            .subscribe((dados: any) => {
              this.fileUtils.downloadFileXLS(dados, "provisao.xlsx");
  
              this.buscar();
              this.toastService.showSucesso('Provisão exportada com sucesso!');
              this.loadingPopupService.closeDialog();
            }, 
            (error) => {
              this.loadingPopupService.closeDialog();
              console.log(error);            
            })
          }
        }
      } else {
        dialogRef.close();
      }
    });
  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }


  showProvisaoDivergencia() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      dados: this.inconsistentes.map(i => i.data),
      titulo: 'Provisionamentos Inconsistentes'
    };
    dialogConfig.panelClass = 'alturaDialogMovimentosInconsistentes';

    this.dialog.open(MovimentosBancariosInconsistentesComponent, dialogConfig);    
  }

  onInput(event) {
    this.dataUtilService.onMascaraDataInput(event);
  }

}
