import getData from "./data";
import { IMPERIAL, METRIC, process } from "./process";

getData("Kanata")
  .then((data) => process(data, METRIC))
  .then(console.log);

getData("Kanata", true)
  .then((data) => process(data, IMPERIAL))
  .then(console.log);
