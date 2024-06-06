"use client";

import React from "react";
import { useRouter } from "next/router";
import { Toolbar, Typography, Tooltip, IconButton } from "@mui/material";
import Image from "next/image";
import { alpha } from "@mui/material/styles";
import { Delete } from "~/lib/arena-icons";
import { redirect } from "next/navigation";

type EnhancedTableToolbarProps = {
  data: string[];
  actionOnData: (ids: string[]) => Promise<boolean>;
  numSelected: number;
  startDate: string;
  endDate: string;
};

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
  data,
  actionOnData,
  numSelected,
  startDate,
  endDate,
}) => {
  // const [isMounted, setIsMounted] = React.useState(false);
  // React.useEffect(() => {
  //   setIsMounted(true);
  // }, []);
  // if (!isMounted) {
  //   return null;
  // }

  // const router = useRouter();

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
        <Tooltip title="Delete">
          <IconButton
            type="button"
            onClick={async () => {
              const res = await actionOnData(data);
              // res ? redirect(`/activity`) : null;
            }}
          >
            <Image src={Delete} alt="Delete" className="dark:invert" />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
