import { AfterContentInit, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { MatDialog} from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Aluno } from 'src/app/core/aluno';
import { Router, ActivatedRoute } from '@angular/router';
import { AlunoService } from 'src/app/services/aluno/aluno.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { Acesso } from 'src/app/core/acesso';
import { FilterAlunos } from 'src/app/core/filter-alunos';
import { CpfPipe } from 'src/app/pipes/cpf.pipe';
import * as _ from 'lodash';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { ComboAluno } from 'src/app/core/combo-aluno';
import { PessoaFisicaService } from 'src/app/services/pessoa-fisica/pessoa-fisica.service';
import { ComboPessoaFisica } from 'src/app/core/combo-pessoa-fisica';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { DataUtilService } from '../../services/commons/data-util.service';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css'],
  providers: [CpfPipe],
})
export class AlunoComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 
  comboMae: ComboPessoaFisica[];
  comboCpf: ComboPessoaFisica[];
  
  alunos: Aluno[];
  filtro: FilterAlunos;

  mostrarTabela = false;
  msg: string;

  displayedColumns: string[] = ['matricula', 'nome', 'turno', 'serie', 'dataEntrada', 'dataDesligamento', 'acoes'];
  dataSource: MatTableDataSource<Aluno> = new MatTableDataSource();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  constructor(
    private alunoService: AlunoService,
    private pessoaFisicaService: PessoaFisicaService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute:ActivatedRoute,
    private cpfPipe: CpfPipe ,
    private funcoesUteisService: FuncoesUteisService,
    private toastService: ToastService,
    private dataUtilService: DataUtilService,
  ) { 
    this.filtro = this.alunoService.filtro;
    this.carregarPerfil = new CarregarPerfil();
  }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);
    
    this.dataSource.paginator = this.paginator;

    this.carregarCombos(); 
    this.carregar();   
  }


  limpar() {
    this.mostrarTabela = false;
    this.dataSource.data = [];
    this.filtro = (this.alunoService.filtro = new FilterAlunos());
    this.alunoService.initFiltro();
  }

  carregar() {
    this.alunoService.initFiltro();
    if (this.filtro.aluno.id || this.filtro.maeAluno.id || this.filtro.cpfAluno.id || this.filtro.dataInicioEntradaInstituicao || this.filtro.dataFimEntradaInstituicao) {
      this.alunoService.getFilter(this.filtro.aluno.id,  
                                  this.filtro.maeAluno.nomeMae, 
                                  this.filtro.cpfAluno.cpf,
                                  this.filtro.dataInicioEntradaInstituicao,
                                  this.filtro.dataFimEntradaInstituicao)
      .subscribe((alunos: Aluno[]) => {
        this.verificaMostrarTabela(alunos);
      });
    } 
  }

  consultar() { 
    if (!this.filtro.aluno.id && !this.filtro.maeAluno.id && !this.filtro.cpfAluno.id && !this.filtro.dataInicioEntradaInstituicao && !this.filtro.dataFimEntradaInstituicao) {
      this.toastService.showAlerta('Informe pelo menos um critério de pesquisa.');
      return;
    }else{
      this.carregar();
    }
  }

  atualizar(aluno: Aluno) {
    this.router.navigate(['/aluno/cadastrar'], { queryParams: { id: aluno.id } });
  }

  deletar(aluno: Aluno) {
    this.chamaCaixaDialogo(aluno);
  }

  chamaCaixaDialogo(aluno: Aluno) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir o Aluno ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.alunoService.excluir(aluno.id).subscribe(() => {
          this.consultar();
        });
      } else {
        dialogRef.close();
      }
    });
  }


  verificaMostrarTabela(alunos: Aluno[]) {
    if (!alunos || alunos.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhum aluno encontrado.';
    } else {
      this.mostrarTabela = true;
    }
    this.dataSource.data = alunos ? alunos : [];
  }

  carregarCombos(){

    this.pessoaFisicaService.getAllPessoasByCombo().subscribe((pessoas: ComboPessoaFisica[]) => {
      this.comboMae   = pessoas;
      this.comboCpf   = pessoas;

      this.preencherCPF();
      this.preencherNomeMae();


      //====================================================================================
      this.comboMae = this.comboMae.filter(a => !!a.nomeMae);
      this.comboMae.sort((a,b) => {
        if (a.nomeMae > b.nomeMae) {return 1;}
        if (a.nomeMae < b.nomeMae) {return -1;}
        return 0;
      });
      this.comboMae = this.funcoesUteisService.arrayDistinct(this.comboMae, 'nomeMae');


      //====================================================================================
      this.comboCpf.forEach(a => {
        a.cpf = a.cpf || '00000000000';
        a.cpf = this.cpfPipe.transform(a.cpf);
      })
      this.comboCpf.sort((a,b) => {
        if (a.cpf > b.cpf) {return 1;}
        if (a.cpf < b.cpf) {return -1;}
        return 0;
      });
      this.comboCpf = this.funcoesUteisService.arrayDistinct(this.comboCpf, 'cpf');
    })

  }



  preencherCPF(){
    if (this.alunoService.filtro.cpfAluno.id) {
      this.filtro.cpfAluno = _.find(this.comboCpf, { id: this.alunoService.filtro.cpfAluno.id });
    }
  }


  preencherNomeMae(){
    if (this.alunoService.filtro.maeAluno.id) {
      this.filtro.maeAluno = _.find(this.comboMae, { id: this.alunoService.filtro.maeAluno.id });
    }
  }

  onValorChange(event: any) {
    this.filtro.aluno = event;
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }
}
