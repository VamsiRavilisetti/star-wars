import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { People } from 'src/app/models/people';
import { StarWarsService } from 'src/app/services/star-wars.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  id: any;
  profileData!: People;
  filmData: any[] = [];
  vehiclesData: any[] = [];
  starshipsData: any[] = [];
  constructor(private startWarsService: StarWarsService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.fetchData(this.id);
  }

  fetchData(id: any) {
    this.startWarsService.getPeopleWithId(id).subscribe(reuslts => {
      this.profileData = reuslts;
      this.startWarsService.personDetails.next(reuslts)
      this.profileData.films.map(film => {
        this.startWarsService.getItems(film).subscribe(reuslts => {
          this.filmData.push(reuslts)
        });
      });
      this.profileData.vehicles.map(vehicles => {
        this.startWarsService.getItems(vehicles).subscribe(reuslts => {
          this.vehiclesData.push(reuslts);
        });
      });
      this.profileData.starships.map(starship => {
        this.startWarsService.getItems(starship).subscribe(reuslts => {
          this.starshipsData.push(reuslts);
        });
      });
    });

  }
}
