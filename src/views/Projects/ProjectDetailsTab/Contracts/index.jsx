import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import {
  AddCircleOutline,
  Edit,
  Delete,
  Download,
  Visibility,
  Close,
  Description,
} from "@mui/icons-material";
import { FaEdit, FaEye } from "react-icons/fa";
import {
  getContractByProject,
  addContract,
  updateContract,
  deleteContract,
} from "../../../../api/Contract";
import { showToast } from "../../../../utils/toastHelper";
import ContractForm from "./ContractForm";
import DeleteDialog from "../../../../shared/components/reusableComponent/DeleteDialog";
import { formatDateTime } from "../../../../utils/formatDateTime";
import { useNavigate } from "react-router-dom";

export function Contracts({ projectId }) {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await getContractByProject(projectId);
      if (res?.isSuccess) setContracts(res.data || []);
    } catch (err) {
      showToast("error", `Failed to fetch contracts : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchContracts();
  }, [projectId]);

  const handleAdd = async (formData) => {
    try {
      const res = await addContract(formData);
      if (res?.isSuccess) {
        showToast("success", res.message);
        setOpenForm(false);
        fetchContracts();
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Add failed");
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      const res = await updateContract(id, formData);
      if (res?.isSuccess) {
        showToast("success", res.message);
        setEditData(null);
        fetchContracts();
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteContract(deleteId);
      if (res?.isSuccess) {
        showToast("success", res.message);
        fetchContracts();
      }
    } catch {
      showToast("error", "Delete failed");
    } finally {
      setOpenDelete(false);
    }
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        mb={2}
        sx={{
          background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
          p: 1,
          borderTopLeftRadius: 8,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "start", md: "space-between" },
        }}
      >
        <Typography variant="h6" fontWeight={600} color="primary" pl={3}>
          Contracts
        </Typography>
        {role === "Admin" && (
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: { xs: "70%", sm: "40%", md: "27%", lg: "20%" },
              mt: { xs: 1, md: 0 },
            }}
            startIcon={<AddCircleOutline />}
            onClick={() => setOpenForm(true)}
          >
            Add Contract
          </Button>
        )}
      </Box>

      {contracts.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            background: "linear-gradient(145deg, #f5f7fa, #e4ebf1)",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
            borderTopLeftRadius: 8,
          }}
        >
          <Description sx={{ fontSize: 60, color: "text.secondary", mb: 1 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            No Contracts Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can add a new contract using the “Add Contract” button above.
          </Typography>
        </Paper>
      ) : (
        <Grid container>
          {contracts.map((contract) => {
            const fileUrl = contract.fileUrl.startsWith("http")
              ? contract.fileUrl
              : `${contract.fileUrl}`;

            return (
              <Grid
                sx={{
                  width: { xs: "100%", md: "50%" },
                  px: { xs: 0, md: 1 },
                  py: 1,
                }}
                key={contract.id}
              >
                <Paper
                  sx={{
                    p: { xs: 1, md: 3 },
                    width: { xs: "100%", sm: "100%" },
                    borderRadius: 3,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
                      p: 0.5,
                      borderTopLeftRadius: 8,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="primary.main"
                      gutterBottom
                      noWrap
                      m="0"
                      pl="10px"
                    >
                      {contract.contractName}
                    </Typography>
                    <Box display="flex" gap={1.5}>
                      <IconButton
                        title="View"
                        sx={{ color: "primary.main" }}
                        onClick={() =>
                          navigate(
                            `/projects/${projectId}/contract/contractDetails/${contract.id}`
                          )
                        }
                      >
                        <FaEye />
                      </IconButton>
                      {role === "Admin" && (
                        <>
                          <IconButton
                            title="Edit"
                            onClick={() => setEditData(contract)}
                            color="secondary"
                          >
                            <FaEdit size={20} />
                          </IconButton>
                          <IconButton
                            title="Delete"
                            color="error"
                            onClick={() => {
                              setDeleteId(contract.id);
                              setOpenDelete(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ my: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <b>Project:</b> {contract.projectName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Billing Type:</b> {contract.billingType}
                    </Typography>
                    {contract.billingType === "Fixed" ? (
                      <Typography variant="body2" color="text.secondary">
                        <b>Fixed Amount:</b>
                        {contract.fixedAmount.toLocaleString()}{" "}
                        {contract.currency}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        <b>Total (Hourly):</b>
                        {contract.totalAmount.toLocaleString()}{" "}
                        {contract.currency}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      <b>Start:</b>{" "}
                      {formatDateTime(contract.startDate, "datetime")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>End:</b> {formatDateTime(contract.endDate, "datetime")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        contract.status === "Active"
                          ? "success.main"
                          : contract.status === "Completed"
                          ? "text.primary"
                          : "error.main"
                      }
                    >
                      <b>Status:</b> {contract.status}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Box display="flex" gap={1.5}>
                      <Box pt={1}>
                        <Typography variant="body2" color="text.secondary">
                          <b>Contract File:</b>
                        </Typography>
                      </Box>
                      <Tooltip title="View File">
                        <IconButton
                          onClick={() => window.open(fileUrl, "_blank")}
                        >
                          <Description color="primary" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Download File">
                        <IconButton
                          onClick={() => {
                            const fileName = contract.fileUrl.split("/").pop();
                            fetch(fileUrl)
                              .then((r) => r.blob())
                              .then((blob) => {
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = fileName;
                                link.click();
                              });
                          }}
                        >
                          <Download color="action" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add Contract Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          variant="h5"
          fontWeight={700}
          color="primary.main"
          sx={{
            background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
          }}
        >
          Add Contract
          <IconButton
            onClick={() => setOpenForm(false)}
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ContractForm projectId={projectId} onSubmit={handleAdd} />
        </DialogContent>
      </Dialog>

      {/* Edit Contract Dialog */}
      {editData && (
        <Dialog
          open={!!editData}
          onClose={() => setEditData(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            variant="h5"
            fontWeight={700}
            color="primary.main"
            sx={{
              background: "linear-gradient(90deg, #e8f0ff, #ffffff)",
            }}
          >
            Edit Contract
            <IconButton
              onClick={() => setEditData(null)}
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <ContractForm
              projectId={projectId}
              contract={editData}
              onSubmit={(formData) => handleEdit(editData.id, formData)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Delete Contract?"
        message="This action cannot be undone."
      />
    </Box>
  );
}
