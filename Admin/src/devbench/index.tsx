import { createRoot } from "react-dom/client";
import React from "react";
import IndexRouter from "@/routes";

const container = document.getElementById("wp-devbench");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

// <div className="dark" style={{colorScheme: 'dark'}}>

root.render(<IndexRouter />);
