import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, map} from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario, DobleAutenticacion, LoginUser } from '../interfaces/usuario';
import { Permiso } from '../interfaces/permisos'; // Ajusta la ruta si es necesario
import { CatalogoService } from './catalogo.service';
import { SolicitudRegistroSistema } from '../interfaces/solicitud-registro';
import { baseOut } from '../interfaces/utils/utils/baseOut';
import { EstadoChatService } from './asistentes/estado-chat.service';
import { PermisosService } from './permisos.service';
/*import { EstadoChatService } from './asistentes/estado-chat.service';*/
import { Subject } from 'rxjs';
import { OpenIaService } from './asistentes/openIA.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl: string = environment.baseURL;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser: Observable<Usuario>;
  public sessionWarning$ = new Subject<void>();
  private sessionTimeout = 30 * 60 * 1000;
  private sessionActivityTimeout = 15 * 60 * 1000;
  private timer: any;
  private warningTime: any;
  public sessionReset$ = new Subject<void>();

  constructor(private http: HttpClient, private router: Router, private readonly catalogoService: CatalogoService, 
    private OpenIaService: OpenIaService, private readonly openIaService: OpenIaService,
    private readonly permisosService: PermisosService, private estadoChatService: EstadoChatService) {
    this.currentUser = this.currentUserSubject.asObservable();
    this.checkInitialSession();
  }
  private checkInitialSession() {
    const currentUser = localStorage.getItem('currentUser');
    const lastActivity = localStorage.getItem('lastActivity');

    if (currentUser && lastActivity) {
      const timeDiff = Date.now() - parseInt(lastActivity);
      if (timeDiff > this.sessionTimeout) {
        this.logout('La sesión ha expirado: login service');
      }
    }
  }
  login(user: string, pass: string, ip: string) {
    const datos = { usuario: user, password: pass, ip: ip };
    return this.http.post<any>(this.baseUrl + "api/Login/Autenticacion", datos)
      .pipe(map(usuario => {
        let user = usuario;
        if (user.idUsuario > 0) {
          localStorage.setItem('currentUser', JSON.stringify(user.idUsuario));
          localStorage.setItem('tipoUsuario', user.tipoUsuario);
          localStorage.setItem('alias', user.alias);
          localStorage.setItem('idEmpresa', user.idEmpresa);
          localStorage.setItem('username', datos.usuario);
          localStorage.setItem('nombre', user.nombre);
          localStorage.setItem('apellidoPaterno', user.apellidoPaterno);
          localStorage.setItem('apellidoMaterno', user.apellidoMaterno);
          localStorage.setItem('correo', user.correo);
          localStorage.setItem('puesto', user.puesto);
          localStorage.setItem('numeroTelefono', user.telefono);
          localStorage.setItem('imagenPerfil', user.archivoImagen);
          localStorage.setItem('lastActivity', Date.now().toString());
          localStorage.setItem('licencia', user.licencia);
          localStorage.setItem('cantidadUsuarios', user.cantidadUsuarios);
          localStorage.setItem('cantidadOportunidades', user.cantidadOportunidades);
          this.currentUserSubject.next(user);
          sessionStorage.setItem('sesion', window.btoa(JSON.stringify(user)));
          sessionStorage.setItem('Usuario', user.nombre);
          sessionStorage.setItem('IdUsuario', user.idUsuario);
          sessionStorage.setItem('IdTipoUsuario', user.idRol);
          sessionStorage.setItem('IdEmpresa', user.idEmpresa);
          sessionStorage.setItem('Empresa', user.Empresa);
          sessionStorage.setItem('SesionId', user.sesionId);
          this.catalogoService.cargarCatalogos(user.idEmpresa);
          this.cargarPermisosUsuario(user.idRol, user.idEmpresa);
          this.startSessionTimer();
          this.OpenIaService.inicializarCacheIdsAsync(user.idUsuario, 7).subscribe({
                next: (response) => {
                  console.log('Cache inicializado exitosamente', response);
                },
                error: (error) => {
                  console.error('Error al inicializar cache', error);
                }
              });
        }
        return user;
      }));
  }

  cargarPermisosUsuario(idRol:number, idEmrpesa: number):void {
    this.permisosService.getPermisosPorRol(idRol, idEmrpesa).subscribe({
      next: (result: Permiso[]) => {
          sessionStorage.setItem('permisos', window.btoa(JSON.stringify(result)));
      },
      error: (error: any) => {
        console.error('Error al cargar los permisos del usuario:', error);
      },
    });
  }
  reenviarTwoFactor(user: string, pass: string) {
    const datos = { usuario: user, password: pass };
    return this.http.post<any>(this.baseUrl + "api/Login/Autenticacion", datos);
  }

  startSessionTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if(this.warningTime){
      clearTimeout(this.warningTime);
    }
    console.log('Warning time: '+ this.warningTime);
    this.warningTime = setTimeout(() => {
      this.sessionWarning$.next();
      console.log('Session warning triggered desde login: '+ this.sessionActivityTimeout);
    }, this.sessionActivityTimeout);
    
    this.timer = setTimeout(() => {
    }, this.sessionTimeout);
  }

  resetTimer() {
    localStorage.setItem('lastActivity', Date.now().toString());
    this.startSessionTimer();
    this.sessionReset$.next();
  }
  logout(motivo: string): void {
    const sesionId = sessionStorage.getItem('SesionId') ?? '';
    let data = { idUsuario: this.obtenerIdUsuario(), idEmpresa: this.obtenerIdEmpresa(), sesionId: sesionId, motivoCerrarSesion: motivo, usuario: '', password: ''};
    
    this.http.post(`${this.baseUrl}api/Login/Logout`, data, { responseType: 'text' })
      .pipe(
        finalize(() => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('tipoUsuario');
          localStorage.removeItem('username');
          localStorage.removeItem('lastActivity');
          localStorage.removeItem('nombre');
          localStorage.removeItem('correo');

          sessionStorage.clear();
          this.OpenIaService.limpiarCacheBot(this.obtenerIdUsuario(), 7).subscribe({
            next: (response) => {
              console.log('Cache limpiado exitosamente', response);
            },
            error: (error) => {
              console.error('Error al limpiar cache', error);
            }
          });
          if (this.timer) {
            clearTimeout(this.timer);
          }
          clearTimeout(this.warningTime);
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Sesión cerrada exitosamente');
        },
        error: (error) => {
          console.log('Error al cerrar sesión:', error);
        }
      });
  }

  handleSessionExpired(): void {
    console.log('La sesión ha expirado');
    this.logout('La sesión ha expirado: handleSessionExpired');
  }

  verificarSesion() {
    if (!localStorage.getItem('currentUser')) {
      this.logout('No se encuentra usuario activo');
      this.router.navigate(['/']);
    }
  }

  desencriptaSesion(): LoginUser {
    const sesion = sessionStorage.getItem("sesion");
    if (sesion) {
      return JSON.parse(window.atob(sesion));
    } else {
      return {} as LoginUser;
    }
  }

  desencriptaPermiso(): any[] {
    const sesion = sessionStorage.getItem("permisos");
    if (sesion) {
      return JSON.parse(window.atob(sesion));
    } else {
      return [];
    }
  }

  obtenerUsuarioSesion(): LoginUser | null {
    const sesion = this.desencriptaSesion();
    if (sesion) {
      return sesion;
    }
    return null;
  }

  obtenerPermitirDecimales(): boolean {
    const valor = sessionStorage.getItem('permitirDecimales');
    console.log('Permitir decimales desde sessionStorage:', valor);
    return valor === 'true';
  }

  obtenerPermitirDecimalesDesdeApi(): Observable<boolean> {
  const idEmpresa = this.obtenerIdEmpresa(); 
  return this.http
    .get<{ permitirDecimales: boolean }>(
      `${this.baseUrl}api/Login/ObtenerPermitirDecimales`,{ params: { idEmpresa: idEmpresa.toString() } }
    )
    .pipe(
      map(resp => {
        const valor = resp?.permitirDecimales ?? false;
        sessionStorage.setItem('permitirDecimales', valor ? 'true' : 'false');
        return valor;
      })
    );
}


  obtenerIdEmpresa(): number {
    const sesion = this.desencriptaSesion();
    if (sesion?.idEmpresa) {
      return sesion?.idEmpresa;
    }
    return 0;
  }
  obtenerEmpresa(): string {
    const sesion = this.desencriptaSesion();
    if (sesion?.empresa) {
      return sesion?.empresa;
    }
    return "";
  }
  obtenerAlias(): string {
    const sesion = this.desencriptaSesion();
    if (sesion?.alias) {
      return sesion?.alias;
    }
    return '';
  }

  obtenerRolUsuario(): number {
    const sesion = this.desencriptaSesion();
    if (sesion?.idRol) {
      return sesion?.idRol;
    }
    return 0;
  }

  obtenerIdUsuario(): number {
    const sesion = this.desencriptaSesion();
    if (sesion?.idUsuario) {
      return sesion?.idUsuario;
    }
    return 0;
  }
  obtenerPermisosUsuario(): any[] {
    const permiso = this.desencriptaPermiso();
    if (permiso) {
      return permiso;
    }
    return [];
  }
  recuperarContrasena(user: string) {
    let datos = { usuario: user };
    return this.http.get<any>(this.baseUrl + "api/Login/RecuperarContrasena", { params: datos });
  }
  DobleAutenticacion(usuariodosPasos: DobleAutenticacion) {
    return this.http.post<any>(this.baseUrl + "api/Login/VerificarCodigoDobleAutenticacion", usuariodosPasos);
  }

  postSolicitudRegistro(data: SolicitudRegistroSistema): Observable<baseOut> {
    return this.http.post<baseOut>(this.baseUrl + 'api/Login/GuardarSolicitudRegistro', data);
  }

  postReenviarCodigo(correo: string): Observable<baseOut> {
    return this.http.post<baseOut>(this.baseUrl + 'api/Login/ReenviarCodigo?correo=' + encodeURIComponent(correo), null);
  }


  cambiarPassword(formData: FormData): Observable<baseOut> {
    const headers = new HttpHeaders();
    return this.http.post<baseOut>(this.baseUrl + 'api/Login/CambioPassword', formData, { headers });
  }

  obtenerVersion(): Observable<baseOut> {
    return this.http.get<any>(this.baseUrl + 'api/Login/ObtenerVersion');
  }

  obtenerUrlImagenEmpresa(_idEmpresa: number): Observable<string> {
    return this.http.get<any>(`${this.baseUrl}api/Login/ObtenerImagenEmpresa/`, {
      params: { idEmpresa: _idEmpresa }
    }).pipe(
      map(data => data.urlImagen ?? '')
    );
  }

  obtenerDatosUsuarioLogueado(): {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    nombreCompleto: string;
    puesto: string;
    numeroTelefono: string;
  } {
    const nombre = localStorage.getItem('nombre') || '';
    const apellidoPaterno = localStorage.getItem('apellidoPaterno') || '';
    const apellidoMaterno = localStorage.getItem('apellidoMaterno') || '';
    const correo = localStorage.getItem('correo') || '';
    const puesto = localStorage.getItem('puesto') || '';
    const numeroTelefono = localStorage.getItem('numeroTelefono') || '';

    // Concatenar nombre completo
    const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
    
    return {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      puesto,
      numeroTelefono,
      nombreCompleto
    };
  }

}
