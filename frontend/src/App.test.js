import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("./components/Navbar", () => () => <div>Navbar</div>);
jest.mock("./components/ProtectedRoute", () => ({ element }) => <>{element}</>);
jest.mock("./pages/Home", () => () => <div>CSR AQUA Home</div>);
jest.mock("./pages/Programs", () => () => <div>Programs</div>);
jest.mock("./pages/ProgramDetail", () => () => <div>Program Detail</div>);
jest.mock("./pages/Login", () => () => <div>Login</div>);
jest.mock("./pages/ProgramDashboard", () => () => <div>Program Dashboard</div>);
jest.mock("./pages/ProposalDashboard", () => () => (
  <div>Proposal Dashboard</div>
));
jest.mock("./pages/chart", () => () => <div>Chart Dashboard</div>);
jest.mock("./context/ToastContext", () => ({
  ToastProvider: ({ children }) => <>{children}</>,
}));
jest.mock("./context/DashboardContext", () => ({
  DashboardProvider: ({ children }) => <>{children}</>,
}));

jest.mock(
  "react-router-dom",
  () => {
    const ReactLib = require("react");
    return {
      BrowserRouter: ({ children }) => <>{children}</>,
      Routes: ({ children }) => <>{children}</>,
      Route: ({ element }) => <>{element || null}</>,
      Navigate: () => <div>Redirect</div>,
      Link: ({ to, children, ...rest }) => (
        <a href={to} {...rest}>
          {children}
        </a>
      ),
      NavLink: ({ to, children, className }) => (
        <a
          href={to}
          className={
            typeof className === "function"
              ? className({ isActive: false })
              : className
          }
        >
          {children}
        </a>
      ),
      useLocation: () => ({ pathname: "/" }),
      useNavigate: () => jest.fn(),
      useParams: () => ({ id: "1" }),
    };
  },
  { virtual: true },
);

import App from "./App";

test("renders app shell smoke test", () => {
  render(<App />);
  expect(screen.getByText(/CSR AQUA Home/i)).toBeTruthy();
});
