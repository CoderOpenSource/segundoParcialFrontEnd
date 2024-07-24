import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserModalComponent } from '../../shared/components/user-modal/user-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  rol: {
    id: number | null;
    nombre: string;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserModalComponent, ConfirmModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  users: User[] = [];
  selectedUser: User = {
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    rol: {
      id: null,
      nombre: ''
    }
  };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  toastMessage: string | null = null;
  toastClass: string = '';
  userIdToDelete: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<User[]>('http://192.168.0.18/usuarios/').subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }

  editUser(userId: number) {
    this.selectedUser = this.users.find(user => user.id === userId) || this.selectedUser;
    this.isEditMode = true;
    this.showModal = true;
  }

  confirmDeleteUser(userId: number) {
    this.userIdToDelete = userId;
    this.showConfirmModal = true;
  }

  deleteUser() {
    if (this.userIdToDelete !== null) {
      this.http.delete(`http://192.168.0.18/usuarios/${this.userIdToDelete}`).subscribe(
        () => {
          this.showToast('Usuario eliminado con éxito', 'success');
          this.loadUsers(); // Recargar la lista de usuarios después de eliminar
          this.userIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar el usuario', 'error');
          console.error('Error deleting user', error);
        }
      );
    }
  }

  cancelDelete() {
    this.userIdToDelete = null;
    this.showConfirmModal = false;
  }

  addUser() {
    this.selectedUser = {
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      contrasena: '',
      rol: {
        id: null,
        nombre: ''
      }
    };
    this.isEditMode = false;
    this.showModal = true;
  }

  handleCloseModal() {
    this.showModal = false;
  }

  saveUser(user: User) {
    const userPayload = {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        contrasena: user.contrasena,
        rol: {
            id: user.rol.id
        }
    };

    if (this.isEditMode) {
        // Lógica para actualizar el usuario
        this.http.put<User>(`http://192.168.0.18/usuarios/${user.id}`, userPayload).subscribe(
            response => {
                this.showToast('Usuario actualizado con éxito', 'success');
                this.loadUsers(); // Recargar la lista de usuarios
            },
            error => {
                this.showToast('Error al actualizar el usuario', 'error');
                console.error('Error updating user', error);
            }
        );
    } else {
        // Lógica para crear un nuevo usuario
        this.http.post<User>('http://192.168.0.18/usuarios/', userPayload).subscribe(
            response => {
                this.showToast('Usuario creado con éxito', 'success');
                this.loadUsers(); // Recargar la lista de usuarios
            },
            error => {
                this.showToast('Error al crear el usuario', 'error');
                console.error('Error creating user', error);
            }
        );
    }
    this.handleCloseModal();
  }

  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
  }
}
