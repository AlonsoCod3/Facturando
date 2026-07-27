import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GridListComponent } from '../../components/grid-list/grid-list.component';

@Component({
  selector: 'app-ticket',
  imports: [RouterLink, GridListComponent],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  
}
