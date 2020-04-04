import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-afikoman',
  templateUrl: './afikoman.component.html',
  styleUrls: ['./afikoman.component.scss']
})
export class AfikomanComponent implements OnInit {

  constructor(public el: ElementRef) { }

  ngOnInit(): void {
  }

}
