// age-range.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageRangeValidator(minAgeControlName: string, maxAgeControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const minAge = formGroup.get(minAgeControlName)?.value;
    const maxAge = formGroup.get(maxAgeControlName)?.value;

    if (minAge === null || maxAge === null) {
      return null;
    }

    if (minAge >= maxAge) {
      formGroup.get(maxAgeControlName)?.setErrors({ maxAgeMustBeGreater: true });
      formGroup.get(minAgeControlName)?.setErrors({ minAgeMustBeLess: true });
      return { ageRangeInvalid: true };
    } else {
      formGroup.get(maxAgeControlName)?.setErrors(null);
      formGroup.get(minAgeControlName)?.setErrors(null);
      return null;
    }
  };
}
