import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Aluno } from 'src/app/core/aluno';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { FilterAlunos } from 'src/app/core/filter-alunos';
import { ComboAluno } from 'src/app/core/combo-aluno';
import { ComboPessoaFisica } from 'src/app/core/combo-pessoa-fisica';

@Injectable({
  providedIn: 'root'
})
export class AlunoService extends BaseService<Aluno> {

  filtro: FilterAlunos = new FilterAlunos();

  constructor(http: HttpClient) {
    super(http, Rotas.ALUNO);
    this.initFiltro();
  }

  getAllAlunosByCombo() {
    return this.http.get(`${Rotas.ALUNO}dados/combo`);
  }

  getAlunosByNome(nome: string) {
    return this.http.get(`${Rotas.ALUNO}nome/${nome}`);
  }

  getFilter(idAluno: string|number,
            nomePessoaFisicaMae: string|number,
            cpfPessoaFisicaAluno: string|number,
            dataInicioEntradaInstituicao: any,
            dataFimEntradaInstituicao: any) {

    idAluno              = idAluno || '';
    nomePessoaFisicaMae  = nomePessoaFisicaMae || '';
    cpfPessoaFisicaAluno = cpfPessoaFisicaAluno || '';
    const p_dataInicioEntradaInstituicao = dataInicioEntradaInstituicao ? dataInicioEntradaInstituicao.getTime() : '';
    const p_dataFimEntradaInstituicao = dataFimEntradaInstituicao ? dataFimEntradaInstituicao.getTime() : '';


    return this.http.get(Rotas.ALUNO + 'filter', { params: {
        idAluno: `${idAluno}` ,
        nomePessoaFisicaMae: `${nomePessoaFisicaMae}` ,
        cpfPessoaFisicaAluno: `${cpfPessoaFisicaAluno}`,
        dataInicioEntradaInstituicao: `${p_dataInicioEntradaInstituicao}`,
        dataFimEntradaInstituicao: `${p_dataFimEntradaInstituicao}`,
      }
    });
  }

  initFiltro() {
    if(!this.filtro.aluno) {
      this.filtro.aluno  = new ComboAluno();
    }

    if(!this.filtro.maeAluno) {
      this.filtro.maeAluno = new ComboPessoaFisica();
    }

    if(!this.filtro.cpfAluno) {
      this.filtro.cpfAluno = new ComboPessoaFisica();
    }
  }

  salvarTextoObservacao(dadosObservacaoRelatorio: any): any {
    return this.http.put(`${Rotas.ALUNO}observacao/`, dadosObservacaoRelatorio );
  }
}
