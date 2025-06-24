export const handleRegister = async (
  username: string,
  password: string,
): Promise<string> => {
  // Simulate a registration process
  if (username && password) {
    return "User registered successfully";
  } else {
    throw new Error("Registration failed");
  }
};

export const handleLogin = async (
  username: string,
  password: string,
): Promise<string> => {
  // Simulate a login process
  if (username === "admin" && password === "password") {
    return "Login successful";
  } else {
    throw new Error("Invalid credentials");
  }
};
