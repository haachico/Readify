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
    imgContent:
      "https://thevisionmsms.org/wp-content/uploads/2017/09/IMG_0767.jpg",
    username: "dikshahakar",
    firstName: "Diksha",
    lastName: "Shahakar",
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
    imgContent:
      "https://s.yimg.com/uu/api/res/1.2/Ql4LtcVoCGQ8rOfO7103ZA--~B/aD0zMzE4O3c9NTAwMDtzbT0xO2FwcGlkPXl0YWNoeW9u/http://media.zenfs.com/en_us/News/ap_webfeeds/37ff6911599644dd861c145ff3f6bfeb.jpg",
    username: "baudhkaro_vruttant",
    firstName: "Vruttant",
    lastName: "Manwatkar",
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
  {
    _id: uuid(),
    content:
      " I am new to this app and new to reading books too. I am starting with this book",
    imgContent:
      "https://images.squarespace-cdn.com/content/v1/563890dce4b0facc12851d8f/1518946695868-3T5CPZ9W9WJURE2AGWPI/ZiSS+Front.jpg",
    username: "aaravkumar",
    firstName: "Aarav",
    lastName: "Kumar",
    email: "",
    image:
      "https://img.freepik.com/free-vector/head-man_1308-33466.jpg?w=740&t=st=1688096457~exp=1688097057~hmac=2937e19960047f58da9366c196910b6eb0a564b23b04655cad0d822e7a801318",
    followers: [],
    following: [],
    likes: {
      likeCount: 7,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    content:
      "Reading Normal people book currently. You will either love Sally Rooney's writing or love it. There is no in between.",
    imgContent:
      "https://cdn.vox-cdn.com/thumbor/p-gGrwlaU4rLikEAgYhupMUhIJc=/0x0:1650x2475/1200x0/filters:focal(0x0:1650x2475):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/13757614/817BsplxI9L.jpg",
    username: "neha_kamble",
    firstName: "Neha",
    lastName: "Kamble",
    email: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKK9buCr5tgVK2nsFKe_8KPzlSZ2629DCsEwEJ80xRj0rxF0Ts0FdBC3CigYQnrQrbh_s&usqp=CAU",
    followers: [],
    following: [],
    likes: {
      likeCount: 12,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    content: "Books and Cakes are LOVE! ❤️❤️❤️",
    imgContent: "",
    username: "neha_kamble",
    firstName: "Neha",
    lastName: "Kamble",
    email: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKK9buCr5tgVK2nsFKe_8KPzlSZ2629DCsEwEJ80xRj0rxF0Ts0FdBC3CigYQnrQrbh_s&usqp=CAU",
    followers: [],
    following: [],
    likes: {
      likeCount: 12,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    content: "It is always a joy to read Babasaheb. #JaiBhim",
    imgContent:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1613727572i/8521879.jpg",
    username: "rajeshgaikwad",
    firstName: "Rajesh",
    lastName: "Gaikwad",
    email: "",
    image: "https://yizhichoi.com/wp-content/uploads/2019/12/3d-avatar-1.jpg",
    followers: [],
    following: [],
    likes: {
      likeCount: 15,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    content:
      "The Buddha And His Dhamma by Dr Babasaheb Ambedkar is a must read by every indian. #JaiBhim",
    imgContent: "",
    username: "rajeshgaikwad",
    firstName: "Rajesh",
    lastName: "Gaikwad",
    email: "",
    image: "https://yizhichoi.com/wp-content/uploads/2019/12/3d-avatar-1.jpg",
    followers: [],
    following: [],
    likes: {
      likeCount: 15,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    content: "Couldn't sleep last night. I was crying. Reason? This.",
    imgContent:
      "https://lh3.googleusercontent.com/-zBo6uloi4iI/VZv7LTmY6jI/AAAAAAAAAIU/p2326yDyyWA/s640/blogger-image-744363386.jpg",
    username: "sanayakharat",
    firstName: "Sanaya",
    lastName: "Kharat",
    email: "",
    image:
      "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/09/reading-book-1296x728-header.jpg?w=1155&h=1528",
    followers: [],
    following: [],
    likes: {
      likeCount: 6,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    content: "Ocean Vuong's writing is so beautiful and poetic. Oh, my heart.",
    imgContent:
      "https://m.media-amazon.com/images/I/91om-N7Ry3L._AC_UF1000,1000_QL80_.jpg",
    username: "isha123",
    firstName: "Isha",
    lastName: "Jangle",
    email: "",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2gCxMb9rvETJpUcco4Pgq94spKRVAhft2vpdQb7qsk1Ni2DLv3KgVJuRrAsQTxuE2ST4&usqp=CAU",
    followers: [],
    following: [],
    likes: {
      likeCount: 6,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    content: "Started wiith Mistborn fantasy series!!!!",
    imgContent: "https://i.redd.it/hdpcqvr63ng71.jpg",
    username: "aishakhan",
    firstName: "Aisha",
    lastName: "Khan",
    email: "",
    image:
      "https://cdn3d.iconscout.com/3d/premium/thumb/long-bob-with-straight-bangs-women-5945740-4923277.png",
    followers: [],
    following: [],
    likes: {
      likeCount: 6,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    content: "I am excited to read this weekend finally!!!!",
    imgContent: "",
    username: "aishakhan",
    firstName: "Aisha",
    lastName: "Khan",
    email: "",
    image:
      "https://cdn3d.iconscout.com/3d/premium/thumb/long-bob-with-straight-bangs-women-5945740-4923277.png",
    followers: [],
    following: [],
    likes: {
      likeCount: 5,
      likedBy: [],
      dislikedBy: [],
    },

    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
];
