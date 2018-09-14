export default class StorageService {
  saveInfo(token: string, username: string, avatar: string, role: string){
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", avatar);
    localStorage.setItem("role", role);
  }

  getToken(): string {
      return localStorage.getItem("token");
  }

  getUsername(): string {
      return localStorage.getItem("username");
  }

  getAvatar(): string {
      return localStorage.getItem("avatar");
  }

  getRole(): string {
      return localStorage.getItem("role");
  }

  clear() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
      localStorage.removeItem("role");
  }
}
