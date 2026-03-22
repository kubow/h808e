import planets from "$lib/store/planets_test.json";

export function load() {
  return {
    sample: planets.slice(0, 365),
  };
}
