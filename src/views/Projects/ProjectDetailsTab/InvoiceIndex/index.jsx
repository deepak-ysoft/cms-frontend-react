import React, { useState } from "react";
import InvoiceList from "./InvoiceList";
import InvoiceForm from "./InvoiceForm";
import InvoiceDetails from "./InvoiceDetails";
import { Box } from "@mui/material";

export default function InvoiceIndex({ projectId }) {
  const [view, setView] = useState("list"); // list | add | edit | details
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleAdd = () => {
    setView("add");
    setSelectedInvoice(null);
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setView("edit");
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setView("details");
  };

  const handleBackToList = () => {
    setView("list");
  };

  return (
    <Box>
      {view === "list" && (
        <InvoiceList
          projectId={projectId}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onView={handleViewDetails}
        />
      )}

      {view === "add" && (
        <InvoiceForm
          projectId={projectId}
          mode="add"
          onCancel={handleBackToList}
          onSuccess={handleBackToList}
        />
      )}

      {view === "edit" && (
        <InvoiceForm
          projectId={projectId}
          mode="edit"
          invoiceData={selectedInvoice}
          onCancel={handleBackToList}
          onSuccess={handleBackToList}
        />
      )}

      {view === "details" && (
        <InvoiceDetails invoice={selectedInvoice} onBack={handleBackToList} />
      )}
    </Box>
  );
}
