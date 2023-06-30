import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils";
/**
 * User Database can be added here.
 * You can add default users of your wish with different attributes
 * */

export const users = [
  {
    _id: uuid(),
    firstName: "Diksha",
    lastName: "Shahakar",
    username: "dikshahakar",
    email: "diksha",
    password: "diksha123",
    about: "Bibliophile, Music lover",
    link: "https://baudhkaro.com/",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    image:
      "https://baudhkaro.com/wp-content/uploads/2020/10/diksha-e1603395889173.png",
  },
  {
    _id: uuid(),
    firstName: "Vruttant",
    lastName: "M",
    username: "baudhkaro_vruttant",
    password: "vruttant123",
    about: "Bibliophile, Art lover",
    link: "https://baudhkaro.com/",
    email: "vruttant",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    image:
      "https://pbs.twimg.com/profile_images/1247146809824169984/SW5yQ9gX_400x400.jpg",
  },
  {
    _id: uuid(),
    firstName: "Aarav",
    lastName: "Kumar",
    username: "aaravkumar",
    email: "aarav@example.com",
    password: "aarav123",
    about: "Passionate reader, Nature lover",
    link: "https://example.com/",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    image:
      "https://img.freepik.com/free-vector/head-man_1308-33466.jpg?w=740&t=st=1688096457~exp=1688097057~hmac=2937e19960047f58da9366c196910b6eb0a564b23b04655cad0d822e7a801318",
  },
  {
    _id: uuid(),
    firstName: "Neha",
    lastName: "Kamble",
    username: "neha_kamble",
    password: "neha123",
    about: "Bookworm, Movie enthusiast",
    link: "https://example.com/",
    email: "neha@example.com",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKK9buCr5tgVK2nsFKe_8KPzlSZ2629DCsEwEJ80xRj0rxF0Ts0FdBC3CigYQnrQrbh_s&usqp=CAU",
  },
  {
    _id: uuid(),
    firstName: "Rajesh",
    lastName: "Gaikwad",
    username: "rajeshgaikwad",
    email: "rajesh@example.com",
    password: "rajesh123",
    about: "Bibliophile, Traveler",
    link: "https://example.com/",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    image: "https://yizhichoi.com/wp-content/uploads/2019/12/3d-avatar-1.jpg",
  },
  {
    _id: uuid(),
    firstName: "Sanaya",
    lastName: "Kharat",
    username: "sanayakharat",
    email: "sanaya@example.com",
    password: "sanaya123",
    about: "Reader, Music lover",
    link: "https://example.com/",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    image:
      "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/09/reading-book-1296x728-header.jpg?w=1155&h=1528",
  },
  {
    _id: uuid(),
    firstName: "Isha",
    lastName: "Jangle",
    username: "ishajangle",
    email: "isha@example.com",
    password: "isha123",
    about: "Book enthusiast, Fitness freak",
    link: "https://example.com/",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2gCxMb9rvETJpUcco4Pgq94spKRVAhft2vpdQb7qsk1Ni2DLv3KgVJuRrAsQTxuE2ST4&usqp=CAU",
  },
  {
    _id: uuid(),
    firstName: "Aisha",
    lastName: "Khan",
    username: "aishakhan",
    email: "aisha@example.com",
    password: "aisha123",
    about: "Passionate reader, Foodie",
    link: "https://example.com/",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    image:
      "https://cdn3d.iconscout.com/3d/premium/thumb/long-bob-with-straight-bangs-women-5945740-4923277.png",
  },
];
