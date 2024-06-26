import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Subject, exhaustMap, map, take, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Address } from '../models/address.model';
import { Menu } from '../models/menu.model';
import { Restaurant } from '../models/restaurant.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
@Injectable()
export class RestaurantsService {
  private URL: string = `${environment.API_ENDPOINT}/restaurant`;
  restaurant = new Subject<Restaurant | null>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  public fetchRestaurants(name: string = '') {
    let url = `${this.URL}`;
    if (name) {
      url += `?orderBy="$key"&startAt="${name}"&endAt="${name}\uf8ff"`;
    }
    return this.http
      .get<{ restaurants: Restaurant[] }>(url)
      .pipe(map((responseData): Restaurant[] => responseData.restaurants));
  }

  public fetchRestaurant(name: string) {
    return this.http
      .get<{ restaurant: Restaurant }>(`${this.URL}/${name}`)
      .pipe(map((responseData): Restaurant => responseData.restaurant));
  }

  createRestaurant(name: string) {
    const restaurant: Restaurant = {
      name,
      about: '',
      address: new Address('', '', '', '', ''),
      bannerImageHref: '',
      businessHours: [],
      cuisine: [],
      id: '',
      logoHref: '',
      menu: {
        restaurantMenu: [],
      },
      rating: 0,
      url: `restaurants/${name}`,
    };
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (user && user.token && user.userId) {
          return this.http.put<Restaurant>(
            `${environment.API_ENDPOINT}/api/restaurants/${user.userId}.json`,
            { ...restaurant },
            {
              params: new HttpParams().set('auth', user ? user.token : ''),
            }
          );
        }
        return EMPTY;
      })
    );
  }

  public fetchMenu(restaurantId: string) {
    return this.http
      .get<{ restaurantMenu: any }>(
        `${environment.API_ENDPOINT}/menu/restaurant/${restaurantId}`
      )
      .pipe(
        map((responseData: Menu) => {
          return responseData.restaurantMenu[0];
        })
      );
  }
}
