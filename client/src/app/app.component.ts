import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig) {}

  boards: MenuItem[] = [];

  public ngOnInit(): void {
    this.boards = [
      {
        label: '4',
        routerLink: '4'
      },
      {
        label: 'b',
        url: 'board/b'
      },
      {
        label: 'noc',
        routerLink: 'noc'
      },
      {
        label: 'z',
        routerLink: 'z'
      },
      {
        label: '$',
        routerLink: '$'
      },
      {
        label: 'c',
        routerLink: 'c'
      },
      {
        label: 'f',
        routerLink: 'f'
      },
      {
        label: 'fa',
        routerLink: 'fa'
      },
      {
        label: 'l',
        routerLink: 'l'
      },
      {
        label: 'mu',
        routerLink: 'mu'
      },
      {
        label: 'oc',
        routerLink: 'oc'
      },
      {
        label: 'sp',
        routerLink: 'sp'
      },
      {
        label: 'thc',
        routerLink: 'thc'
      },
      {
        label: 'vg',
        routerLink: 'vg'
      },
      {
        label: 'rs',
        routerLink: 'rs'
      },
      {
        label: 's',
        routerLink: 's'
      }
    ];
  }
}
