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
    username: "Diksha Shahakar",
    email: "diksha",
    password: "diksha123",

    createdAt: formatDate(),
    updatedAt: formatDate(),
    image:
      "https://baudhkaro.com/wp-content/uploads/2020/10/diksha-e1603395889173.png",
  },
  {
    _id: uuid(),
    firstName: "Vruttant",
    lastName: "M",
    username: "Vruttant M",
    password: "vruttant123",
    email: "vruttant",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    image:
      "https://pbs.twimg.com/profile_images/1247146809824169984/SW5yQ9gX_400x400.jpg",
  },
];
