import getData from "./data";
import { DEFAULT, process } from "./process";

getData("Kanata")
  .then((data) => process(data, DEFAULT))
  .then(console.log);
