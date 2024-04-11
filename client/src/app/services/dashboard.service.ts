import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Restaurant } from '../models/restaurant.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

// TODO: remove and re-use the menu.model
export interface MenuItemType {
  name: string;
  id?: string;
  description: string;
  category: string;
  price: number;
  imageURL: string;
  availability?: boolean;
}

export interface MenuType {
  name: string;
  id?: string;
  description: string;
  items: MenuItemType[];
}

export interface GeneralInfoType {
  name: String;
  address: any;
  bannerImage: String;
  logo: String;
  businessHour: BusinessHour;
  cuisine: String;
  rating: String;
  about: String;
  websiteURL: String;
  phoneNumber: String;
  email: String;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
}

export interface BusinessHour {
  mondayStartingTime: string;
  mondayEndingTime: string;
  tuesdayStartingTime: string;
  tuesdayEndingTime: string;
  wednesdayStartingTime: string;
  wednesdayEndingTime: string;
  thursdayStartingTime: string;
  thursdayEndingTime: string;
  fridayStartingTime: string;
  fridayEndingTime: string;
  saturdayStartingTime: string;
  saturdayEndingTime: string;
  sundayStartingTime: string;
  sundayEndingTime: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  public generalInfoSubject: Subject<{}> = new Subject();
  public reservationInfoSubject: Subject<{}> = new Subject();
  public menuSubject: Subject<MenuType[]> = new Subject();
  private URL: string = `${environment.API_ENDPOINT}`;
  private currentUser?: User | null;
  constructor(private authService: AuthService, private http: HttpClient) {
    this.authService.user.subscribe((user) => {
      this.currentUser = user;
    });
  }

  private generalInfo: GeneralInfoType = {
    name: 'Aloha Bites',
    about:
      "Aloha Bites is a taste of the Hawaiian islands right in the heart of Tropical Paradise. Enjoy our fresh seafood dishes and traditional Hawaiian flavors. Whether it's poke bowls or grilled mahi-mahi, we bring the spirit of aloha to your plate.",
    logo: 'https://images.rawpixel.com/image_1300/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvMzEyLXRlZDkzNzktY2hpbS5qcGc.jpg',
    bannerImage:
      'https://images.rawpixel.com/image_600/cHJpdmF0ZS9zdGF0aWMvaW1hZ2VzL3dlYnNpdGUvMjAyMi0wNi90cDI3MS1wcmVzZW50YXRpb24tMTMuanBn.jpg',
    address: {
      street: '789',
      city: 'Luau Lane',
      province: 'Tropical Paradise',
      postalCode: 'M1M1M1',
      country: 'Canada',
    },
    websiteURL: "alohabite.com'",
    phoneNumber: '4629899763',
    email: 'alohabite@gmail.com',
    businessHour: {
      mondayStartingTime: '11',
      mondayEndingTime: '19',
      tuesdayStartingTime: '12',
      tuesdayEndingTime: '20',
      wednesdayStartingTime: '13',
      wednesdayEndingTime: '21',
      thursdayStartingTime: '14',
      thursdayEndingTime: '22',
      fridayStartingTime: '15',
      fridayEndingTime: '23',
      saturdayStartingTime: '16',
      saturdayEndingTime: '24',
      sundayStartingTime: '0',
      sundayEndingTime: '0',
    },
    cuisine: 'String',
    rating: 'String',
  };

  private menu: MenuType[] = [
    {
      name: 'Seafood',
      description: '',
      items: [
        {
          name: 'Grilled Salmon',
          description:
            'A succulent grilled salmon fillet seasoned to perfection.',
          category: 'Seafood',
          price: 19.99,
          imageURL:
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=2960&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          availability: true,
        },
        {
          name: 'Ribeye Steak',
          description:
            'A succulent grilled salmon fillet seasoned to perfection.',
          category: 'Seafood',
          price: 29.99,
          imageURL:
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=2960&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          availability: true,
        },
      ],
    },
  ];

  private reservationInfo = {
    slotInterval: '60',
    bufferTime: '0',
    tableCount: null,
    capacityPerTable: null,
  };

  getGeneralInfoData() {
    return this.http
      .get<{ restaurant: Restaurant }>(
        `${this.URL}/restaurant/${this.currentUser?.userId}`
      )
      .pipe(map((data) => data.restaurant));
  }
  getMenuDataByCategory() {
    return [...this.menu];
  }
  getReservationInfoData() {
    return { ...this.reservationInfo };
  }

  getCategories() {
    return ['Seafood', 'sides'];
  }

  updateGeneralInfoData(data: any) {
    const mappedBusinessHours = [
      {
        openHours: {
          startTime: data.businessHours.mondayStartingTime,
          endTime: data.businessHours.mondayEndingTime,
        },
        day: 'Monday',
      },
      {
        openHours: {
          startTime: data.businessHours.thursdayStartingTime,
          endTime: data.businessHours.tuesdayEndingTime,
        },
        day: 'Tuesday',
      },
      {
        openHours: {
          startTime: data.businessHours.wednesdayStartingTime,
          endTime: data.businessHours.wednesdayEndingTime,
        },
        day: 'Wednesday',
      },
      {
        openHours: {
          startTime: data.businessHours.thursdayStartingTime,
          endTime: data.businessHours.thursdayEndingTime,
        },
        day: 'Thursday',
      },
      {
        openHours: {
          startTime: data.businessHours.fridayStartingTime,
          endTime: data.businessHours.fridayEndingTime,
        },
        day: 'Friday',
      },
      {
        openHours: {
          startTime: data.businessHours.saturdayStartingTime,
          endTime: data.businessHours.saturdayEndingTime,
        },
        day: 'Saturday',
      },
      {
        openHours: {
          startTime: data.businessHours.sundayStartingTime,
          endTime: data.businessHours.sundayEndingTime,
        },
        day: 'Sunday',
      },
    ];
    data.businessHours = mappedBusinessHours;

    console.log('sending req: ', data);
    return this.http
      .put<{ restaurant: Restaurant }>(
        `${this.URL}/restaurant/${this.currentUser?.userId}`,
        data
      )
      .pipe(map((data) => data.restaurant));
  }
  updateReservationInfoData(data: any) {
    this.reservationInfo = data;
    this.reservationInfoSubject.next(this.getReservationInfoData());
  }

  addNewCategory(data: MenuType) {
    this.menu.push(data);
    this.menuSubject.next(this.getMenuDataByCategory());
    console.log('Updated Menu Category', this.getMenuDataByCategory());
  }
  addNewMenuItem(data: any) {
    const newMenuList = [...this.menu];
    newMenuList.forEach((category) => {
      if (category.name === data.category) {
        category.items.push(data);
      }
    });
    this.menuSubject.next(this.getMenuDataByCategory());
  }

  updateCategory(data: MenuType) {}

  updateMenuItem(data: MenuItemType) {}
}
