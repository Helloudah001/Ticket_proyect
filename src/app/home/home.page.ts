import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  eventList: any;
  categoryList: any;
  selectedCategoryId: any;

  constructor(
    private router: Router,
    private storage: Storage,
    private eventService: EventsService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.storage.set('mostreLaIntro', true);
  }

  ionViewDidEnter() {
    // Obtener eventos
    this.eventService.getEvents().then((res) => {
      this.eventList = res;
      console.log("Eventos desde el servidor", this.eventList);
    });

    // Obtener categorías
    this.eventService.getCategories().then((res) => {
      this.categoryList = res;
      console.log("Categorías", this.categoryList);
    });
  }

  selectCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;

    // Obtener detalles de una categoría específica (opcional)
    this.eventService.getCategoryById(categoryId).then((category) => {
      console.log("Detalles de la categoría", category);
    });
  }

  goToIntro() {
    console.log("go to intro");
    this.router.navigateByUrl('/intro');
    this.storage.set('mostreLaIntro', true);
  }
}
