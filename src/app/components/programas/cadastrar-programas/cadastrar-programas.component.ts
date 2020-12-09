import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Acesso } from 'src/app/core/acesso';
import { Funcionario } from 'src/app/core/funcionario';
import { Objetivo } from 'src/app/core/objetivo';
import { ObjetivoService } from 'src/app/services/objetivo/objetivo.service';
import { ProgramaService } from 'src/app/services/programa/programa.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Programa } from './../../../core/programa';
import { FuncionarioService } from './../../../services/funcionario/funcionario.service';
import {Iniciativa} from 'src/app/core/iniciativa';
import {Projeto} from 'src/app/core/projeto';

@Component({
  selector: 'app-cadastrar-programas',
  templateUrl: './cadastrar-programas.component.html',
  styleUrls: ['./cadastrar-programas.component.css']
})
export class CadastrarProgramasComponent implements OnInit {

  programa: Programa = new Programa();

  isAtualizar: boolean = false;


  perfilAcesso: Acesso;
  mostrarBotaoCadastrar = true
  mostrarBotaoAtualizar = true;


  constructor(
    private programaService: ProgramaService,
    private funcionarioService: FuncionarioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
  }


  ngOnInit() {

    this.inicializarObjetos();

    this.perfilAcesso = this.activatedRoute.snapshot.data.perfilAcesso[0];

    if (!this.perfilAcesso.insere) {
      this.mostrarBotaoCadastrar = false;
    }

    if (!this.perfilAcesso.altera) {
      this.mostrarBotaoAtualizar = false;
    }

    let idPrograma: number;
    idPrograma = this.activatedRoute.snapshot.queryParams.idPrograma ? this.activatedRoute.snapshot.queryParams.idPrograma : null;
    if (idPrograma) {
      this.isAtualizar = true;
      this.programaService.getById(idPrograma).subscribe((programa: Programa) => {
        this.programa = programa
      });
    }

  }
  inicializarObjetos() {
    this.programa = new Programa();
    this.programa.objetivo = new Objetivo();
    this.programa.unidades = [];
    this.programa.colaboradoresPrograma = [];
    this.programa.parceriasPrograma = [];
    this.programa.composicaoRhPrograma = [];
    this.programa.materiaisPrograma = [];
    this.programa.unidades = [];
    this.programa.contasCentrosCusto = [];
    
  }

  mostrarBotaoLimpar() {
    if (this.isAtualizar) return false;
    if (!this.mostrarBotaoAtualizar) return false;
    if (!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  cadastrar() {
    if(!this.isValoresAditivosValidos()) {
      this.toastService.showAlerta('ATENÇÃO: A soma das categorias e seus aditivos é diferente da soma do parceiro e seus aditivos.');
      return;
    }

    this.programaService.cadastrar(this.programa).subscribe(() => {
      this.router.navigate(['programas']);
      this.toastService.showSucesso("Programa cadastrado com sucesso");
    });
  }

  limpar() {
    this.inicializarObjetos();
  }

  cancelar() {
    this.router.navigate(['programas']);
  }


  atualizar() {
    if(!this.isValoresAditivosValidos()) {
      this.toastService.showAlerta('ATENÇÃO: A soma das categorias e seus aditivos é diferente da soma do parceiro e seus aditivos.');
      return;
    }

    this.programaService.alterar(this.programa).subscribe(() => {
      this.router.navigate(['programas']);
      this.toastService.showSucesso("Programa atualizado com sucesso");
    });

  }

  isValoresAditivosValidos(): boolean {
    let valorTotalParceria = null;
    let valorTotalAditivoParceria = null;

    let valorTotalCategoria = null;
    let valorTotalAditivoCategoria = null;

    this.programa.parceriasPrograma.forEach(p =>  {
      valorTotalParceria += p.valorParceria;
      p.aditivosParceriasProgramas.forEach(a => valorTotalAditivoParceria += a.valorAditivo);

      p.parceriasCategorias.forEach(p => {
        valorTotalCategoria += p.valorParceriaCategoria;
        p.aditivosParceriasCategorias.forEach(a => valorTotalAditivoCategoria += a.valorAditivo);
      });
    })

    let totalParceria  = null;
    if(valorTotalAditivoParceria){
      totalParceria  = Number(valorTotalParceria.toFixed(2))  + Number(valorTotalAditivoParceria.toFixed(2));
    }
    
    let totalCategoria = null;
    if(valorTotalAditivoCategoria) {
      totalCategoria = Number(valorTotalCategoria.toFixed(2)) + Number(valorTotalAditivoCategoria.toFixed(2));
    }

    if(totalCategoria && totalParceria != totalCategoria) {return false;}
    return true;
  }


}
