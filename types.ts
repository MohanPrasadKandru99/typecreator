type Employees = {
  id: number; // number
  name: string; // string
  isPermanent: boolean; // boolean
  contactNumbers: string[]; // array of strings
  age?: number; // optional number
  address: {
    street: string;
    city: string;
    zipCode: number;
  }; // object
  department: Departments; // enum
  skills: string[]; // array of strings
  joiningDate: Date; // Date type
  salary: number | null; // union type
  projects: {
    name: string;
    deadline: Date;
    completed: boolean;
  }[]; // array of objects
  metadata: any; // any type
  tags: readonly string[]; // readonly array of strings
  certifications: ReadonlyArray<string>; // readonly array of strings using ReadonlyArray
  callback: (message: string) => void; // function type
  identifiers: [number, string]; // tuple type
};

// Enum example
enum Departments {
  HR = "Human Resources",
  IT = "Information Technology",
  Finance = "Finance",
  Marketing = "Marketing",
}
export interface Post {
  id: number;
  user_id: string;
  username: string;
  profile_picture: string;
  content: string;
  image_url?: string[];
  created_at: string;
  comments: Comment[];
  likes: Like[];
}

export interface Comment {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  username: string;
}

export interface Like {
  id: number;
  user_id: string;
}
export interface NewsFeedProps extends Comment{
  currentUserId: string;
}
