import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  forwardRef,
} from "@angular/core";
import { ControlContainer, NgForm, NgModelGroup } from "@angular/forms";
import { Acesso } from "src/app/core/acesso";
import { GrupoAcoes } from "src/app/core/grupo-acoes";
import { DataUtilService } from "src/app/services/commons/data-util.service";
import { ToastService } from "src/app/services/toast/toast.service";

@Component({
  selector: "formulario-analise",
  templateUrl: "./formulario-analise.component.html",
  styleUrls: ["./formulario-analise.component.css"],
  viewProviders: [
    { provide: ControlContainer, useExisting: NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) },
  ],
})
export class FormularioAnaliseComponent implements OnInit {
  @Input() grupoAcao: GrupoAcoes;
  @Input() perfilAcesso: Acesso;
  @Input() perfilAcessoAnalise: Acesso;
  @Input() camposDesabilitados: boolean;

  statusAnaliseCombo: any[] = [
    { id: "A", descricao: "Aprovado" },
    { id: "R", descricao: "Reprovado" },
  ];

  constructor(
    private drc: ChangeDetectorRef,
    private dataUtilService: DataUtilService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }
}
