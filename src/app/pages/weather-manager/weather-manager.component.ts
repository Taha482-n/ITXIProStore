import { Component, OnInit } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-weather-manager',
  template: `
    <h2>Manage Weather Data</h2>
    <form [formGroup]="weatherForm" (ngSubmit)="saveSelection()">
      <mat-radio-group formControlName="weatherOption">
        <mat-radio-button value="current">Current Weather</mat-radio-button>
        <br />
        <mat-radio-button value="past">Past 10 Days Weather</mat-radio-button>
        <br />
        <mat-radio-button value="archive">Archive Weather</mat-radio-button>
      </mat-radio-group>
      <br />
      <button mat-raised-button color="primary" type="submit">
        Save Selection
      </button>
    </form>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      h2 {
        font-size: 1.8rem;
        font-weight: 500;
        color: #2766DA;
        margin-bottom: 20px;
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        max-width: 400px;
        width: 100%;
      }

      mat-radio-group {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: flex-start;
        font-size: 1rem;
        color: #333;
      }

      mat-radio-button {
        padding: 10px 0;
        font-weight: 400;
        color: #333;
      }

      button[type="submit"] {
        margin-top: 20px;
        width: 100%;
        font-weight: bold;
        font-size: 1rem;
        text-transform: uppercase;
        border-radius: 25px;
        transition: background-color 0.3s;
      }

      button[type="submit"]:hover {
        background-color: #1d4ca0;
      }
    `,
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    MatRadioModule,
  ],
})
export class WeatherManagerComponent implements OnInit {
  weatherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore
  ) {
    this.weatherForm = this.fb.group({
      weatherOption: ['current'],
    });
  }

  ngOnInit() {
    this.loadSelection();
  }

  async loadSelection() {
    const docRef = doc(this.firestore, 'settings/weather');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      this.weatherForm.patchValue({
        weatherOption: data['weatherOption'],
      });
    }
  }

  async saveSelection() {
    const docRef = doc(this.firestore, 'settings/weather');
    await setDoc(docRef, {
      weatherOption: this.weatherForm.value.weatherOption,
    });
    alert('Weather option saved successfully!');
  }
}
