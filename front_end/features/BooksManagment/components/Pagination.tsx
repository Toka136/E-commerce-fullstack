"use client";

import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { paginationT } from "../types/Books";

export default function CustomPageination({count,page,onchange}:paginationT) {
 console.log("count",count)
  return (
      <Pagination
        count={count}
        page={page}
        onChange={onchange}
        color="primary"
      />
  );
}