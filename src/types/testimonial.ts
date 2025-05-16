export interface Testimonial {
  id?: string;
  name: string;
  position: string;
  avatarSrc: string;
  rating: number;
  desc: {
    [language: string]: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
