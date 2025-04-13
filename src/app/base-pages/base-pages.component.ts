import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-base-pages',
  imports: [NgIf],
  templateUrl: './base-pages.component.html',
  styleUrl: './base-pages.component.css',
})
export class BasePagesComponent implements OnInit {
  @Input('color') color: string = '';
  @Input('background') background: string = '';
  @Input('titleSection') titleSection: boolean = true;
  @Input('title') title: string = '';
  @Input('searchbar') searchbar: boolean = true;
  @Input('tabsData') tabsData: Object = [];
  @Input('anyOption') anyOption: boolean = true;
  @Input('optionButton') optionButton: string = 'Any Option';
  
  component!: ElementRef<HTMLElement>
  http!: HttpClient
  constructor() {}

  ngOnInit(): void {
    // this.component?.nativeElement.querySelector('.main')?.setAttribute('style', `background-color: ${this.background}`)
    // this.component?.nativeElement.querySelector('.main')?.setAttribute('style', `color: ${this.color}`)
    // .style.backgroundColor = this.color //
  }
}
