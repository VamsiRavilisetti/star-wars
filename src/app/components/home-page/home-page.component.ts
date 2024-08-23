import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { People } from 'src/app/models/people';
import { StarWarsService } from 'src/app/services/star-wars.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  peopleData: People[] = [];
  displayedColumns: string[] = ['Sl.No', 'Character Name', 'Species', 'Birth Year'];
  dataSource!: MatTableDataSource<People>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private starWarsService: StarWarsService, private router: Router) {
  }

  ngOnInit(): void {
    this.fetchData();
    this.starWarsService.people$.subscribe(data => {
      this.peopleData = data; // Update local data when observable emits new data
      this.dataSource = new MatTableDataSource(this.peopleData);
      this.dataSource.paginator = this.paginator;
    });
  }


  fetchData() {
    this.starWarsService.getAllPeopleData().subscribe(response => {
      this.peopleData = response.results;
      this.starWarsService.updatePeople(this.peopleData);
      this.peopleData.forEach((element: any) => {
        if (element.species.length == 0) {
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
      this.dataSource = new MatTableDataSource(this.peopleData);
      this.dataSource.paginator = this.paginator;
    })
  }
  characterDetails(selected: any) {
    if (selected) {
      this.router.navigate(["profile/" + selected]);
    }
  }
}
