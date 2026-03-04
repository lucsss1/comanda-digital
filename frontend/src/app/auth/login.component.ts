import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-split">
      <div class="auth-image">
        <div class="auth-image-overlay">
          <div class="auth-image-content">
            <i class="fas fa-fire auth-image-icon"></i>
            <h1>Comanda Digital</h1>
            <p>Sistema completo para gestao do seu restaurante</p>
          </div>
        </div>
      </div>
      <div class="auth-form-side">
        <div class="auth-card">
          <div class="auth-icon"><i class="fas fa-fire"></i></div>
          <h2>Entrar</h2>
          <p class="auth-sub">Acesse sua conta na Comanda Digital</p>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" formControlName="email" placeholder="seu@email.com">
              <span class="error-msg" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Email invalido</span>
            </div>
            <div class="form-group">
              <label>Senha</label>
              <input type="password" class="form-control" formControlName="senha" placeholder="Sua senha">
              <span class="error-msg" *ngIf="form.get('senha')?.invalid && form.get('senha')?.touched">Senha obrigatoria</span>
            </div>
            <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
              <span class="spinner" *ngIf="loading"></span>
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>
          <p class="auth-footer">Nao tem conta? <a routerLink="/registrar">Cadastre-se</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .auth-split { display: flex; min-height: 100vh; margin: -20px; }
    .auth-image {
      flex: 1; position: relative;
      background: linear-gradient(135deg, #F97316 0%, #EA580C 40%, #1E293B 100%);
      display: flex; align-items: center; justify-content: center;
    }
    .auth-image-overlay { text-align: center; color: white; padding: 40px; }
    .auth-image-icon { font-size: 64px; margin-bottom: 16px; display: block; }
    .auth-image-content h1 { font-size: 36px; font-weight: 800; margin-bottom: 8px; }
    .auth-image-content p { font-size: 16px; opacity: 0.85; }
    .auth-form-side {
      flex: 1; display: flex; align-items: center; justify-content: center;
      background: #FFFFFF; padding: 40px;
    }
    .auth-card { width: 100%; max-width: 400px; }
    .auth-icon { text-align: center; margin-bottom: 8px; }
    .auth-icon i { font-size: 36px; color: #F97316; }
    .auth-card h2 { text-align: center; margin-bottom: 4px; color: #0F172A; font-size: 24px; font-weight: 700; }
    .auth-sub { text-align: center; color: #64748B; margin-bottom: 28px; font-size: 14px; }
    .btn-block { width: 100%; justify-content: center; padding: 12px; font-size: 15px; margin-top: 4px; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: #64748B; }
    .auth-footer a { color: #F97316; text-decoration: none; font-weight: 600; }
    .auth-footer a:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      .auth-split { flex-direction: column; }
      .auth-image { min-height: 200px; flex: none; }
      .auth-form-side { padding: 24px; }
    }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.toast.success('Login realizado com sucesso!');
        if (['ADMIN', 'GERENTE', 'COZINHEIRO'].includes(res.usuario.perfil)) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/cardapio']);
        }
      },
      error: () => {
        this.loading = false;
        this.toast.error('Email ou senha invalidos');
      }
    });
  }
}
