import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatBadgeModule} from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TextMaskModule } from 'angular2-text-mask';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';
import { BrowserModule } from '@angular/platform-browser';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgxCurrencyModule } from 'ngx-currency';
import { ComboPesquisavelModule } from '../components/common/combo-pesquisavel/combo-pesquisavel.module';
import { LoadingPopupModule } from '../components/common/loading-popup/loading-popup.module';
import { EditorRicoModule } from '../components/common/editor-rico/editor-rico.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';



const modulos = [
      MatButtonModule
    , MatIconModule
    , MatToolbarModule
    , MatFormFieldModule
    , FormsModule
    , MatInputModule
    , MatSelectModule
    , MatCardModule
    , TextMaskModule
    , MatListModule
    , FlexLayoutModule
    , SharedPipesModule
    , MatDatepickerModule
    , MatPaginatorModule
    , MatTooltipModule
    , MatStepperModule
    , MatSlideToggleModule
    , MatCheckboxModule
    , MatOptionModule
    , ReactiveFormsModule
    , MatProgressBarModule
    , MatNativeDateModule
    , MatAutocompleteModule
    , MatTableModule
    , MatSortModule
    , BrowserModule
    , CdkStepperModule
    , MatExpansionModule
    , MatRadioModule
    , MatTabsModule
    , NgxCurrencyModule
    , ComboPesquisavelModule
    , MatBadgeModule
    , LoadingPopupModule
    , EditorRicoModule
    , MatDialogModule
    , MatBottomSheetModule
]

@NgModule({
  declarations: [],
  imports: [modulos],
  exports:[modulos]
})
export class MaterialCommonModule { }
