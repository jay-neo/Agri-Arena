"use client";

import {
  Box,
  Table,
  Paper,
  Tooltip,
  Toolbar,
  TableRow,
  Checkbox,
  TableCell,
  TableBody,
  TableHead,
  Typography,
  IconButton,
  useMediaQuery,
  TableContainer,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import * as React from "react";
import Image from "next/image";
import { Delete } from "~/lib/arena-icons";
import { visuallyHidden } from "@mui/utils";
import { alpha } from "@mui/material/styles";
import { fullFormatDate2 } from "~/lib/formatters/date";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ExperimentFormState } from "~/app/server/experiments/validation";
import { redirect } from "next/navigation";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Experiments_Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "nitrogen", numeric: true, disablePadding: false, label: "Nitrogen" },
  {
    id: "phosphorus",
    numeric: true,
    disablePadding: false,
    label: "Phosphorus",
  },
  { id: "potassium", numeric: true, disablePadding: false, label: "Potassium" },
  {
    id: "temperature",
    numeric: true,
    disablePadding: false,
    label: "Temperature(°C)",
  },
  {
    id: "humidity",
    numeric: true,
    disablePadding: false,
    label: "Humidity(%)",
  },
  {
    id: "moisture",
    numeric: true,
    disablePadding: false,
    label: "Moisture(%)",
  },
  { id: "ph", numeric: true, disablePadding: false, label: "pH" },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "TimeStamp",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Experiments_Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Experiments_Data) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {numSelected > 0 && (
          <TableCell padding="checkbox" style={{ fontWeight: 400 }}>
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all experiments" }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            align="left"
            scope="row"
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ fontWeight: 400 }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({
  data,
  numSelected,
  startDate,
  endDate,
  actionOnData,
  setNumSelected,
}: {
  data: string[];
  actionOnData: (
    state: ExperimentFormState,
    formData: FormData
  ) => Promise<ExperimentFormState>;
  numSelected: number;
  startDate: string;
  endDate: string;
  setNumSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [state, action] = useFormState(actionOnData, undefined);
  React.useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      if (state?.redirect) {
        redirect(`/activity`);
      }
      setNumSelected([]);
    } else if (state?.error) {
      toast.error(state.error);
      setNumSelected([]);
    }
  }, [state?.success, state?.error, setNumSelected]);

  const neoAction = async () => {
    const formData = new FormData();
    data.forEach((id) => {
      formData.append("experiment", id);
    });
    await action(formData);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <div className="flex flex-col justify-between md:mx-40 md:flex-row w-full">
          <div>
            <span className="text-sm font-bold">{"From: "}</span>
            <span className="text-sm">{startDate}</span>
          </div>
          <div>
            <span className="text-sm font-bold">{"To: "}</span>
            <span className="text-sm">{endDate}</span>
          </div>
        </div>
      )}
      {numSelected > 0 ? (
        <form action={neoAction}>
          <Tooltip title="Delete">
            <DeleteButton />
          </Tooltip>
        </form>
      ) : (
        <></>
      )}
    </Toolbar>
  );
}

const DeleteButton: React.FC = () => {
  const { pending } = useFormStatus();
  return (
    <IconButton
      type="submit"
      disabled={pending}
      disableFocusRipple={pending}
      disableTouchRipple={pending}
    >
      <Image src={Delete} alt="Delete" className="dark:invert" />
    </IconButton>
  );
};

export default function MainTable({
  data,
  actionOnData,
  startDate,
  endDate,
}: {
  data: Experiments_Data[];
  actionOnData: (
    state: ExperimentFormState,
    formData: FormData
  ) => Promise<ExperimentFormState>;
  startDate: string;
  endDate: string;
}) {
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] =
    React.useState<keyof Experiments_Data>("createdAt");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Experiments_Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, backgroundColor: "inherit" }}>
        <EnhancedTableToolbar
          data={selected}
          actionOnData={actionOnData}
          numSelected={selected.length}
          startDate={startDate}
          endDate={endDate}
          setNumSelected={setSelected}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: isSmallScreen ? 200 : 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      {selected.length > 0 && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        // padding="none"
                        align="left"
                      >
                        {row.nitrogen}
                      </TableCell>
                      <TableCell align="left">{row.phosphorus}</TableCell>
                      <TableCell align="left">{row.potassium}</TableCell>
                      <TableCell align="left">{row.temperature}</TableCell>
                      <TableCell align="left">{row.humidity}</TableCell>
                      <TableCell align="left">{row.moisture}</TableCell>
                      <TableCell align="left">{row.ph}</TableCell>
                      <TableCell align="left">
                        {fullFormatDate2(row.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
