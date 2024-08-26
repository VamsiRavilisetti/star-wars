import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { filterOptions, People } from 'src/app/models/people';
import { StarWarsService } from 'src/app/services/star-wars.service';

type FilterType = 'film' | 'species' | 'vehicle' | 'birthYear';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  filter: boolean = true;
  characterDetails:any;
  filterOptions: filterOptions = {
    film: [],
    species: [],
    vehicle: [],
    birthYear: [],
    starShip: []
  };
  peopleData: People[] = [];         // Original data
  filteredPeopleData: People[] = []; // Data after filtering

  filterChanges: { [key in FilterType]: Set<string> } = {
    film: new Set<string>(),
    species: new Set<string>(),
    vehicle: new Set<string>(),
    birthYear: new Set<string>()
  };

  constructor(private starWarsService: StarWarsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: any) => {
      this.filter = event.url === '/';
      if (!this.filter) {
        this.starWarsService.personDetails.subscribe(result => this.characterDetails = result);
      } else {
        this.starWarsService.personDetails.next(null);
      }
    });

    this.starWarsService.people$.subscribe(data => {
      this.peopleData = data;
      this.filteredPeopleData = [...data];
    });
    this.getAllFilters();
  }

  getAllFilters() {
    const baseUrl = 'https://swapi.dev/api/';
    this.starWarsService.getItems(`${baseUrl}films/`).subscribe(response => this.filterOptions.film = response.results);
    this.starWarsService.getItems(`${baseUrl}vehicles/`).subscribe(response => this.filterOptions.vehicle = response.results);
    this.starWarsService.getItems(`${baseUrl}species/`).subscribe(response => this.filterOptions.species = response.results);
    this.starWarsService.getItems(`${baseUrl}people/`).subscribe(response => {
      this.filterOptions.birthYear = [...new Set(response.results.map((element: any) => element.birth_year))];
    });
  }

  changes(change: string, type: FilterType) {
    if (this.filterChanges[type].has(change)) {
      this.filterChanges[type].delete(change);
    } else {
      this.filterChanges[type].add(change);
    }
  }
  applyFilters() {
    console.log(this.peopleData, 'original data');
    console.log(this.filterChanges, 'filter selected changes');

    this.filteredPeopleData = this.peopleData.filter(character => {
      const filmMatch = this.filterChanges.film.size === 0 || Array.from(this.filterChanges.film).some(selectedFilm =>
        character.films.includes(selectedFilm)
      );
      const speciesMatch = this.filterChanges.species.size === 0 || character.species.some(species => this.filterChanges.species.has(species));
      const vehicleMatch = this.filterChanges.vehicle.size === 0 || character.vehicles.some(vehicle => this.filterChanges.vehicle.has(vehicle));
      const birthYearMatch = this.filterChanges.birthYear.size === 0 || this.filterChanges.birthYear.has(character.birth_year);
      return filmMatch && speciesMatch && vehicleMatch && birthYearMatch;
    });

    console.log(this.filteredPeopleData, 'result after filtering');

    // Update the data in the service
    this.starWarsService.updatePeople(this.filteredPeopleData);

    // Reset the checkbox selections and filters
    this.resetFilters();

    // Restore the original data for further filtering
    this.starWarsService.getAllPeopleData().subscribe(response => {
      this.peopleData = response.results;
      this.peopleData.forEach((element: any) => {
        if (element.species.length === 0) {
          element.species[0] = 'Human';
        } else {
          element.species.forEach((speciesUrl: any, index: number) => {
            this.starWarsService.getItems(speciesUrl).subscribe((species: any) => {
              element.species[index] = species.name;
              element.species = [...element.species];
            });
          });
        }
      });
    });
  }


  resetFilters() {
    this.filterChanges = {
      film: new Set<string>(),
      species: new Set<string>(),
      vehicle: new Set<string>(),
      birthYear: new Set<string>()
    };

    this.filteredPeopleData = [...this.peopleData];
  }
}
