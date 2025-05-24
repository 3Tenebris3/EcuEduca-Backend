export interface LoginDTO {
  email:    string;
  password: string;
}

export interface RegisterDTO {
  id?:          string;
  email:        string;
  password:     string;
  displayName:  string;
  role?:        'student' | 'teacher' | 'admin' | 'parent';
}
