import './index.css';
import React from "react";
import ReactDOM from "react-dom";
import { ReactApp } from "./react";

import { using } from "effector-dom";
import { effectorDomApp } from "./effector-dom";

ReactDOM.render(<ReactApp />, document.getElementById("react-root"));
using(document.getElementById("effector-root"), effectorDomApp);
