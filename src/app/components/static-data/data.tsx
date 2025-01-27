import Logo1 from "../../../assests/img/logo1.png";
import Logo2 from "../../../assests/img/logo2.jpg";
import Logo3 from "../../../assests/img/logo3.jpeg";
import Logo4 from "../../../assests/img/logo4.png";
import Logo5 from "../../../assests/img/logo5.jpeg";
import Logo6 from "../../../assests/img/logo6.jpeg";
import Logo7 from "../../../assests/img/logo7.jpg";
import Logo8 from "../../../assests/img/logo8.jpeg";
import Logo9 from "../../../assests/img/logo9.jpeg";
import Logo10 from "../../../assests/img/logo10.png";

//About us Core Values Data
export interface NewsType {
  id: string;
  title: string;
  src: string;
}

export const NewsHero: NewsType[] = [
  {
    id: "1",
    title: "The Punch",
    src: Logo1.src,
  },
  {
    id: "2",
    title: "Daily News",
    src: Logo2.src,
  },
  {
    id: "3",
    title: "Gist Lover",
    src: Logo3.src,
  },
  {
    id: "4",
    title: "Vanguard",
    src: Logo4.src,
  },
  {
    id: "5",
    title: "Naira Land",
    src: Logo5.src,
  },
  {
    id: "6",
    title: "Fountain Gist",
    src: Logo6.src,
  },
  {
    id: "7",
    title: "Naija Gist",
    src: Logo7.src,
  },
  {
    id: "8",
    title: "Linda Ikeji",
    src: Logo8.src,
  },

  {
    id: "9",
    title: "Sahara",
    src: Logo9.src,
  },
  {
    id: "10",
    title: "The Guardian",
    src: Logo10.src,
  },
];
