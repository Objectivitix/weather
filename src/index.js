import getData from "./data";
import { render, renderWeek } from "./dom";
import { IMPERIAL, METRIC, process } from "./process";

renderWeek();

getData("Kanata")
  .then((data) => process(data, METRIC))
  .then(render);

getData("Kanata", true)
  .then((data) => process(data, IMPERIAL))
  .then(console.log);
