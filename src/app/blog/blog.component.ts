import { BlogsService, AuthResponseData } from './../manage-blog/blogs.service';
import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {
  isLoading = true;
  blogs = [];
  constructor(private blogService: BlogsService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getBlogList();
  }

  getBlogList() {
    this.blogService.getblogList().subscribe(
      (AuthResponseData) => {
        let data = AuthResponseData
        this.blogs = data.data;
        this.isLoading = false;
                
        if (data.data.length <= 0) {
          this.openSnackBar('Blogs list not available. Please Refresh')
        }
      },
      err => {
        this.isLoading = false;
        this.openSnackBar(err);
      }
    );
  }

  openSnackBar(val: string) {
    this._snackBar.open(val, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

}
