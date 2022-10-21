# PipGo

## Document
 - Postman: https://documenter.getpostman.com/view/23091261/2s83zmMhh1
 - Database: https://docs.google.com/document/d/1VUgAnbKpZ555-_Wb1fYp8SnInsbUrfeJq2sGOUL2WQE/edit?usp=sharing

## Các đối tượng sử dụng 
```
PipGo/
├── Customers/
│   ├── Guest
│   ├── Customer
├── Users/
│   ├── Admin
│   ├── Editor
│   ├── Sale_User
├── Agents/
│   ├── Host
│   ├── Sale_Agent
```

## Tóm tắt nghiệp vụ
 - **[Auth]**: Các thao tác login, logout, quên mật khẩu

 - **[User]**: Các thao tác liên quan đến quản lý tài khoản bao gồm: 
    - Tạo tk mới, xóa tk, xem thông tin tất cả tk (chỉ dành cho Admin) 
    - Xem thông tin tk, cập nhật thông tin tk, đổi mật khẩu 

 - **[Category]**: Các thao tác liên quan đến danh mục ảnh:
    - Danh sách danh mục ảnh (Khu / Căn)
    - Thêm sửa xóa danh mục
 
 - **[FileImage]**: Các thao tác liên quan đến ảnh và file:
    - Danh sách ảnh và file theo Khu hoặc Căn
    - Thêm sửa xóa ảnh và file

 - **[Area]**: Các thao tác liên quan đến Khu nghỉ dưỡng: 
    - Danh sách tất cả các Khu (tất cả trạng thái: maintaining / available / fullybooked)
    - Thêm sửa xóa Khu

 - **[House]**: Các thao tác liên quan đến các Căn trong Khu nghỉ dưỡng: 
    - Danh sách tất cả các Căn (tất cả trạng thái: maintaining / available / fullybooked)
    - Thêm sửa xóa Căn

 - **[Search]**: Các thao tác tìm kiếm:
    - Tìm theo bộ lọc (Tỉnh Thành / Quận Huyện / Lượng Khách)
    - Tìm thông tin của 1 Khu / Căn
    - Danh sách các tỉnh thành có Khu nghỉ dưỡng (bao gồm số lượng Khu)