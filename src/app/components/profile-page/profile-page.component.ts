import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { People } from 'src/app/models/people';
import { StarWarsService } from 'src/app/services/star-wars.service';
import { forkJoin } from 'rxjs';

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
    this.startWarsService.getPeopleWithId(id).subscribe(results => {
      this.profileData = results;
      this.startWarsService.personDetails.next(results);

      const filmRequests = this.profileData.films.map(film => this.startWarsService.getItems(film));
      const vehicleRequests = this.profileData.vehicles.map(vehicle => this.startWarsService.getItems(vehicle));
      const starshipRequests = this.profileData.starships.map(starship => this.startWarsService.getItems(starship));

      forkJoin([...filmRequests, ...vehicleRequests, ...starshipRequests]).subscribe(responses => {
        const [films, vehicles, starships] = [
          responses.slice(0, filmRequests.length),
          responses.slice(filmRequests.length, filmRequests.length + vehicleRequests.length),
          responses.slice(filmRequests.length + vehicleRequests.length)
        ];

        this.filmData = films;
        this.vehiclesData = vehicles;
        this.starshipsData = starships;
      });
    });
  }
}
