import { Component, EventEmitter, forwardRef, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Acesso } from 'src/app/core/acesso';
import { Acoes } from 'src/app/core/acoes';
import { Atividade } from 'src/app/core/atividade';
import { Funcionario } from 'src/app/core/funcionario';
import { GrupoAcoes } from 'src/app/core/grupo-acoes';
import { GrupoAcoesSimples } from 'src/app/core/grupo-acoes-simples';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { UsuarioSistema } from 'src/app/core/usuario-sistema';
import { AtividadeService } from 'src/app/services/atividade/atividade.service';
import { GrupoAcoesService } from 'src/app/services/grupo-acoes/grupo-acoes.service';


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
  showFormularioAnalise = false;
  statusAnalise = '';
  statusEnvioAnalise: Boolean = false;

  @Input() grupoAcao: GrupoAcoes;
  @Input() perfilAcesso: Acesso;
  @Input() perfilAcessoAnalise: Acesso = new Acesso();

  @Output() grupoAcaoOutput = new EventEmitter<any>();

  constructor(private atividadeService: AtividadeService,
              private grupoAcoesService: GrupoAcoesService) {
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
          this.statusAnalise = this.grupoAcao.statusAnalise;
          this.statusEnvioAnalise = this.grupoAcao.statusEnvioAnalise;
          this.grupoAcaoOutput.emit(grupoAcao);

          if(Object.keys(this.grupoAcao.usuarioAnalise).length <= 0){
            this.grupoAcao.usuarioAnalise = new UsuarioSistema();
            this.grupoAcao.usuarioAnalise.pessoaFisica = new PessoaFisica();
          }
        }
        this.showFormularioAcao = true;
      })
    }
  }

  camposDesabilitados(): boolean {
    console.log(this.perfilAcessoAnalise);
    
    if (this.statusAnalise === "") {
      this.statusAnalise = this.grupoAcao.statusAnalise;
      this.statusEnvioAnalise = this.grupoAcao.statusEnvioAnalise;
    }

    if (this.perfilAcesso.altera) {
      if (this.statusAnalise === "A" || this.statusAnalise === "R") {
        if (this.perfilAcessoAnalise.altera) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  isShowFormularioAnalise(): Boolean {
    return this.grupoAcao.statusEnvioAnalise && this.perfilAcessoAnalise.consulta;
  }

}
