import { Turmas } from './../../../core/turmas';
import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ProjetoService } from 'src/app/services/projeto/projeto.service';
import { UnidadeService } from 'src/app/services/unidade/unidade.service';
import { ProgramaService } from 'src/app/services/programa/programa.service';
import { NiveisTurmasService } from 'src/app/services/niveis-turmas/niveis-turmas.service';
import { Projeto } from 'src/app/core/projeto';
import { NiveisTurmas } from 'src/app/core/niveis-turmas';
import { Programa } from 'src/app/core/programa';
import { Unidade } from 'src/app/core/unidade';
import { TipoTurno } from 'src/app/core/tipo-turno';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'dados-turma',
  templateUrl: './dados-turma.component.html',
  styleUrls: ['./dados-turma.component.css'],
  viewProviders: [
    { provide: ControlContainer, useExisting: NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }
   ]
})
export class DadosTurmaComponent implements OnInit {

  tipoHorario: any = [
    { id: 'F', descricao: 'FIXO' },
    { id: 'L', descricao: 'LIVRE' },
  ];

  localExecucao: any = [
    { id: 'I', descricao: 'INTERNA' },
    { id: 'E', descricao: 'EXTERNA' },
  ];

  turnos: TipoTurno = new TipoTurno();

  niveisTurma: NiveisTurmas[];
  todosProjetos: Projeto[];
  projetos: Projeto[];
  programas: Programa[];
  unidades: Unidade[];

  @Input() turma: Turmas;

  constructor(
    private projetoService: ProjetoService,
    private programaService: ProgramaService,
    private niveisTurmasService: NiveisTurmasService,
    private unidadeService: UnidadeService
    ) { }

  ngOnInit() {

    this.niveisTurmasService.getAll().subscribe((niveisTurma: NiveisTurmas[]) => {
      this.niveisTurma = niveisTurma;
    });

    this.projetoService.getAll().subscribe((projetos: Projeto[]) => {
      this.todosProjetos = projetos;
      this.projetos      = projetos;
    });

    this.programaService.getAll().subscribe((programas: Programa[]) => {
      this.programas = programas;
    });

    this.unidadeService.getAllUnidadesInstituicaoUsuarioLogado().subscribe((unidades: Unidade[]) => {
      this.unidades = unidades;
    });

  }

  setNivelTurma(){
    if(this.turma.niveisTurma && this.turma.niveisTurma.id){
      this.turma.niveisTurma = _.cloneDeep(_.find(this.niveisTurma, (c: NiveisTurmas) => c.id === this.turma.niveisTurma.id));
    } else {
      this.turma.niveisTurma = new NiveisTurmas();
    }
  }


  setUnidade(){
    if(this.turma.unidade && this.turma.unidade.idUnidade) {
      this.turma.unidade = _.cloneDeep(_.find(this.unidades, (c: Unidade) => c.idUnidade === this.turma.unidade.idUnidade));
    } else {
      this.turma.unidade = new Unidade();
    }
  }

  carregarProjeto(){
    if(this.turma.projeto && this.turma.projeto.id) {
      this.turma.projeto = _.cloneDeep(_.find(this.projetos, (c: Projeto) => c.id === this.turma.projeto.id));
    }else {
      this.turma.projeto = new Projeto();
    }
  }

  carregarPrograma(){
    if(this.turma.programa && this.turma.programa.id) {
      this.turma.programa = _.cloneDeep(_.find(this.programas, (c: Programa) => c.id === this.turma.programa.id));

      this.projetoService.getAllPorPrograma(this.turma.programa.id).subscribe((projetos: Projeto[]) => {
        this.projetos = projetos;
      });

    } else {
      this.turma.programa = new Programa();
      this.projetos = this.todosProjetos;
    }
  }
}
