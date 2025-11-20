import React, { useState } from "react";
import { Box } from "@mui/material";
import AllInvoiceList from "./InvoiceList";
import InvoiceForm from "../Projects/ProjectDetailsTab/InvoiceIndex/InvoiceForm";
import InvoiceDetails from "../Projects/ProjectDetailsTab/InvoiceIndex/InvoiceDetails";

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
        <AllInvoiceList
          projectId={projectId}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onView={handleViewDetails}
        />
      )}

      {view === "edit" && (
        <Box sx={{ m: { xs: 1, md: 5 } }}>
          <InvoiceForm
            projectId={projectId}
            mode="edit"
            invoiceData={selectedInvoice}
            onCancel={handleBackToList}
            onSuccess={handleBackToList}
          />
        </Box>
      )}

      {view === "details" && (
        <Box sx={{ m: { xs: 1, md: 5 } }}>
          <InvoiceDetails invoice={selectedInvoice} onBack={handleBackToList} />
        </Box>
      )}
    </Box>
  );
}
