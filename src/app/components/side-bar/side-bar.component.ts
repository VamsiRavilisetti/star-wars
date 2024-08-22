import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { StarWarsService } from 'src/app/services/star-wars.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  filter: boolean = true;
  constructor(private starWarsService: StarWarsService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart)
    ).subscribe((event: any) => {
      if (event.url == '/') {
        this.filter = true;
        this.starWarsService.personDetails.next(null)
      } else {
        this.filter = false;
        this.starWarsService.personDetails.subscribe(result => {
          console.log(result)
        })
      }
    });

  }

}
