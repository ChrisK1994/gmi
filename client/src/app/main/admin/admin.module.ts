import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageAnonsComponent } from './manage-anons/manage-anons.component';
import { ManagePostsComponent } from './manage-posts/manage-posts.component';
import { ManageReportsComponent } from './manage-reports/manage-reports.component';

import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    imports: [
        CommonModule,
        AdminRoutingModule
    ],
    declarations: [
        AdminComponent,
        AdminDashboardComponent,
        ManageAnonsComponent,
        ManagePostsComponent,
        ManageReportsComponent
    ]
})
export class AdminModule { }