import { Component, OnInit, Input, forwardRef, SimpleChanges } from '@angular/core';
import { Acoes } from 'src/app/core/acoes';
import { AtividadeService } from 'src/app/services/atividade/atividade.service';
import { Atividade } from 'src/app/core/atividade';
import { Funcionario } from 'src/app/core/funcionario';
import * as _ from 'lodash';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { GrupoAcoesService } from 'src/app/services/grupo-acoes/grupo-acoes.service';
import { GrupoAcoes } from 'src/app/core/grupo-acoes';
import { Acesso } from 'src/app/core/acesso';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { GrupoAcoesSimples } from 'src/app/core/grupo-acoes-simples';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';


@Component({
  selector: 'formulario-grupo-acao-oficina',
  templateUrl: './formulario-grupo-acao-oficina.component.html',
  styleUrls: ['./formulario-grupo-acao-oficina.component.css'] ,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm },
                  { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }],  

})
export class FormularioGrupoAcaoOficinaComponent implements OnInit {

  atividades: Atividade[];

  public mascaraPeriodo = [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  showFormularioAcao = false;

  @Input() grupoAcao: GrupoAcoes;
  @Input() perfilAcesso: Acesso;

  constructor(private atividadeService: AtividadeService,
              private grupoAcoesService: GrupoAcoesService,
              private funcoesUteisService: FuncoesUteisService
              ) {

  }

  ngOnInit() {
    this.atividadeService.getAll().subscribe((atividades: Atividade[]) => {
      this.atividades = atividades;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupoAcao'] && this.grupoAcao && this.grupoAcao.id) {
      this.showFormularioAcao = true;
    } else {
      this.showFormularioAcao = false;
    }
  }

  mostrarDadosAtividade(idAtividade) {
    if(idAtividade) {
      this.grupoAcao.atividade = _.cloneDeep(_.find(this.atividades, (a: Atividade) => a.id === idAtividade));
    } else {
      this.grupoAcao.atividade = new Atividade();
    }
  }

  
  addAcao() {
    if (!this.grupoAcao.acoes) {
      this.grupoAcao.acoes = [];
    }

    const acao:any = new Acoes();
    acao.funcionarioPlanejamentoAcao = new Funcionario();
    acao.funcionarioAprovaAcao       = new Funcionario();
    acao.funcionarioExecutaAcao      = new Funcionario();


    let grupoAcaoSimples = new GrupoAcoesSimples();
    grupoAcaoSimples.id          = this.grupoAcao.id;
    grupoAcaoSimples.atividade   = this.grupoAcao.atividade;
    grupoAcaoSimples.numeroGrupo = this.grupoAcao.numeroGrupo;
    grupoAcaoSimples.descricao   = this.grupoAcao.descricao;

    acao.grupoAcao                  = grupoAcaoSimples;

    this.grupoAcao.acoes.push(acao);
  }


  buscarGrupoAcao(){
    if(this.grupoAcao.numeroGrupo && this.grupoAcao.numeroGrupo.length === 7 && this.grupoAcao.atividade && this.grupoAcao.atividade.id){
      this.grupoAcoesService.getByNumeroAndAtividade(this.grupoAcao.numeroGrupo, this.grupoAcao.atividade.id).subscribe((grupoAcao: GrupoAcoes) => {
        if(grupoAcao) {
          this.grupoAcao = grupoAcao;

          if(Object.keys(this.grupoAcao.funcionarioAnalise).length){
            this.grupoAcao.funcionarioAnalise = new Funcionario();
            this.grupoAcao.funcionarioAnalise.pessoasFisica = new PessoaFisica();
          }
        }
        this.showFormularioAcao = true;
      })
    }
  }


  isAprovado(): boolean {
    return this.grupoAcao.statusAnalise === 'A';
  }



}
