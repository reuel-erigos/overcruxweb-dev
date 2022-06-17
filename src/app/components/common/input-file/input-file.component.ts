import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css']
})
export class InputFileComponent implements OnInit {

  @ViewChild('inputFile', { static: true }) inputFile: ElementRef;

  @Input() label = '';
  @Input() multiplosArquivos: boolean;
  @Input() extensoesAceitas: string;
  @Input() cor: string; // warn

  @Output() selecionado = new EventEmitter();

  data: any = {};

  constructor() { }

  ngOnInit() {
    this.data = Date.now();
  }

  onSelectionChange(event: any) {
    if (event.target && event.target.files) {
      this.selecionado.emit(event.target.files);
    }
    // necessário para ativar o método change ao subir o mesmo arquivo
    this.inputFile.nativeElement.value = '';
  }

}
