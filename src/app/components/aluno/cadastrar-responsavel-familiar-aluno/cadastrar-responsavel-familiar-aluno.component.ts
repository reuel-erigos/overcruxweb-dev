import { ToastService } from 'src/app/services/toast/toast.service';
import { Component, OnInit, Input } from '@angular/core';
import { ResponsaveisAluno } from 'src/app/core/responsaveis-aluno';
import { TipoResponsaveis } from 'src/app/core/tipo-responsaveis';
import { Aluno } from 'src/app/core/aluno';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';
import { Familiares } from '../../../core/familiares';
import { DataUtilService } from '../../../services/commons/data-util.service';

@Component({
  selector: 'cadastrar-responsavel-familiar-aluno',
  templateUrl: './cadastrar-responsavel-familiar-aluno.component.html',
  styleUrls: ['./cadastrar-responsavel-familiar-aluno.component.css']
})
export class CadastrarResponsavelFamiliarAlunoComponent implements OnInit {

  @Input() responsavel: ResponsaveisAluno = new ResponsaveisAluno();
  @Input() familiar: Familiares;

  responsavelVigente: ResponsaveisAluno = new ResponsaveisAluno();

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];

  constructor(private toastService: ToastService,
    private dataUtilService: DataUtilService,) {
  }

  ngOnInit() {

  }

  isPeriodoVigente(): boolean {
    if (this.responsavel.dataVinculacao === null) {
      this.toastService.showAlerta('A data de vinculação deve ser informada.');
      return false;
    }

    if (this.responsavel.dataDesvinculacao && this.responsavel.dataDesvinculacao.getTime() < this.responsavel.dataVinculacao.getTime()) {
      this.toastService.showAlerta('A data de vinculação tem quer ser maior que a data de desvinculação.');
      return false;
    }

    const responsavelVigente = this.familiar.responsaveis.find(r => r.dataDesvinculacao === undefined || r.dataDesvinculacao === null);
    if (responsavelVigente && ( this.responsavel.dataDesvinculacao === undefined || this.responsavel.dataDesvinculacao === null ) ) {
      this.toastService.showAlerta('Data de vigência está conflitando com a data de outro responsável.'); //responsavelVigente.familiar.pessoasFisica.nome);
      return false;
    }

    const vigente = this.familiar.responsaveis.find( r => (
                                                           this.responsavel.dataVinculacao.getTime()  <= new Date(r.dataDesvinculacao).getTime()
                                                           &&
                                                           (
                                                            this.responsavel.dataDesvinculacao === undefined
                                                            ||
                                                            this.responsavel.dataDesvinculacao.getTime() >= new Date(r.dataVinculacao).getTime()
                                                           )
                                                          )
                                                    );

    if (vigente) {
      this.toastService.showAlerta('O responsável: ' + vigente.familiar.pessoasFisica.nome + ' já está vigente nesse período.');
      return false;
    }


    // Valido com a data de vigência do outra familiar
    if (this.responsavelVigente && this.responsavelVigente.familiar.id !== this.familiar.id) {
      if (this.responsavel.dataVinculacao.getTime()  <= new Date(this.responsavelVigente.dataDesvinculacao).getTime()
         &&
         (
           this.responsavel.dataDesvinculacao === undefined
           ||
           this.responsavel.dataDesvinculacao.getTime() >= new Date(this.responsavelVigente.dataVinculacao).getTime()
         )
      ) {
        this.toastService.showAlerta('O responsável: ' + this.responsavelVigente.familiar.pessoasFisica.nome
                                                       + ' já está vigente nesse período.');
        return false;
      }
    }

    return true;
  }

  adicionar() {
    if (!this.isPeriodoVigente()) {
      return ;
    }

    Object.assign(this.responsavel.familiar, this.familiar);
    Object.assign(this.responsavel.aluno, this.familiar.aluno);

    delete this.responsavel.familiar.responsaveis;

    this.familiar.responsaveis.push(this.responsavel);
  }


  habilitaBotao(formulario): boolean {
    return Object.keys(formulario.controls).length &&
          (formulario.controls.dataVinculacao.value !== undefined ||
           formulario.controls.dataDesvinculacao.value !== undefined ||
           formulario.controls.mesmoEnderResponsavel.value !== undefined ||
           formulario.controls.descGrauParentesco.value !== undefined ||
           formulario.controls.descDesligamento.value !== undefined);
  }


  carregarResponsavel(responsavel) {
    this.responsavel = responsavel;
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }
}
