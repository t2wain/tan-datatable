import React from 'react';
import { createRoot } from 'react-dom/client';
import TableExample from "./components/TableExample";

import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.min.css';
import './index.css';

const container = document.getElementById('app-root')!
const root = createRoot(container)
root.render(<TableExample />)