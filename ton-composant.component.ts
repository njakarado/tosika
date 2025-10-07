// ton-composant.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ageRangeValidator } from './age-range.validator';

@Component({
  selector: 'app-ton-composant',
  templateUrl: './ton-composant.component.html',
  styleUrls: ['./ton-composant.component.scss']
})
export class TonComposant implements OnInit {
  form: FormGroup;
  listOfOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        id: [null],
        productionId: [null, Validators.required],
        minAge: [0, [Validators.required, Validators.min(0)]],
        maxAge: [0, [Validators.required, Validators.min(0)]],
        isReporting: [false],
        isLegality: [false],
        selectedOptions: [[]],
      },
      {
        validators: ageRangeValidator('minAge', 'maxAge'),
      }
    );

    // Met à jour la validation à chaque changement
    this.form.get('minAge')?.valueChanges.subscribe(() => this.form.updateValueAndValidity());
    this.form.get('maxAge')?.valueChanges.subscribe(() => this.form.updateValueAndValidity());
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      // Traiter la soumission ici
    }
  }
}
