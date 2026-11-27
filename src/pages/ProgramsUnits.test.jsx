import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProgramsUnits from "./ProgramsUnits";
import * as departmentsService from "../services/departmentsService";
import * as authService from "../services/authService";

vi.mock("../services/departmentsService");
vi.mock("../services/authService");

// ProgrammeDetailsModal has its own full test suite; stub it here so this
// file only verifies the page wires the right department into it, without
// needing to also mock subProgrammesService transitively.
vi.mock("../components/programs/ProgrammeDetailsModal", () => ({
  default: ({ department, onClose }) => (
    <div role="dialog" aria-label="stub-programme-modal">
      <p>Modal for: {department.name}</p>
      <button type="button" onClick={onClose}>
        Close Stub Modal
      </button>
    </div>
  ),
}));

const departments = [
  {
    id: 1,
    name: "Tourism",
    description: "Grows the provincial tourism sector.",
    status: "Active",
    employee_count: "12",
    sub_programme_count: "2",
  },
  {
    id: 2,
    name: "Economic Planning",
    description: "Plans provincial economic policy.",
    status: "Active",
    employee_count: "8",
    sub_programme_count: "0",
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <ProgramsUnits />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  authService.isAdmin.mockReturnValue(false);
});

describe("ProgramsUnits - card display", () => {
  it("shows the sub-programme count tag on each card", async () => {
    departmentsService.getDepartments.mockResolvedValue(departments);

    renderPage();

    expect(await screen.findByText(/2 sub-programmes/i)).toBeInTheDocument();
    expect(screen.getByText(/no sub-programmes yet/i)).toBeInTheDocument();
  });
});

describe("ProgramsUnits - opening the programme details popup", () => {
  it("opens the modal for the correct department when the card is clicked", async () => {
    departmentsService.getDepartments.mockResolvedValue(departments);
    renderPage();
    await screen.findByText("Tourism");

    fireEvent.click(screen.getByText("Tourism"));

    expect(await screen.findByText("Modal for: Tourism")).toBeInTheDocument();
  });

  it("opens the modal via the Enter Workspace button", async () => {
    departmentsService.getDepartments.mockResolvedValue(departments);
    renderPage();
    await screen.findByText("Tourism");

    const workspaceButtons = screen.getAllByRole("button", { name: /enter workspace/i });
    fireEvent.click(workspaceButtons[0]);

    expect(await screen.findByText("Modal for: Tourism")).toBeInTheDocument();
  });

  it("closes the modal when the stub's close is invoked", async () => {
    departmentsService.getDepartments.mockResolvedValue(departments);
    renderPage();
    await screen.findByText("Tourism");

    fireEvent.click(screen.getAllByRole("button", { name: /enter workspace/i })[0]);
    await screen.findByText("Modal for: Tourism");

    fireEvent.click(screen.getByRole("button", { name: /close stub modal/i }));

    await waitFor(() =>
      expect(screen.queryByText("Modal for: Tourism")).not.toBeInTheDocument()
    );
  });

  it("does not open the modal when Policies is clicked", async () => {
    departmentsService.getDepartments.mockResolvedValue(departments);
    renderPage();
    await screen.findByText("Tourism");

    fireEvent.click(screen.getAllByRole("button", { name: /^policies$/i })[0]);

    expect(screen.queryByText("Modal for: Tourism")).not.toBeInTheDocument();
  });

  it("does not open the modal when Contacts is clicked, and the contact popup still works", async () => {
    departmentsService.getDepartments.mockResolvedValue(departments);
    renderPage();
    await screen.findByText("Tourism");

    fireEvent.click(screen.getAllByRole("button", { name: /^contacts$/i })[0]);

    expect(screen.queryByText("Modal for: Tourism")).not.toBeInTheDocument();
    expect(screen.getByText("Contact Support")).toBeInTheDocument();
  });
});
