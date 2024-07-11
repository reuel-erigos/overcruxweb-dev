import { Component, OnInit, ViewChild } from '@angular/core';
import { Turmas } from 'src/app/core/turmas';
import { Acoes } from './../../core/acoes';
import { Atividade } from './../../core/atividade';
import { Unidade } from './../../core/unidade';
import { TurmasService } from './../../services/turmas/turmas.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


import { ActivatedRoute, Router } from '@angular/router';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { TipoTurno } from 'src/app/core/tipo-turno';
import { AtividadeService } from 'src/app/services/atividade/atividade.service';
import { GrupoAcoesService } from 'src/app/services/grupo-acoes/grupo-acoes.service';
import { UnidadeService } from 'src/app/services/unidade/unidade.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { GrupoAcoes } from 'src/app/core/grupo-acoes';

@Component({
  selector: 'app-acoes-atividade',
  templateUrl: './acoes-atividade.component.html',
  styleUrls: ['./acoes-atividade.component.css']
})
export class AcoesAtividadeComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  listaAcoesAtividade: Acoes[];
  grupoAcoes: GrupoAcoes = new GrupoAcoes();
  listaStatusAnalise: any[] = [{id: 'A', descricao: 'Aprovado'}, 
                               {id: 'R', descricao: 'Reprovado'}, 
                               {id: 'E', descricao: 'Em Análise'}, 
                               {id: 'N', descricao: 'Aguardando'}];
  msg: string;
  carregarPerfil: CarregarPerfil;
  perfilAcesso: Acesso = new Acesso();

  mostrarTabela = false;

  unidadeSelecionada: Unidade = new Unidade();
  turmaSelecionada: Turmas = new Turmas();
  oficinaSelecionada: Atividade = new Atividade();
  statusAnaliseSelecionado: string;

  unidadesComboCadastro: any[];
  turmasCombo: Turmas[];
  oficinasCombo: Atividade[];

  turnos: TipoTurno = new TipoTurno();

  displayedColumns: string[] = ['expand', 'atividade', 'periodo', 'responsavelAnalise', 'status', 'acoes'];
  dataSource: MatTableDataSource<GrupoAcoes> = new MatTableDataSource();

  constructor(
    private grupoAcoesService: GrupoAcoesService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private unidadeService: UnidadeService,
    private turmaService: TurmasService,
    private oficinaService: AtividadeService
  ) {
    this.carregarPerfil = new CarregarPerfil();
  }


  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);
    this.dataSource.paginator = this.paginator;
    this.consultar();

    this.unidadeService.getAllByInstituicaoDaUnidadeLogada().subscribe((unidades: any[]) => {
      this.unidadesComboCadastro = unidades;
    });

    this.turmaService.getFilter(null, null, null).subscribe((turmas: Turmas[]) => {
      this.turmasCombo = turmas;
    });


    this.oficinaService.getAll().subscribe((oficinas: Atividade[]) => {
      this.oficinasCombo = oficinas;
    });

  }


  limpar() {
    this.mostrarTabela = false;
    this.dataSource.data = [];

    this.grupoAcoes = new GrupoAcoes();
    this.unidadeSelecionada = new Unidade();
    this.turmaSelecionada = new Turmas();
    this.oficinaSelecionada = new Atividade();
    this.statusAnaliseSelecionado = null;
  }

  consultar() {
    this.grupoAcoesService.getFilter(this.unidadeSelecionada?.idUnidade,
                                          this.turmaSelecionada?.id,
                                          this.oficinaSelecionada?.id,
                                          this.grupoAcoes?.id,
                                          this.statusAnaliseSelecionado)
    .subscribe((grupoAcoes: GrupoAcoes[]) => {
      if (!grupoAcoes) {
        this.mostrarTabela = false;
        this.msg = 'Nenhum registro para a pesquisa selecionada';
      } else {
        this.dataSource.data = grupoAcoes ? grupoAcoes : [];
        this.mostrarTabela = true;
      }
    });
  }

  carregarTurmas() {
    if(this.unidadeSelecionada) {
      this.turmaService.getFilter(null, null, this.unidadeSelecionada.idUnidade).subscribe((turmas: Turmas[]) => {
        this.turmasCombo = turmas;
      });
    }
  }

  carregarOficinas() {
    if(this.turmaSelecionada && this.turmaSelecionada.id) {
      this.oficinaService.getByTurma(this.turmaSelecionada.id).subscribe((oficinas: Atividade[]) => {
        this.oficinasCombo = oficinas;
      });
    }
  }

  atualizar(grupoAcoes: GrupoAcoes) {
    this.router.navigate(['/acoesoficinas/cadastrar'], { queryParams: { codigoacao: grupoAcoes.id } });
  }

  deletar(grupoAcoes: GrupoAcoes) {
    this.chamaCaixaDialogo(grupoAcoes);
  }

  chamaCaixaDialogo(grupoAcoes: GrupoAcoes) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja excluir o grupo de ações?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.grupoAcoesService.excluir(grupoAcoes.id).subscribe(() => {
          this.grupoAcoes.id = null;
          this.consultar();
        });
      } else {
        dialogRef.close();
      }
    }
    );
  }

  verificaMostrarTabela(listaGrupoAcoes: GrupoAcoes[]) {
    if(!listaGrupoAcoes || listaGrupoAcoes.length === 0) {
      this.mostrarTabela = false;
      this.msg = 'Nenhuma ação cadastrada.';
    } else {
      this.mostrarTabela = true;
    }
  }

  mascaraPeriodo(periodo: string): string {
    if (!periodo || periodo.length !== 6) return periodo;

    const mes = periodo.substring(0, 2);
    const ano = periodo.substring(2, 6);

    return `${mes}/${ano}`;
  }

  expandedElement: any | null;

  toggleRow(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

}
