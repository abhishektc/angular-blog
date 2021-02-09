import { BlogsService } from './../blogs.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';


export interface DialogData {
  blogId: any;
  title: string;
  content: string;
}

@Component({
  selector: 'app-my-blog-list',
  templateUrl: './my-blog-list.component.html',
  styleUrls: ['./my-blog-list.component.css']
})

export class MyBlogListComponent implements OnInit {
  isLoading = true;
  isLoadingDelete = false;
  blogs = [];
  blogDelete: any;
  constructor(public dialog: MatDialog, private bolgService: BlogsService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getMyBlogList();
  }

  getMyBlogList() {
    this.isLoading = true;

    const userData: {
      tokenData: any;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!!userData) {
      this.bolgService.getMyblogList(userData.tokenData).subscribe(
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
  }

  openPostDialog() {
    const dialogRef = this.dialog.open(CreatePostDialog);
    dialogRef.afterClosed().subscribe(result => {
      this.getMyBlogList();
    });
  }

  openEditDialog(id: any, title: any, content: any) {
    
    const dialogRef = this.dialog.open(EditBlog, {
      data: {blogId: id, title: title, content: content}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMyBlogList();
    });
  }

  openSnackBar(val: string) {
    this._snackBar.open(val, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

  deletePost(id: any) {
    this.isLoadingDelete = true;
    this.blogDelete = id;
    const userData: {
      tokenData: any;
    } = JSON.parse(localStorage.getItem('userData'));

    if (confirm("Are you sure to delete this blog.")) {
      this.bolgService.deleteBlogById(id, userData.tokenData).subscribe(
        data => {
          this.isLoadingDelete = false;
          this.openSnackBar('Deleted blog successfully.');
          this.getMyBlogList();
        },
        err => {
          this.isLoadingDelete = false;
          this.openSnackBar(err);
        }
      );
    }
    
  }

}

//post dialog
@Component({
  selector: 'add-new-post',
  templateUrl: './add-new-post.html',
  styleUrls: ['./my-blog-list.component.css']
})

export class CreatePostDialog {
  isLoading = false;

  constructor(public dialogRef: MatDialogRef<CreatePostDialog>, private fb: FormBuilder, private _snackBar: MatSnackBar, private blogService: BlogsService) { }


  postForm = this.fb.group({
    title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
    content: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(1000)]),
  });

  onSubmit() {
    this.isLoading = true;
    const title = this.postForm.get('title').value;
    const content = this.postForm.get('content').value;
    const userData: {
      tokenData: any;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!!userData) {
      this.blogService.createPost(title, content, userData.tokenData).subscribe(
        data => {
          this.openSnackBar('Successfully created.')
          this.isLoading = false;
          this.onClose();
        },
        err => {
          this.isLoading = false;
          console.log(err);
          this.openSnackBar(err);
        }
      );
    }
    this.postForm.reset();
  }

  openSnackBar(val: string) {
    this._snackBar.open(val, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

//edit dialog
@Component({
  selector: 'edit-blog',
  templateUrl: './edit-blog.html',
  styleUrls: ['./my-blog-list.component.css']
})

export class EditBlog {
  isLoading = false;

  constructor(public dialogRef: MatDialogRef<EditBlog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, private _snackBar: MatSnackBar, private blogService:BlogsService) { }

  editForm = this.fb.group({
    title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
    content: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(1000)]),
  });

  ngOnInit(): void {
    this.editForm.patchValue({
      title: this.data.title,
      content: this.data.content
    });    
  }

  onSubmit() {

    this.isLoading = true;
    const title = this.editForm.get('title').value;
    const content = this.editForm.get('content').value;
    
    const userData: {
      tokenData: any;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!!userData) {
      this.blogService.updateBlogById(this.data.blogId, title, content, userData.tokenData).subscribe(
        data => {          
          this.openSnackBar('Updated blog successfully.')
          this.isLoading = false;
          this.onClose();
        },
        err => {
          this.isLoading = false;
          console.log(err);
          this.openSnackBar(err);
        }
      );
    }
    this.editForm.reset();
  }

  openSnackBar(val: string) {
    this._snackBar.open(val, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
