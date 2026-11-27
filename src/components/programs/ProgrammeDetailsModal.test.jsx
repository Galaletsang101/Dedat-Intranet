import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import ProgrammeDetailsModal from "./ProgrammeDetailsModal";
import * as subProgrammesService from "../../services/subProgrammesService";

vi.mock("../../services/subProgrammesService");

const department = {
  id: 1,
  name: "Tourism",
  description: "Grows the provincial tourism sector.",
  status: "Active",
  employee_count: "12",
  sub_programme_count: "2",
};

const activeSub = {
  id: 10,
  department_id: 1,
  name: "Destination Marketing",
  description: "Promotion of the Northern Cape as a destination.",
  status: "Active",
};

const inactiveSub = {
  id: 11,
  department_id: 1,
  name: "Tourism Safety Monitors",
  description: "Visitor safety monitoring programme.",
  status: "Inactive",
};

function renderModal(overrides = {}) {
  const onClose = vi.fn();

  const utils = render(
    <ProgrammeDetailsModal
      department={department}
      isAdmin={false}
      onClose={onClose}
      {...overrides}
    />
  );

  return { ...utils, onClose };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ProgrammeDetailsModal - loading and listing", () => {
  it("shows a loading state before sub-programmes resolve", async () => {
    let resolveFn;
    subProgrammesService.getSubProgrammes.mockReturnValue(
      new Promise((resolve) => {
        resolveFn = resolve;
      })
    );

    renderModal();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolveFn([activeSub]);
    await waitFor(() => expect(screen.getByText("Destination Marketing")).toBeInTheDocument());
  });

  it("shows an error state when the fetch fails", async () => {
    subProgrammesService.getSubProgrammes.mockRejectedValue(new Error("Network down"));

    renderModal();

    expect(await screen.findByText(/network down/i)).toBeInTheDocument();
  });

  it("shows a professional empty state with no Add CTA for non-admins", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([]);

    renderModal({ isAdmin: false });

    expect(await screen.findByText(/no sub-programmes/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add sub-programme/i })).toBeNull();
  });

  it("shows an Add Sub-Programme CTA in the empty state for admins", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([]);

    renderModal({ isAdmin: true });

    expect(await screen.findByRole("button", { name: /add sub-programme/i })).toBeInTheDocument();
  });

  it("shows only Active sub-programmes to a non-admin", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub, inactiveSub]);

    renderModal({ isAdmin: false });

    expect(await screen.findByText("Destination Marketing")).toBeInTheDocument();
    expect(screen.queryByText("Tourism Safety Monitors")).toBeNull();
  });

  it("shows both Active and Inactive sub-programmes to an admin, with a status pill", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub, inactiveSub]);

    renderModal({ isAdmin: true });

    expect(await screen.findByText("Destination Marketing")).toBeInTheDocument();
    expect(screen.getByText("Tourism Safety Monitors")).toBeInTheDocument();
  });

  it("renders only a single dialog element for the whole modal", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub]);

    renderModal({ isAdmin: true });
    await screen.findByText("Destination Marketing");

    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });
});

describe("ProgrammeDetailsModal - drill-down navigation", () => {
  it("opens the sub-programme detail view within the same dialog on View Details", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub]);

    renderModal({ isAdmin: false });
    await screen.findByText("Destination Marketing");

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    expect(screen.getByText(/promotion of the northern cape/i)).toBeInTheDocument();
    expect(screen.getByText(/tourism/i, { selector: ".subprog-parent" })).toBeInTheDocument();
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });

  it("returns to the programme view on Back without closing the modal", async () => {
    const { onClose } = renderModal({ isAdmin: false });
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub]);
    await screen.findByText("Destination Marketing");

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));
    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(screen.getByText("Destination Marketing")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes entirely via the close button", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub]);
    const { onClose } = renderModal();
    await screen.findByText("Destination Marketing");

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub]);
    const { onClose } = renderModal();
    await screen.findByText("Destination Marketing");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalled();
  });
});

describe("ProgrammeDetailsModal - admin actions", () => {
  it("hides Edit/Deactivate controls in the sub-programme detail view for non-admins", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub]);
    renderModal({ isAdmin: false });
    await screen.findByText("Destination Marketing");

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    expect(screen.queryByRole("button", { name: /^edit$/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /deactivate/i })).toBeNull();
  });

  it("shows Edit/Deactivate controls in the sub-programme detail view for admins", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub]);
    renderModal({ isAdmin: true });
    await screen.findByText("Destination Marketing");

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    expect(screen.getByRole("button", { name: /^edit$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /deactivate/i })).toBeInTheDocument();
  });

  it("creates a sub-programme via the Add form and returns to the list", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([]);
    subProgrammesService.createSubProgramme.mockResolvedValue({
      id: 99,
      department_id: 1,
      name: "New Sub-Programme",
      description: "",
      status: "Active",
    });

    renderModal({ isAdmin: true });
    fireEvent.click(await screen.findByRole("button", { name: /add sub-programme/i }));

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Sub-Programme" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(subProgrammesService.createSubProgramme).toHaveBeenCalledWith(1, {
        name: "New Sub-Programme",
        description: "",
      })
    );
    expect(await screen.findByText("New Sub-Programme")).toBeInTheDocument();
  });

  it("deactivates a sub-programme after confirmation", async () => {
    subProgrammesService.getSubProgrammes.mockResolvedValue([activeSub]);
    subProgrammesService.deactivateSubProgramme.mockResolvedValue({
      ...activeSub,
      status: "Inactive",
    });

    renderModal({ isAdmin: true });
    await screen.findByText("Destination Marketing");
    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    fireEvent.click(screen.getByRole("button", { name: /deactivate/i }));
    fireEvent.click(screen.getByRole("button", { name: /yes, deactivate/i }));

    await waitFor(() =>
      expect(subProgrammesService.deactivateSubProgramme).toHaveBeenCalledWith(10)
    );
  });
});
