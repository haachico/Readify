import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils";

/**
 * Posts can be added here.
 * You can add default posts of your wish with different attributes
 * */

export const posts = [
  {
    _id: uuid(),
    content:
      "I am reading Aristotle and Dante Discovers the secrets of the universe book and I am loving it!!!!!",
    username: "Diksha Shahakar",
    firstName: "",
    lastNamae: "",
    email: "",
    image:
      "https://baudhkaro.com/wp-content/uploads/2020/10/diksha-e1603395889173.png",
    followers: [],
    following: [],
    likes: {
      likeCount: 8,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    content: "I AM IN LOVE WITH MURAKAMI's SURREALISM!!!!!",
    username: "Vruttant M",
    firstName: "",
    lastNamae: "",
    email: "",
    image:
      "https://pbs.twimg.com/profile_images/1247146809824169984/SW5yQ9gX_400x400.jpg",
    followers: [],
    following: [],
    likes: {
      likeCount: 10,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
];
