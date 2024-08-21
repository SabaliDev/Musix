import { render, screen } from "@testing-library/react";
import Home from "./Home";

test("renders welcome message", () => {
  render(<Home />);
  const linkElement = screen.getByText(/welcome Home/i);
  expect(linkElement).toBeInTheDocument();
});
