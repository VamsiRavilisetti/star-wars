import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { filterOptions, People } from 'src/app/models/people';
import { StarWarsService } from 'src/app/services/star-wars.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  filter: boolean = true;
  characterDetails!: People;
  filterOptions: filterOptions = {
    film: [],
    species: [],
    vehicle: [],
    starShip: [],
    birthYear: []
  };
  peopleData: People[] = [];
  filteredPeopleData: People[] = []; // Separate array for filtered data

  constructor(private starWarsService: StarWarsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart)
    ).subscribe((event: any) => {
      if (event.url == '/') {
        this.filter = true;
        this.starWarsService.personDetails.next(null);
      } else {
        this.filter = false;
        this.starWarsService.personDetails.subscribe(result => {
          this.characterDetails = result;
        });
      }
    });

    this.starWarsService.people$.subscribe(data => {
      this.peopleData = data; // Original data
      this.filteredPeopleData = [...data]; // Initialize filtered data
    });

    this.getAllMovies();
    this.getAllSpecies();
    this.getAllBirthYear();
    this.getAllVehicles();
  }

  getAllMovies() {
    let url = 'https://swapi.dev/api/films/';
    this.starWarsService.getItems(url).subscribe(response => {
      this.filterOptions.film = [...response.results];
    });
  }
  getAllVehicles() {
    let url = 'https://swapi.dev/api/vehicles/';
    this.starWarsService.getItems(url).subscribe(response => {
      this.filterOptions.vehicle = [...response.results];
    });
  }

  getAllSpecies() {
    let url = 'https://swapi.dev/api/species/';
    this.starWarsService.getItems(url).subscribe(response => {
      this.filterOptions.species = [...response.results];
    });
  }

  getAllBirthYear() {
    let url = 'https://swapi.dev/api/people/';
    this.starWarsService.getItems(url).subscribe(response => {
      this.filterOptions.birthYear = [...new Set(response.results.map((element: any) => element.birth_year))];
    });
  }

  filterChanges: filterOptions = {
    film: [],
    species: [],
    vehicle: [],
    starShip: [],
    birthYear: []
  };

  changes(change: string, type: string) {
    const updateFilterArray = (filterArray: string[], value: string) => {
      const index = filterArray.indexOf(value);
      if (index === -1) {
        filterArray.push(value);
      } else {
        filterArray.splice(index, 1);
      }
    };

    switch (type) {
      case 'film':
        updateFilterArray(this.filterChanges.film, change);
        break;
      case 'species':
        updateFilterArray(this.filterChanges.species, change);
        break;
      case 'vehicle':
        updateFilterArray(this.filterChanges.vehicle, change);
        break;
      case 'starShip':
        updateFilterArray(this.filterChanges.starShip, change);
        break;
      case 'birth_year':
        updateFilterArray(this.filterChanges.birthYear, change);
        break;
    }
  }

  applyFilters() {
    // let data = this.peopleData;
    this.filteredPeopleData = this.peopleData.filter(character => {
      return this.filterByFilm(character) &&
        this.filterBySpecies(character) &&
        this.filterByVehicle(character) &&
        this.filterByBirthYear(character);
    });


    console.log('Filtered Data:', this.filteredPeopleData);
    this.filterChanges = {
      film: [],
      species: [],
      vehicle: [],
      starShip: [],
      birthYear: []
    };
    this.starWarsService.updatePeople(this.filteredPeopleData)
  }

  filterByFilm(character: People): boolean {
    if (this.filterChanges.film.length === 0) return true;
    return this.filterChanges.film.some(film => character.films.includes(film));
  }

  filterBySpecies(character: People): boolean {
    if (this.filterChanges.species.length === 0) return true;
    return character.species.some(species => this.filterChanges.species.includes(species));
  }

  filterByVehicle(character: People): boolean {
    if (this.filterChanges.vehicle.length === 0) return true;
    return character.vehicles.some(vehicle => this.filterChanges.vehicle.includes(vehicle));
  }


  filterByBirthYear(character: People): boolean {
    if (this.filterChanges.birthYear.length === 0) return true;
    return this.filterChanges.birthYear.includes(character.birth_year);
  }
}
