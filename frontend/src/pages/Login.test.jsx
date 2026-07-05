import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";

const mockNavigate = jest.fn();
const mockLoginUser = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../api/auth", () => ({
  loginUser: (...args) => mockLoginUser(...args),
}));

describe("Login", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLoginUser.mockReset();
    localStorage.clear();
  });

  test("redirects to dashboard after successful admin login", async () => {
    mockLoginUser.mockResolvedValue({
      user: { role: "admin" },
      token: "sample-token",
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/proposals");
    });
  });
});
