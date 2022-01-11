import {ReactElement} from "react";
import {Column} from "./column";

export interface ColumnMain {
    columns : Column[],
    url: string;
    query?: string;
}
