import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'login/:token/:id', component: LoginComponent },
    { path: 'home', loadChildren: './home/home.module#HomeModule' },
    { path: '', redirectTo: "/login", pathMatch: 'full' },
    { path: '404', component: NotFoundComponent },
    { path: "**", redirectTo: "404" }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})

export class AppRouting { }