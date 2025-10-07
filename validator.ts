<form [formGroup]="form">
  <!-- Champ minAge -->
  <nz-form-item>
    <nz-form-label nzRequired>Âge minimum</nz-form-label>
    <nz-form-control [nzErrorTip]="minAgeErrorTpl">
      <input nz-input type="number" formControlName="minAge" placeholder="Âge minimum" />
    </nz-form-control>

    <ng-template #minAgeErrorTpl let-control>
      @if (control.errors?.required) {
        <span>L'âge minimum est requis.</span>
      }
      @if (control.errors?.minAgeMustBeLess) {
        <span>L'âge minimum doit être inférieur à l'âge maximum.</span>
      }
    </ng-template>
  </nz-form-item>

  <!-- Champ maxAge -->
  <nz-form-item>
    <nz-form-label nzRequired>Âge maximum</nz-form-label>
    <nz-form-control [nzErrorTip]="maxAgeErrorTpl">
      <input nz-input type="number" formControlName="maxAge" placeholder="Âge maximum" />
    </nz-form-control>

    <ng-template #maxAgeErrorTpl let-control>
      @if (control.errors?.required) {
        <span>L'âge maximum est requis.</span>
      }
      @if (control.errors?.maxAgeMustBeGreater) {
        <span>L'âge maximum doit être supérieur à l'âge minimum.</span>
      }
    </ng-template>
  </nz-form-item>

  <!-- Autres champs... -->
</form>
ngOnInit() {
  this.form = this.fb.group(
    {
      minAge: [0, [Validators.required, Validators.min(0)]],
      maxAge: [0, [Validators.required, Validators.min(0)]],
    },
    {
      validators: ageRangeValidator('minAge', 'maxAge'),
    }
  );

  // Met à jour la validation à chaque changement
  this.form.get('minAge')?.valueChanges.subscribe(() => this.form.updateValueAndValidity());
  this.form.get('maxAge')?.valueChanges.subscribe(() => this.form.updateValueAndValidity());
}
