import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { getHalfHourIntervals } from "../../shared/helpers/time-helper";

export const dateRangeValidator: ValidatorFn = (
    control: AbstractControl): ValidationErrors | null => {
            const start = control.get('start')?.value;
            const end = control.get('end')?.value;

            var timeArray: string[] = getHalfHourIntervals();

            const startIndex = timeArray.indexOf(start);
            const endIndex = timeArray.indexOf(end);

            return endIndex > startIndex 
                ? { identityRevealed: true }
                : null
        }