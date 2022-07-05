import { ThemeModule } from './../../core/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardComponent } from './board/board.component';

import { BoardRoutingModule } from './board-routing.module';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, BoardRoutingModule, ThemeModule]
})
export class BoardModule {}
