import { Component, OnInit, Input } from '@angular/core';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import {CondicoesMoradiaService} from 'src/app/services/condicoes-moradia/condicoes-moradia.service';
import {CondicoesMoradia} from 'src/app/core/condicoes-moradia';
import { EncaminhamentoAluno } from 'src/app/core/encaminhamento-aluno';
import { EntidadesSociais } from 'src/app/core/entidades-sociais';
import { EntidadeSocialService } from 'src/app/services/entidade-social/entidade-social.service';
import { ControlContainer, NgForm } from '@angular/forms';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { BeneficioSocial } from 'src/app/core/beneficio-social';
import { BeneficioSocialPessoaFisica } from '../../../core/beneficio-social-pessoa-fisica';
import { BeneficioSocialService } from '../../../services/beneficio-social/beneficio-social';

@Component({
  selector: 'beneficio-familiar-aluno',
  templateUrl: './beneficio-familiar-aluno.component.html',
  styleUrls: ['./beneficio-familiar-aluno.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class BeneficioFamiliarAlunoComponent implements OnInit {

  @Input() pessoaFisica: PessoaFisica;
  @Input() atendidoOrgaoRede: string;
  @Input() encaminhamentos: EncaminhamentoAluno[];
  @Input() origemTelaAluno: boolean = true;
  @Input() beneficiosSociaisPessoaFisica: BeneficioSocialPessoaFisica[];

  entidadesSociais: EntidadesSociais[];

  formaIngressoEntidade = [ 'CRAS',
                            'DEMANDA ESPONTÂNEA',
                            'SOLICITAÇÃO JUDICIAL',
                            'OUTRO'
                          ];

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];
  condicoesMoradia: CondicoesMoradia[];
  
  tipoEscola: any[] = [
      {tipo: 'Pública', flag: 'P'},
      {tipo: 'Privada', flag: 'R'}
  ];

  
  mostrarBotaoCadastrar = true;
  mostrarBotaoAtualizar = true;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;
  beneficiosSociais: BeneficioSocial[];

  constructor(private condicaoMoradiaService: CondicoesMoradiaService,
              private activatedRoute: ActivatedRoute,
              private entidadeSocialService: EntidadeSocialService,
              private beneficioSocialService:BeneficioSocialService) { 
    this.carregarPerfil = new CarregarPerfil();            
  }

  ngOnInit() {
      this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

      
      if (!this.perfilAcesso.insere){
        this.mostrarBotaoCadastrar = false;
      }

      if (!this.perfilAcesso.altera){
        this.mostrarBotaoAtualizar = false;
      }

      this.pessoaFisica.condicoesMoradia = new CondicoesMoradia();
  
      this.condicaoMoradiaService.getAll().subscribe((condicoes: CondicoesMoradia[]) => {
          this.condicoesMoradia = condicoes;

          this.carregarCondicaoMoradia();
      });

      this.entidadeSocialService.getAll().subscribe((entidadesSociais: EntidadesSociais[]) => {
        this.entidadesSociais = entidadesSociais;
      });

      this.beneficioSocialService.getAll().subscribe((beneficiosSociais: BeneficioSocial[]) => {
        this.beneficiosSociais = beneficiosSociais;
      });



  }


  carregarCondicaoMoradia() {
    if (this.pessoaFisica.condicoesMoradia && this.pessoaFisica.condicoesMoradia.id) {
      this.pessoaFisica.condicoesMoradia = _.cloneDeep(_.find(this.condicoesMoradia,  (f: CondicoesMoradia) => f.id === this.pessoaFisica.condicoesMoradia.id));
    }
  }

  addEncaminhamento() {
      if (!this.encaminhamentos) {
        this.encaminhamentos = [];
      }
      const encaminhamento:any = new EncaminhamentoAluno();
      encaminhamento.entidadeSocial = new EntidadesSociais();
  
      this.encaminhamentos.push(encaminhamento);
  }
  
  addBeneficio() {
      if (!this.beneficiosSociaisPessoaFisica) {
        this.beneficiosSociaisPessoaFisica = [];
      }
      const beneficio = new BeneficioSocialPessoaFisica();
      beneficio.beneficioSocial = new BeneficioSocial();
      beneficio.pessoaFisica = new PessoaFisica();
  
      this.beneficiosSociaisPessoaFisica.push(beneficio);
  }

}




  