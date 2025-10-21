import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastr = inject(ToastrService);

  success(message: string, title = 'Sucesso'): void {
    this.toastr.success(message, title);
  }

  error(message: string, title = 'Erro'): void {
    this.toastr.error(message, title);
  }

  info(message: string, title = 'Informacao'): void {
    this.toastr.info(message, title);
  }

  warning(message: string, title = 'Atencao'): void {
    this.toastr.warning(message, title);
  }
}
