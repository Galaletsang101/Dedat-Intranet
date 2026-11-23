import { useEffect, useRef } from "react";

/*
 * Shared modal shell for Admin Center create/edit dialogs: closes on
 * Escape, closes on overlay click (not on content click), moves focus to
 * the dialog on open, and exposes the accessible dialog role/labelling
 * every admin modal needs.
 */
function AdminModal({ titleId, title, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default AdminModal;
