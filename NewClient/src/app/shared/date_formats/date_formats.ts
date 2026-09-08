import { MatDateFormats } from "@angular/material/core";

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM yyyy', // <-- customize this (e.g., "Jun 2025")
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM yyyy',
    }
}