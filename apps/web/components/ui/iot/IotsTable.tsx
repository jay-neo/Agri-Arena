"use client";

import {
  DataGrid,
  GridRowId,
  GridColDef,
  GridRowsProp,
  GridToolbarProps,
  GridRowModesModel,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import * as React from "react";
import Image from "next/image";
import { IoTForm } from "./form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { Add, Edit, Delete } from "~/lib/arena-icons";
import { updateIot, deleteIot, createIot } from "~/app/server/iot";

interface EditToolbarProps extends GridToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

const statusColors: { [key: string]: string } = {
  active: "green",
  inactive: "red",
  maintenance: "orange",
};

const StatusCell = styled("div")<{ status: string }>(({ status }) => ({
  backgroundColor: "inherit",
  border: `2px solid ${statusColors[status] || "gray"}`,
  minWidth: "40px",
  borderRadius: "10rem",
  paddingInline: "0.5rem",
  fontWeight: "bold",
  textAlign: "center",
}));

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <GridToolbarContainer className="flex items-end justify-end py-2">
        <Button
          color="primary"
          startIcon={
            <Image
              src={Add}
              alt="Add"
              width={20}
              height={20}
              className="dark:invert"
            />
          }
          onClick={() => setIsOpen(true)}
          className="font-bold text-base"
        >
          Add IoT
        </Button>
      </GridToolbarContainer>
      {isOpen && (
        <IoTForm
          formType="create"
          action={createIot}
          setNewRow={setRows}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}

export const IoTsTable = ({ initialData }: { initialData: IoT[] }) => {
  const [rows, setRows] = React.useState<IoT[]>(initialData);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editingData, setEditingData] = React.useState<IoT>();

  const handleEditClick = (id: GridRowId) => () => {
    const data: IoT | undefined = rows.find((row) => row.id === id);
    if (data) {
      setEditingData(data);
      setIsEditing(true);
    }
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      await deleteIot(id as string);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      width: 120,
      editable: true,
    },
    {
      field: "device",
      headerName: "Device ID",
      headerClassName: "super-app-theme--header",
      type: "string",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      type: "string",
      width: 120,
      minWidth: 120,
      editable: false,
      renderCell: (params) => (
        <StatusCell status={params.value as string}>{params.value}</StatusCell>
      ),
    },
    {
      field: "interval",
      headerName: "Interval (Days)",
      headerClassName: "super-app-theme--header",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "location",
      headerName: "Location",
      headerClassName: "super-app-theme--header",
      type: "string",
      width: 105,
      editable: true,
    },
    {
      field: "arena",
      headerName: "Arena",
      headerClassName: "super-app-theme--header",
      type: "string",
      width: 111,
      editable: true,
    },
    {
      field: "arenaLocation",
      headerName: "Arena Location",
      headerClassName: "super-app-theme--header",
      type: "string",
      width: 130,
      editable: false,
    },
    {
      field: "createdAt",
      headerName: "Deployed",
      headerClassName: "super-app-theme--header",
      minWidth: 80,
      width: 100,
      editable: false,
      type: "string", // date
      valueFormatter: (params) => {
        const date = new Date(params);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString();

        return `${day}/${month}/${year}`;
      },
    },
    {
      field: "description",
      headerName: "Description",
      headerClassName: "super-app-theme--header",
      type: "string",
      width: 140,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      width: 85,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={
              <Image
                src={Edit}
                alt="Edit"
                width={20}
                height={20}
                className="dark:invert"
              />
            }
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
              <Image
                src={Delete}
                alt="Delete"
                width={20}
                height={20}
                className="dark:invert"
              />
            }
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          overflowX: "hidden",
          "& .MuiDataGrid-cell": {
            padding: "0 8px",
          },
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#2d2d61" : "#e0cee6",
          "& .super-app-theme--header": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#2d2d61" : "#e0cee6",
          },
        }}
      >
        <DataGrid
          rowHeight={30}
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          editMode="row"
          isCellEditable={() => false}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          slots={{
            toolbar:
              EditToolbar as React.JSXElementConstructor<EditToolbarProps>,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel } as EditToolbarProps,
          }}
        />
      </Box>
      {isEditing && (
        <IoTForm
          formType="edit"
          setRows={setRows}
          action={updateIot}
          data={editingData}
          setIsOpen={setIsEditing}
        />
      )}
    </>
  );
};
