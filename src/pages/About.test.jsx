import { fireEvent, render, screen } from "@testing-library/react";
import About from "./About";

describe("About executive contacts", () => {
  it("shows all source contacts in a navigable carousel with working contact links", () => {
    const contactNames = [
      "Modise Letselebe",
      "Kgalalelo Matsime",
      "Thami Mabija",
      "Tebogo Ngamole",
      "Lizette Wyngaard",
      "Zahid Cader",
      "Adv. Prince Olivier",
      "Mr. Riaan Warie",
      "Mr. Sam Mabilo",
      "Ms. Jean Wilson",
      "Mr. Darryl Christians",
    ];

    render(<About />);

    expect(screen.getByRole("heading", { name: "Modise Letselebe" })).toBeInTheDocument();
    expect(screen.queryByText("Hon. Nomsa Maseko")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous executive contact" })).toBeDisabled();

    contactNames.forEach((name) => {
      fireEvent.click(screen.getByRole("button", { name: `View ${name}` }));
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Previous executive contact" }));
    expect(screen.getByRole("heading", { name: "Ms. Jean Wilson" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "View Thami Mabija" }));
    expect(screen.getByRole("heading", { name: "Thami Mabija" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Thami Mabija" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "View Mr. Darryl Christians" }));
    expect(screen.getByRole("heading", { name: "Mr. Darryl Christians" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:dchristians@ncpg.gov.za"
    );
    expect(screen.getByRole("link", { name: "Phone" })).toHaveAttribute(
      "href",
      "tel:0538021646"
    );
    expect(screen.getByRole("button", { name: "Next executive contact" })).toBeDisabled();
  });
});
