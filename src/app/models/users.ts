export class UserResponse {
  user: User;
}

export class User {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  mail: string;
  created_on: string;
  last_login_on: string;
  api_key: string;
}
