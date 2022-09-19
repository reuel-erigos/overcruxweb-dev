import { Familiares } from 'src/app/core/familiares';
import { Component, OnInit, Input } from '@angular/core';
import { SituacaoParentesco } from 'src/app/core/situacao-parentesco';
import { GrausParentescoService } from '../../../services/graus-parentesco/graus-parentesco.service';
import { GrausParentesco } from '../../../core/graus-parentesco';

@Component({
  selector: 'parentesco',
  templateUrl: './parentesco.component.html',
  styleUrls: ['./parentesco.component.css']
})
export class ParentescoComponent implements OnInit {

  @Input() familiar: Familiares;

  situacaoParentesco: SituacaoParentesco = new SituacaoParentesco();
  grausParentesco: GrausParentesco[];

  constructor( private grausParentescoService: GrausParentescoService) { }

  ngOnInit() {
    this.grausParentescoService.getAll().subscribe((graus: GrausParentesco[]) => this.grausParentesco = graus);
  }

}