import { MyBlogListComponent } from './manage-blog/my-blog-list/my-blog-list.component';
import { AuthComponent } from './auth/auth.component';
import { BlogComponent } from './blog/blog.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ManageBlogComponent } from './manage-blog/manage-blog.component';

const routes: Routes = [
  { path: '', redirectTo: '/blogs', pathMatch: 'full' },
  { path: 'blogs', component: BlogComponent },
  { path: 'myBlog', component: ManageBlogComponent,
      canActivate: [AuthGuard],
      children: [
        { path: '', component:  MyBlogListComponent},
      ]
  },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
